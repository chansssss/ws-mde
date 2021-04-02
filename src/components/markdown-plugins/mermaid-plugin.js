/* eslint-disable no-debugger */
import mermaid from 'mermaid'
function mermaidPlugin(md) {
  function mermaidParse(state, startLine, endLine, silent) {
    var marker; var len; var params; var nextLine; var mem; var token; var markup
    var haveEndMarker = false
    var pos = state.bMarks[startLine] + state.tShift[startLine]
    var max = state.eMarks[startLine]
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

    if (pos + 3 > max) { return false }

    marker = state.src.charCodeAt(pos)

    if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
      return false
    }

    // scan marker length
    mem = pos
    pos = state.skipChars(pos, marker)

    len = pos - mem

    if (len < 3) { return false }

    markup = state.src.slice(mem, pos)
    params = state.src.slice(pos, max)
    if (params.indexOf('mermaid') < 0) {
      return false
    }
    if (marker === 0x60 /* ` */) {
      if (params.indexOf(String.fromCharCode(marker)) >= 0) {
        return false
      }
    }

    // Since start is found, we can report success here in validation mode
    if (silent) { return true }

    // search end of block
    nextLine = startLine

    for (; ;) {
      nextLine++
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break
      }

      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break
      }

      if (state.src.charCodeAt(pos) !== marker) { continue }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue
      }

      pos = state.skipChars(pos, marker)

      // closing code fence must be at least as long as the opening one
      if (pos - mem < len) { continue }

      // make sure tail has spaces only
      pos = state.skipSpaces(pos)

      if (pos < max) { continue }

      haveEndMarker = true
      // found!
      break
    }

    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine]

    state.line = nextLine + (haveEndMarker ? 1 : 0)

    token = state.push('mermaid', 'mermaid', 0)
    token.info = params
    token.content = state.getLines(startLine + 1, nextLine, len, true)
    token.markup = markup
    token.map = [startLine, state.line]

    return true
  }
  function render(tokens, idx) {
    console.log(tokens[idx])
    var needsUniqueId = 'render' + +new Date()
    try {
      mermaid.mermaidAPI.parse(tokens[idx].content)
    } catch (error) {
      return "<div class='error' style='color:red'>mermaid 语法错误，请修正</div>"
    }
    mermaid.mermaidAPI.render(needsUniqueId, tokens[idx].content, sc => { tokens[idx].content = sc })
    return "<div class='mermaid'>" + tokens[idx].content + '</div>'
  }
  md.block.ruler.before('table', 'mermaid', mermaidParse)
  md.renderer.rules['mermaid'] = render
}

export default mermaidPlugin
