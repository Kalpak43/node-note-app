import { loadENV } from "../env.mjs";
import fs from "fs/promises";

const env = loadENV();

export const getDB = async () => {
  const db = await fs.readFile(env.NOTES_DB_PATH, "utf8");

  return JSON.parse(db);
};

export const saveDB = async (db) => {
  await fs.writeFile(env.NOTES_DB_PATH, JSON.stringify(db, null, 2));

  return db;
};

export const insertDB = async (note) => {
  const db = await getDB();

  db.notes.push(note);
  await saveDB(db);

  return note;
};
