/// <reference path="../../node_modules/chrome-types/index.d" />

chrome.runtime.onInstalled.addListener(({ reason }) => {
  switch (reason) {
    case "install":
      console.log("extension has been installed successfully");
      break;
    default:
      console.log("chrome.runtime.onInstalled has been invoked");
      break;
  }
});

chrome.omnibox.onInputEntered.addListener(function (text) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const { id } = tabs[0]; // Get the active tab
    const targetURL = `https://www.chatgpt.com?search=${encodeURIComponent(text)}`;
    chrome.tabs.update(id, { url: targetURL });
  });
});

chrome.runtime.onMessage.addListener(function (props, _sender, sendResponse) {
  // refer for more details on why this function returns true at the end and have
  // iife function inside of it, see the links below!
  // https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
  // https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
  const tabId = _sender.tab?.id;
  if (!tabId || !props.action) return;

  (async () => {
    const { action, ...rest } = props;

    if (action === "export") {
      return handleExport(rest, tabId);
    }

    if (action === "copy-to-clipboard") {
      let data = prepare_data_obj(rest?.data);
      data &&= parse_and_embed_content_references(data);
      data &&= await md_callback(data, tabId);

      const errmsg = `
      something-went-wrong, try-again!\n
      if the the extension still copy the wrong thing please contact us on cabbar.serif@hotmail.com for supporting on the matter`;

      return chrome.scripting.executeScript({
        target: { tabId },
        func: ({ data }) => navigator.clipboard.writeText(data ?? errmsg),
        args: [data],
      });
    }

    // ToDo checks for the exisiting of the script before executing it.
    await chrome.scripting
      .executeScript({
        target: { tabId },
        files: [`src/${action}/inject.js`],
      })
      .then((res) => sendResponse(res))
      .catch((err) => console.error(err));
  })();

  return true;
});

async function handleExport(args, tabId) {
  let { data, format } = args;
  data = prepare_data_obj(data);
  data = parse_and_embed_content_references(data);
  const filename = `${data.filename}-${data.update_time_ISO}.${format}`;

  switch (format.toUpperCase()) {
    case "PDF":
      const md = (await md_callback(data, tabId)).data;
      const payload = new URLSearchParams();
      payload.append("markdown", md);

      return await chrome.downloads.download({
        url: "https://md-to-pdf.fly.dev/",
        method: "POST",
        body: payload.toString(),
        headers: [
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded;charset=UTF-8",
          },
        ],

        filename,
      });

    case "JSON":
      return await chrome.scripting.executeScript({
        target: { tabId },
        func: trigger_file_download,
        args: [json_callback(data)],
      });

    case "MD":
      const args = await md_callback(data, tabId);
      return await chrome.scripting.executeScript({
        target: { tabId },
        func: trigger_file_download,
        args: [args],
      });

    case "DOCX":
      return await chrome.downloads.download({
        url: "data:application/json;base64,eyJuYW1lIjoiQ2hhdEdQVCIsInB1cnBvc2UiOiJBc3Npc3QifQ==",
        filename,
      });
  }
}

