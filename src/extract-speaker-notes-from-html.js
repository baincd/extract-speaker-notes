const fs = require('fs')
const cheerio = require('cheerio')

const rightTrimRegEx = /\s*$/

getIndentRegEx = function(lines) {
  let i = 0;
  let indentMatch = undefined;
  while (!indentMatch) {
    indentMatch = lines[i++].match(/^(\s*)\S/)
  }
  if (indentMatch) {
    indent = indentMatch[1]
  } else {
    indent = ""
  }
  return new RegExp("^" + indent)

}

getLines = function(aside) {
  lines = $(aside).text().split("\n")
  if (!lines[0].match(/\S/)) {
    lines.shift()
  }
  return lines
}

getHeader = function(aside) {
  if ($(aside).text().match(/^\s*#{1,6} /)) {
    return "";
  }
  section = $(aside).parent()
  if (section.parent().is("section")) {
    headerPrefix = "## "
  } else {
    headerPrefix = "# "
  }
  for (i = 1; i <= 6; i++) {
    h = section.find("h" + i).toArray().filter(h => $(h).closest('section').is(section))
    if (h.length) {
      return headerPrefix + $(h[0]).text()
    }
  }
  return headerPrefix + "[NEXT SLIDE]"
}

mapAsideElToNotes = function(aside) {
  lines = getLines(aside)
  indentRegEx = getIndentRegEx(lines)

  return getHeader(aside) + "\n" +
    lines.map(x => x.replace(rightTrimRegEx,""))
    .map(x => x.replace(indentRegEx,""))
    .join("\n")
    .trim();
}

exports.extractNotes = function(html){
  $ = cheerio.load(html)

  noteEls = $('body').find('aside')

  if (noteEls.length == 0) {
    return ""
  }

  return noteEls.toArray()
    .map(mapAsideElToNotes)
   .join("\n\n")
   .trim()
}
