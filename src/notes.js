import { insertDB, getDB, saveDB } from "./db.js";

export const createNewNote = async (title, note, tags ) => {
  const newNote = {
    title: title,
    content: note,
    tags,
    id: Date.now(),
  };

  await insertDB(newNote);

  return newNote;
};

export const getAllNotes = async () => {
  const { notes } = await getDB();

  return notes;
};

export const findNotes = async (filter) => {
  const { notes } = await getDB();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(filter.toLowerCase()) ||
      note.tags.includes(filter.toLowerCase())
  );
};

export const removeNotes = async (id) => {
  const { notes } = await getDB();

  const match = notes.find((note) => note.id === id);

  if (!match) {
    throw new Error(`Note with id ${id} not found`);
  }

  const newNotes = notes.filter((note) => note.id !== id);

  await saveDB({ notes: newNotes });

  return id;
};

export const removeAll = () => {
  saveDB({ notes: [] });
};
