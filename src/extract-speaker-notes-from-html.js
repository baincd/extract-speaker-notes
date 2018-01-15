const fs = require('fs')
const cheerio = require('cheerio')

const rightTrimRegEx = /\s*$/
const indentationRegEx = /^(\s*)\S/
const hasNonSpaceCharRegEx = /\S/

let $

getIndentRegEx = function(lines) {
  let i = 0
  let indentMatch
  while (!indentMatch) {
    indentMatch = lines[i++].match(indentationRegEx)
  }
  if (indentMatch) {
    indent = indentMatch[1]
  } else {
    indent = ""
  }
  return new RegExp("^" + indent)

}

getLines = function(aside) {
  let lines = $(aside).text().split("\n")
  if (!lines[0].match(hasNonSpaceCharRegEx)) {
    lines.shift()
  }
  return lines
}

getHeader = function(aside) {
  if ($(aside).text().match(/^\s*#{1,6} /)) {
    return "";
  }
  let section = $(aside).parent()
  let headerPrefix = "# "
  if (section.parent().is("section")) {
    headerPrefix = "## "
  }
  for (let i = 1; i <= 6; i++) {
    let h = section.find("h" + i).toArray().filter(x => $(x).closest('section').is(section))
    if (h.length) {
      return headerPrefix + $(h[0]).text()
    }
  }
  return headerPrefix + "[NEXT SLIDE]"
}

mapAsideElToNotes = function(aside) {
  let lines = getLines(aside)
  let indentRegEx = getIndentRegEx(lines)

  return getHeader(aside) + "\n" +
    lines.map(x => x.replace(rightTrimRegEx,""))
    .map(x => x.replace(indentRegEx,""))
    .join("\n")
    .trim();
}

exports.extractNotes = function(html){
  $ = cheerio.load(html)

  let noteEls = $('body').find('aside')

  if (noteEls.length == 0) {
    return ""
  }

  return noteEls.toArray()
    .map(mapAsideElToNotes)
    .join("\n\n")
    .trim()
}
