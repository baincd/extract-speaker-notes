const fs = require('fs')
const extractor = require('./extract-speaker-notes-from-html.js')

if (process.argv.length < 3) {
  console.error("Must pass in input file")
  process.exit(1)
}

const inputFilePath = process.argv[2];

html = fs.readFileSync(inputFilePath).toString()

notes = extractor.extractNotes(html)

fs.writeFileSync("notes.md",notes);
