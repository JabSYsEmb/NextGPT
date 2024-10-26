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

chrome.omnibox.onInputEntered.addListener(async (text) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0]; // Get the active tab
    const newUrl = `https://www.chatgpt.com?search=${encodeURIComponent(text)}`; // Replace with your desired URL

    chrome.tabs.update(currentTab.id, { url: newUrl }); // Navigate to the new domain
  });
});

chrome.runtime.onMessage.addListener(async (props) => {
  const tabId = await get_active_tabId();
  if (!tabId) return;

  const { action, ...rest } = props;

  if (action == "export") {
    return handleExport(rest, tabId);
  }

  chrome.scripting
    .executeScript({
      target: { tabId },
      files: [`src/${action}/inject.js`],
    })
    .catch((err) => console.error(err));
});

function handleExport(args, tabId) {
  let { data, format } = args;
  data = prepare_data_obj(data);
  data = parse_and_embed_content_references(data);
  const filename = `${data.filename}-${data.update_time_ISO}.${format}`;

  switch (format.toUpperCase()) {
    case "PDF":
      const md = data.messages
        .map(({ message }) => message.content.parts)
        .flat()
        .join("\n");

      chrome.downloads.download({
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
      break;

    case "JSON":
      chrome.scripting.executeScript({
        target: { tabId },
        func: trigger_file_download,
        args: [json_callback(data)],
      });
      break;

    case "MD":
      chrome.scripting.executeScript({
        target: { tabId },
        func: trigger_file_download,
        args: [md_callback(data)],
      });
      break;

    case "DOCX":
      chrome.downloads.download({
        url: "data:application/json;base64,eyJuYW1lIjoiQ2hhdEdQVCIsInB1cnBvc2UiOiJBc3Npc3QifQ==",
        filename,
      });
      break;

    default:
      console.error(`No exports available for .${format} files!`);
  }
}

async function get_active_tabId() {
  return await chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab && !new URL(tab.url).hostname.includes("chatgpt")) return -1;
    return tab.id;
  });
}

function get_domain_name(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function prepare_data_obj(res) {
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
    .map((msg, id) => ({
      id,
      author: msg.message.author.role,
      message: msg.message.content.parts,
    }))
    .map((msg) => msg.message)
    .flat()
    .join("\n");

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
