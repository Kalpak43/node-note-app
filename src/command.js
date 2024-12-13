import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  createNewNote,
  findNotes,
  getAllNotes,
  removeAll,
  removeNotes,
} from "./notes.js";
import { start } from "./server.js";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

function listNotes(notes) {
  console.log(
    "-------------------------------------------------------------------------------------------"
  );
  console.log(
    `| ${"ID".padEnd(14)}| ${"Title".padEnd(
      7
    )}                      | ${"Tags".padEnd(40)} |`
  );
  console.log(
    "-------------------------------------------------------------------------------------------"
  );
  notes.forEach(({ id, title, tags }) => {
    console.log(
      `| ${id.toString().padEnd(4)} | ${title.padEnd(28)} | ${tags
        .join(", ")
        .padEnd(40)} |`
    );
  });
  console.log(
    "-------------------------------------------------------------------------------------------"
  );
}

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tempFilePath = path.join(process.cwd(), "temp.txt");

      execSync(`nano ${tempFilePath}`, { stdio: "inherit" });

      // Read the content of the file
      const noteContent = fs.readFileSync(tempFilePath, "utf-8");

      fs.unlinkSync(tempFilePath);

      const tags = argv.tags
        ? argv.tags
            .toLowerCase()
            .split(" ")
            .filter((tag) => tag.length > 0)
        : [];

      const note = await createNewNote(argv.note, noteContent, tags);

      console.log("Note created", note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "Add tags to the note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const matches = await findNotes(argv.filter);
      listNotes(matches);
    }
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNotes(argv.id);
      console.log(`Note with id ${id} removed`);
    }
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs
        .positional("port", {
          describe: "port to bind on",
          default: 5000,
          type: "number",
        })
        .option("title", {
          alias: "T",
          type: "string",
          description: "filter notes by title",
        })
        .option("tags", {
          alias: "t",
          type: "string",
          description: "filter notes by tags",
        })
        .option("id", {
          type: "number",
          description: "filter notes by id",
        });
    },
    async (argv) => {
      let notes = await getAllNotes();

      if (argv.title) {
        notes = notes.filter((note) => note.title.includes(argv.title));
      }

      if (argv.tags) {
        const tags = argv.tags.toLowerCase().split(" ");
        notes = notes.filter((note) =>
          tags.every((tag) => note.tags.includes(tag))
        );
      }

      if (argv.id) {
        notes = notes.filter((note) => note.id === argv.id);
      }

      if (notes.length <= 0) {
        console.log("No notes found");
        return;
      }

      start(notes, argv.port);
    }
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAll();
      console.log("All notes removed");
    }
  )
  .command(
    "setup <route>",
    "setup db.json for notes app",
    () => {},
    async (argv) => {
      const dbPath = path.join(process.cwd(), argv.route, "db.json");
      const initialData = { notes: [] };

      fs.writeFile(dbPath, JSON.stringify(initialData, null, 2), (err) => {
        if (err) {
          console.error("Error creating db.json:", err);
        } else {
          console.log(
            "db.json created successfully at",
            path.join(dbPath)
          );
          console.log("Add the above path to your environment variables");
        }
      });
    }
  )
  .demandCommand(2)
  .parse();
