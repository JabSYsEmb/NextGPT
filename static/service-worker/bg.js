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

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0]; // Get the active tab
    const newUrl = `https://www.chatgpt.com?search=${encodeURIComponent(text)}`; // Replace with your desired URL

    chrome.tabs.update(currentTab.id, { url: newUrl }); // Navigate to the new domain
  });
});

chrome.runtime.onMessage.addListener(function (props, _sender, sendResponse) {
  // refer for more details why this is needed
  // https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
  const tabId = _sender.tab?.id;
  if (!tabId) return;

  (async () => {
    const { action, ...rest } = props;

    if (!action) return;

    if (action === "export") {
      return handleExport(rest, tabId);
    }

    if (action === "copy-to-clipboard") {
      let data = prepare_data_obj(rest?.data);
      data &&= parse_and_embed_content_references(data);
      data &&= md_callback(data);

      const errmsg = "something-went-wrong, try-again!\n or contact cabbar.serif@hotmail.com for support";

      return chrome.scripting.executeScript({
        target: { tabId },
        func: ({ data }) => navigator.clipboard.writeText(data ?? errmsg),
        args: [data],
      });
    }

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
      const md = md_callback(data).data;

      return await chrome.downloads.download({
        url: "https://md-to-pdf.fly.dev/",
        method: "POST",
        body: `markdown=${md}`,
        headers: [
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
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
      return await chrome.scripting.executeScript({
        target: { tabId },
        func: trigger_file_download,
        args: [md_callback(data)],
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
          ["code", "text"].find((type) => type === item.message?.content?.content_type.toLowerCase())
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

function md_callback(payload) {
  let { filename, update_time_ISO } = payload;

  const data = payload.messages
    .filter((msg) => msg.message.content.parts)
    .map((msg) => {
      let message = msg.message.content.parts[0];

      if (msg.message.author.role === "user") {
        message = `> ${message.replaceAll("\n\n", "\n").replaceAll("\n", "\n> ")}`;
      }

      return message;
    })
    .join("\n\n");

  filename = `${filename}-${update_time_ISO}.md`;

  return {
    filename,
    data,
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
