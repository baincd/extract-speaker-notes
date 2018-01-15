# extract-speaker-notes

This script extracts and saves [speaker notes](https://github.com/hakimel/reveal.js/#speaker-notes) from a reveal.js(https://github.com/hakimel/reveal.js/) presentation.

Speaker notes can be kept with the presentation, and this script can be used to extract the speaker notes incase the speaker notes window cannot be used.

## Details
This script will find all the &lt;aside&gt; tags in your presentation, extract and save them (by default, to notes.md).  For each section:
* If the first line in the &lt;aside&gt; with text starts with a valid Markdown header, then the script assumes that is a header and does not add an additional header
* Otherwise, the script will use the highest-level header tag in the section, and add that to the extracted notes
* If no header tags are found, it adds a generic "[NEXT SLIDE]" header

## Limitations
* The script only supports &lt;aside&gt; tags.  data-notes attributes are not supported
* The script assumes the speaker notes are written in Markdown, and adds/creates headers in Markdown
* In each &lt;aside&gt; the first line with text is used as the base for indentation, and that indentation will be removed from all lines where it exists (indentation must match exactly)

## Setup
Clone the repo, then run
```
npm install
```

## Usage
To extract speaker notes to the default location (notes.md)
```
npm start /path-to-revealjs-presentation/index.html
```

To extract speaker notes to a specified location
```
npm start -- /path-to-revealjs-presentation/index.html --output /dir-for-output/outputfile.md
```

To override an existing file
```
npm start -- /path-to-revealjs-presentation/index.html -O
```
