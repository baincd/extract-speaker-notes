const fs = require('fs')
const extractor = require('./extract-speaker-notes-from-html.js')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const commandLineOptsConf = [
  {name: 'help', alias: 'h', description: 'Print this usage guide', type: Boolean},
  {name: 'overwrite', alias: 'O', description: 'Overwrite output file if it already exists', type: Boolean},
  {name: 'input', description: 'The presentation file', type: String, defaultOption: true},
  {name: 'output', alias: 'o', description: 'The output file (default: ./notes.md)', type: String, defaultValue: './notes.md'}
]

const options = commandLineArgs(commandLineOptsConf)

if (options.help) {
  console.log(commandLineUsage([
      {
        header: 'extract-speaker-notes',
        content: 'Extract and save speaker notes (<aside> tags) from a reveal.js presentation\n' +
        'Example usages:\n' +
        'npm start ../presentation/index.html\n' +
        'npm start -- ../presentation/index.html -o ../presentation/notes.md'
      },
      {
        header: 'Options',
        optionList: commandLineOptsConf
      }
  ]))
  process.exit(0)
}

if (!options.input) {
  console.error("Must pass in input file")
  process.exit(1)
}

if (!fs.existsSync(options.input) || !fs.statSync(options.input).isFile()) {
  console.error(options.input + " is not a file!")
  process.exit(2)
}

if (fs.existsSync(options.output) && !options.overwrite) {
  console.error(options.output + " already exists (to overwrite, use the -O option)")
  process.exit(3)
}

console.log(options.input + " => " + options.output)
html = fs.readFileSync(options.input).toString()

notes = extractor.extractNotes(html)

fs.writeFileSync(options.output,notes);
