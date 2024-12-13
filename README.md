# Notes App

This is a simple command-line notes application that allows you to create, view, search, and delete notes. The notes are stored in a JSON file, and you can also launch a web server to view the notes in a browser.

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd notes-app
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables:

   ```sh
   cp .env.example .env
   ```

4. Update the file with the path to your file:
   ```env
   NOTES_DB_PATH="path/to/db.json"
   ```

## Usage

### Commands

- **new <note>**: Create a new note.

  ```sh
  note new "Note Title" --tags "tag1 tag2"
  ```

- **all**: Get all notes.

  ```sh
  note all
  ```

- **find <filter>**: Get matching notes by title or tags.

  ```sh
  note find "search term"
  ```

- **remove <id>**: Remove a note by ID.

  ```sh
  note remove 1234567890
  ```

- **web [port]**: Launch a web server to view notes in a browser.

  ```sh
  note web --port 5000
  ```

- **clean**: Remove all notes.

  ```sh
  note clean
  ```

- **setup <route>**: Set up the file for the notes app.
  ```sh
  note setup "path/to/db.json"
  ```

### Examples

1. **Create a new note**:

   ```sh
   note new "Meeting Notes" --tags "work meeting"
   ```

2. **Get all notes**:

   ```sh
   note all
   ```

3. **Find notes containing the term "meeting"**:

   ```sh
   note find "meeting"
   ```

4. **Remove a note by ID**:

   ```sh
   note remove 1734010567931
   ```

5. **Launch the web server on port 5000**:

   ```sh
   note web --port 5000
   ```

6. **Remove all notes**:

   ```sh
   note clean
   ```

7. **Set up the file**:
   ```sh
   note setup "path/to/db.json"
   ```

## License

This project is licensed under the ISC License.
