import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || "";
  });
};

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
      <a href="#${note.id}" class="note">
        <h4>${note.title}</h4>
        <small class="date">
          ${new Date(note.id).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </small>
      </a>
      `;
    })
    .join("\n");
};

export const formatFullNote = (notes) => {
  return notes
    .map((note) => {
      return `            
            <section id="${note.id}" class="full__note">
              <h2>${note.title}</h2>
              <div class="tags">
                ${note.tags
                  .map((tag) => `<span class="tag">${tag}&nbsp;</span>`)
                  .join("")}
              </div>
              <p>${formatToHTMLList(note.content)}</p>
              <button class="pip-btn" data-id="${
                note.id
              }" onclick="pipRequest(event)">          
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z"/></svg>
              </button>
            </section>`;
    })
    .join("\n");
};

function formatToHTMLList(content) {
  const items = content
    .trim()
    .split("\n")
    .filter((item) => item.trim != "");
  const listItems = items
    .map((item) => {
      if (item.startsWith("-")) {
        return `<li>${item.slice(1).trim()}</li>`;
      } else if (item.startsWith("*")) {
        if (item.startsWith("**")) {
          return `<li class="checkbox checked">${item.slice(2).trim()}</li>`;
        } else {
          return `<li class="checkbox">${item.slice(1).trim()}</li>`;
        }
      } else {
        return `<li>${item.trim()}</li>`;
      }
    })
    .join("");
  return `<ul>${listItems}</ul>`;
}

{
  /* <p>${note.content}</p>
<div class="tags">
  ${note.tags.map((tag) => `<span class="tag">${tag}&nbsp;</span>`).join("")}
</div> */
}

export const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL("./templates/index.html", import.meta.url)
      .pathname;
    const template = await fs.readFile(HTML_PATH, "utf-8");
    const html = interpolate(template, {
      notesList: formatNotes(notes),
      fullNoteList: formatFullNote(notes),
    });

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
};

export const start = (notes, port = 5000) => {
  const server = createServer(notes);

  server.listen(port, () => {
    const address = `http://localhost:${port}`;
    console.log(`server running on ${address}`);

    open(address);
  });
};
