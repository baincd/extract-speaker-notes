const classUnderTest = require('../src/extract-speaker-notes-from-html.js')

const DEFAULT_NEXT_SLIDE_HEADER = "# [NEXT SLIDE]\n"

describe('extract-speaker-notes-from-html',function() {

  it('extracts nothing for an empty doc', function() {
    actual = classUnderTest.extractNotes("<html></html>")

    expect(actual).toBe("")
  })

  it('should extract when one set of notes', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                These are some notes
              </aside>
            </section>
      `))

    expect(actual).toBe(DEFAULT_NEXT_SLIDE_HEADER + 'These are some notes')
  })

  it('should extract from two sets of notes', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                These are some notes
              </aside>
            </section>
            <section>
              <aside class="notes">
                These are more notes
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are some notes\n' +
      '\n' +
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are more notes')
  })

  it('should trim extra space from lines', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                These are some notes
                This is line 2 with space before and after
                I am line 3
              </aside>
            </section>
            <section>
              <aside class="notes">
                These are more notes
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are some notes\n' +
      'This is line 2 with space before and after\n' +
      'I am line 3\n' +
      '\n' +
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are more notes')
  })

  it('should maintain indentation within section', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                These are some notes
                \tindented with 1 tab
                \t\tIndented 2 tabs
                ` + " " + " " + " " + `3 spaces
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are some notes\n' +
      '\tindented with 1 tab\n' +
      '\t\tIndented 2 tabs\n' +
      " " + " " + " " + '3 spaces'
    )
  })

  it('should keep first line if any text on it', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">  hi
  These are some notes
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      'hi\n' +
      'These are some notes'
    )
  })

  it('should keep last line if any text on it', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                These are some notes
                  I am the last line</aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      'These are some notes\n' +
      "  I am the last line"
    )
  })

  it('should not encode text', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      "I'm a note"
    )
  })

  it('should use the first h1 header if exists', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <p>an element</p>
              <h1>Section Header</h1>
              <p>more text</p>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "# Section Header\n" +
      "I'm a note"
    )
  })

  it('should use the first h2 header if exists', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <p>an element</p>
              <h2>Section Header</h2>
              <p>more text</p>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "# Section Header\n" +
      "I'm a note"
    )
  })

  it('should use the highest level header if multiple levels exist regardless of order', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <p>an element</p>
              <h4>Section Header</h4>
              <h3>Really The Header</h3>
              <p>more text</p>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "# Really The Header\n" +
      "I'm a note"
    )
  })

  it('should not add a header if the notes already include a header', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`

    				<section>
              <p>an element</p>
              <h4>Header 4</h4>
              <h3>Header 3</h3>
              <p>more text</p>
              <aside class="notes">
                # Notes Header
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "# Notes Header\n" +
      "I'm a note"
    )
  })

  it('should add the default header as a second level header if the section is nested', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
          <section>
    				<section>
              <p>an element</p>
              <p>more text</p>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
          </section>
      `))

    expect(actual).toBe(
      "#" + DEFAULT_NEXT_SLIDE_HEADER +
      "I'm a note"
    )
  })

  it('should add the header as a second level header if the section is nested', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
          <section>
    				<section>
              <p>an element</p>
              <h6>Hi Mom</h6>
              <p>more text</p>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
          </section>
      `))

    expect(actual).toBe(
      "## Hi Mom\n" +
      "I'm a note"
    )
  })

  it('should find a header tag that is not a sibling', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <div>
                <h6>Section Header</h6>
              </div>
              <aside class="notes">
                I'm a note
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "# Section Header\n" +
      "I'm a note"
    )
  })


  it('should not use the header tag from a child section', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <h6>Outer Header</h6>
              <aside class="notes">
                I'm a note
              </aside>
              <section>
                <h1>Inner Header</h1>
              </section>
            </section>
      `))

    expect(actual).toBe(
      "# Outer Header\n" +
      "I'm a note"
    )
  })

  it('should not use blank lines to determine indentation', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <aside class="notes">
` + "    \n" + // make sure there are 4 spaces
`                I'm a note
                  Me Too!
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      "I'm a note\n" +
      "  Me Too!"
    )
  })

  it('should not treat an invalid header in the aside as a header', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <aside class="notes">
                #NotAHeader
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      "#NotAHeader"
    )
  })

  it('should treat a second level header in the aside as a header', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <aside class="notes">
                ## I am a Header
              </aside>
            </section>
      `))

    expect(actual).toBe(
      "## I am a Header"
    )
  })

  it('should not treat an octothorp that does not start the aside as a header', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <aside class="notes">
                I am not a header
                # Neither am I
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      "I am not a header\n" +
      "# Neither am I"
    )
  })

  it('should not treat seven octothorps as a header', function() {
    actual = classUnderTest.extractNotes(htmlBoilerplate(`
    				<section>
              <aside class="notes">
                ####### I am not a header
              </aside>
            </section>
      `))

    expect(actual).toBe(
      DEFAULT_NEXT_SLIDE_HEADER +
      "####### I am not a header"
    )
  })

  htmlBoilerplate = function (slides) {
    return "" +
    `<html>
    <body>
      <div class="reveal">
        <div class="slides">`
        + slides +
        `</div>
      </div>
    </body>
    </html>`
  }

})
