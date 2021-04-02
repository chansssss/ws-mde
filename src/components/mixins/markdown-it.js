// import mermaid from 'mermaid'
import 'highlight.js/styles/default.css'
import MarkdownIt from 'markdown-it'
export default {
  data() {
    return {
      md: null
    }
  },
  methods: {
    initMarkdownIT() {
      // mermaid.initialize({ startOnLoad: true })
      var hljs = require('highlight.js')
      this.md = new MarkdownIt({
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                     hljs.highlight(lang, str, true).value +
                     '</code></pre>'
            } catch (__) {
              // nothing
            }
          }

          return '<pre class="hljs"><code>' + MarkdownIt().utils.escapeHtml(str) + '</code></pre>'
        }
      })
    }
  },
  created() {
    // this.fetch()
    this.initMarkdownIT()
  }

}