function get_domain_name(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function prepare_data_obj(res) {
  if (!res) return;

  return {
    title: res.title,
    create_time: res.create_time,
    update_time: res.update_time,
    update_time_ISO: new Date(res.update_time * 1000).toISOString().replaceAll(":", "-").split(".")[0],
    filename: prepare_filename(res.title),
    messages: Object.values(res.mapping)
      .filter((item) => {
        return (
          ["user", "assistant", "tool"].find((author) => author === item.message?.author?.role.toLowerCase()) &&
          ["code", "text", "multimodal_text"].find((type) => type === item.message?.content?.content_type.toLowerCase())
        );
      })
      .filter(({ message }) => message.content.parts),
  };
}

function parse_and_embed_content_references(data) {
  data.messages.forEach(({ message }, id) => {
    // do we need to check if message.content.parts exists? no but for unexpected cases
    // or when chatgpt changes their structure in the future
    const { content, metadata } = message;
    if (!content.parts || !metadata.content_references) return;
    if (metadata.content_references.length === 0) return;

    let parts = content.parts;

    const references = metadata.content_references.filter((ref) => ref.matched_text.includes("\u2020"));

    const referencesWithoutTitle = metadata.content_references.filter((ref) => !ref.matched_text.includes("\u2020"));

    for (const { matched_text, url } of references) {
      parts = parts.map((part) => part.replace(matched_text, ` [[${get_domain_name(url)}](${url})]`));
    }

    for (const { matched_text, url, title } of referencesWithoutTitle) {
      parts = parts.map((part) => part.replace(matched_text, ` [${title}](${url})\n`));
    }

    data.messages[id].message.content.parts = parts;
  });

  return data;
}

function json_callback(payload) {
  const { filename, update_time_ISO } = payload;

  const data = payload.messages
    .filter((msg) => msg.message.content.parts)
    .map((msg, id) => ({
      id,
      author: msg.message.author.role,
      message: msg.message.content.parts,
    }));

  return {
    data,
    filename: `${filename}-${update_time_ISO}.json`,
  };
}

/**
 *
 * @param {Object} payload - /conversation/{id} response object from server
 * @param {number} tabId - tabId is needed for handle conversation with static assets (images, videos, etc.)
 * @returns
 */
async function md_callback(payload, tabId) {
  let { filename, update_time_ISO } = payload;

  const data = await Promise.all(
    payload.messages
      .filter((msg) => msg.message.content.parts)
      .map(async (msg) => {
        const { recipient, author } = msg.message;
        const content = msg.message.content;
        const result = [];

        for (const part of content.parts) {
          switch (author.role) {
            case "assistant":
              if (recipient === "all") result.push(part);
              break;
            case "user":
              if (part.content_type === "image_asset_pointer") {
                const assetURI = await chrome.tabs
                  .sendMessage(tabId, { action: "get-asset", asset: part.asset_pointer })
                  .then((url) => url)
                  .catch(() => null);
                result.push(assetURI ? `> ![](${assetURI})` : `<-- failed to fetch resource -->`);
              } else {
                result.push(`> ${part?.replaceAll("\n\n", "\n")?.replaceAll("\n", "\n> ") ?? ""}`);
              }
              break;
            case "tool":
              // dalle a tool, for image generation
              if (author.name?.includes("dalle") && part.asset_pointer) {
                const assetURI = await chrome.tabs
                  .sendMessage(tabId, { action: "get-asset", asset: part.asset_pointer })
                  .then((url) => url)
                  .catch(() => null);
                result.push(
                  assetURI
                    ? `![${part?.metadata?.dalle?.prompt?.split(".")[0] ?? ""}](${assetURI})`
                    : `<-- failed to fetch resource -->`
                );
              }
              break;
          }
        }

        return result;
      })
  );

  filename = `${filename}-${update_time_ISO}.md`;

  return {
    filename,
    data: data.flat(Infinity).filter(Boolean).join("\n\n"),
  };
}

function trigger_file_download({ data = [], filename = "data.txt" }) {
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 2);
  }

  const blob = new Blob([data], { type: "text/json" });
  const a = document.createElement("a");

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
  a.click();
}

function prepare_filename(filename, options) {
  if (filename === undefined || filename === "") return "no-title";

  filename = filename.replace(/\s+/g, "-");

  const replacement = (options && options.replacement) || "";

  // https://stackoverflow.com/questions/78666278/chrome-downloads-api-replace-invalid-characters-in-filename-with-regex/78675894#78675894
  const sanitize = (input, replacement) => {
    return input.replace(
      /[:?"*<>|~/\\\u{1}-\u{1f}\u{7f}\u{80}-\u{9f}\p{Cf}\p{Cn}]|^[.\u{0}\p{Zl}\p{Zp}\p{Zs}]|[.\u{0}\p{Zl}\p{Zp}\p{Zs}]$|^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?=\.|$)/giu,
      replacement ?? ""
    );
  };

  return sanitize(filename, replacement);
}
