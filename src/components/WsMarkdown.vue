<template>
  <div class="ws-markdown_container">
    <div class="custom_tool-bar">
      <div class="custom_tool-bar_right">
        <button
          class="button button-bar__button"
          title="Open top tool"
          @click="exportMd"
        >
          <svg
            t="1617356612588"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2087"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200"
            height="200"
          >
            <path
              d="M471 250.4c0-22.1 17.9-40.1 40.1-40.1 22.1 0 40.1 17.9 40.1 40.1V680c0 22.1-17.9 40.1-40.1 40.1-22.1 0-40.1-17.9-40.1-40.1V250.4z m0 429.5"
              p-id="2088"
            />
            <path
              d="M852.5 834V645.4c0-20.8 16.9-37.7 37.7-37.7 20.8 0 37.7 16.9 37.7 37.7v226.2c0 20.8-16.9 37.7-37.7 37.7H136.1c-20.8 0-37.7-16.9-37.7-37.7V645.4c0-20.8 16.9-37.7 37.7-37.7 20.8 0 37.7 16.9 37.7 37.7V834h678.7z m0 0M511.1 229.5L320.3 437.9c-15.1 16.4-40.5 17.4-56.9 2.4-16.4-15-17.5-40.5-2.4-56.9L481.4 143c7.6-8.4 18.4-13.1 29.7-13.1s22.1 4.8 29.6 13.1l220.4 240.4c15 16.4 14 41.9-2.4 56.9s-41.9 14-56.9-2.4L511.1 229.5z m190.7 208.4"
              p-id="2089"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="ws-markdown">
      <div
        v-show="isEditorMode && editorVisible"
        class="ws-markdown_editor"
        contenteditable="true"
        @input="changeText"
        v-html="content"
      />
      <div v-if="isEditorMode" class="ws-markdown_tool-bar">
        <button class="button button-bar__button" title="Open top tool">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              d="M19,8.977l-14,0l0,10l14,0m0,2l-14,0c-1.104,0 -2,-0.896 -2,-2l0,-10c0,-1.105 0.896,-2 2,-2l14,0c1.105,0 2,0.895 2,2l0,10c0,1.104 -0.895,2 -2,2Z"
            />
            <rect x="3" y="3.023" width="18" height="2" />
          </svg>
        </button>
        <button
          class="button button-bar__button"
          title="Toggle side preview"
          :class="editorVisible ? 'button_on' : ''"
          @click="toggleSidePreview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              d="M11,20.977l-6,0c-1.104,0 -2,-0.896 -2,-2l0,-14c0,-1.105 0.896,-2 2,-2l14,0c1.105,0 2,0.895 2,2l0,14c0,1.104 -0.895,2 -2,2l-6,0l0,0.023l-2,0l0,-0.023Zm0,-2l0,-14l-6,0l0,14l6,0Zm8,-14l-6,0l0,14l6,0l0,-14Z"
            />
          </svg>
        </button>

        <button
          class="button button-bar__button"
          :class="syncScroll ? 'button_on' : ''"
          @click="toggleSyncScroll"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="icon"
          >
            <path
              d="M9,18l3,0l-4,4l-4,-4l3,0l0,-3l2,0l0,3Zm8,0l3,0l-4,4l-4,-4l3,0l0,-3l2,0l0,3Zm0.055,-5l-10.11,0l0,-2l10.11,0l0,2Zm-8.055,-4l-2,0l0,-3l-3,0l4,-4l4,4l4,-4l4,4l-3,0l0,3l-2,0l0,-3l-6,0l0,3Z"
            />
          </svg>
        </button>
      </div>
      <div
        v-show="previewVisible"
        id="ws-markdown_preview"
        ref="export"
        class="ws-markdown_preview"
      >
        <div id="preview_content" class="preview_content" v-html="html" />
      </div>
    </div>
  </div>
</template>

<script>
import markdownIt from './mixins/markdown-it'
import syncScroll from './mixins/syncScroll'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'WsMarkdown',
  components: {},
  mixins: [markdownIt, syncScroll],
  props: {
    mode: {
      type: String,
      default: 'editor'
    }
  },
  data() {
    return {
      html: '',
      content: '# Hello World',
      previewVisible: true,
      editorVisible: true,
      syncScroll: true,
      isEditorMode: true
    }
  },
  watch: {},
  created() {
    this.isEditorMode = this.mode === 'editor'
  },
  mounted() {
    this.html = this.md.render(this.content)
  },
  methods: {
    exportMd() {
      const mdContent = document.getElementsByClassName('ws-markdown_editor')[0].target.innerText
      var FileSaver = require('file-saver')
      var blob = new Blob([mdContent], {
        type: 'text/plain;charset=utf-8'
      })
      FileSaver.saveAs(blob, 'file.md')
    },
    exportPdf() {
      this.editorVisible = false
      var target = document.getElementById('preview_content')
      target.style.width = '900px'
      target.style.padding = '0 60px'
      // var cloneDom = target.cloneNode(true)
      // document.getElementsByTagName('body')[0].appendChild(cloneDom)
      this.$nextTick(() => {
        html2canvas(target, {
          allowTaint: true,
          scale: 2,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
          // var contentWidth = canvas.width
          // var contentHeight = canvas.height
          // console.log(contentWidth, contentHeight)
          // var pdfX = ((contentWidth + 10) / 2) * 0.75
          // var pdfY = ((contentHeight + 500) / 2) * 0.75 // 500为底部留白
          // var imgX = pdfX
          // var imgY = (contentHeight / 2) * 0.75 // 内容图片这里不需要留白的距离
          // var url = canvas.toDataURL('image/jpeg', 1.0)
          // var pdf = new JsPDF('', 'pt', [pdfX, pdfY])
          // // 需要dataUrl格式
          // pdf.addImage(url, 'JPEG', 0, 0, imgX, imgY)

          // pdf.save('report.pdf')
          document.body.appendChild(canvas)
          var imgData = canvas.toDataURL('image/jpeg')

          /*
      Here are the numbers (paper width and height) that I found to work.
      It still creates a little overlap part between the pages, but good enough for me.
      if you can find an official number from jsPDF, use them.
      */
          var imgWidth = 210
          var pageHeight = 295
          var imgHeight = (canvas.height * imgWidth) / canvas.width
          var heightLeft = imgHeight

          var doc = new JsPDF('p', 'mm')
          var position = 0

          doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            doc.addPage()
            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          doc.save('file.pdf')
        })
      })
    },
    exportPdf1() {
      const scale = 2
      const clientHeight = this.$refs.export.clientHeight
      const width = this.$refs.export.clientWidth
      const cs = document.createElement('canvas')
      cs.width = width * scale
      cs.height = clientHeight * scale
      const content = cs.getContext('2d')
      content.scale(scale, scale)
      const rect = this.$refs.export.getBoundingClientRect()
      content.translate(-rect.left, -rect.top)
      this.$nextTick(() => {
        html2canvas(this.$refs.export, {
          allowTaint: true,
          taintTest: true,
          useCORS: true,
          scale: scale / 2,
          canvas: cs,
          width: width,
          height: clientHeight
        }).then((canvas) => {
          var contentWidth = canvas.width
          var contentHeight = canvas.height
          console.log(contentWidth, contentHeight)
          var pdfX = ((contentWidth + 10) / 2) * 0.75
          var pdfY = ((contentHeight + 500) / 2) * 0.75// 500为底部留白
          var imgX = pdfX
          var imgY = (contentHeight / 2) * 0.75// 内容图片这里不需要留白的距离
          var url = canvas.toDataURL('image/jpeg', 1.0)
          var pdf = new JsPDF('', 'pt', [pdfX, pdfY])
          // 需要dataUrl格式
          pdf.addImage(url, 'JPEG', 0, 0, imgX, imgY)

          pdf.save('report.pdf')
        })
      })
    },
    toggleSidePreview() {
      // this.previewVisible = !this.previewVisible
      this.editorVisible = !this.editorVisible
    },
    toggleSyncScroll() {
      this.syncScroll = !this.syncScroll
    },
    changeText(el) {
      const mdContent = el.target.innerText
      this.html = this.md.render(mdContent)
    }
  }
}
</script>
<style>
</style>
<style scoped>
.ws-markdown_container {
  height: 100%;
  width: 100%;
}
.custom_tool-bar {
  box-sizing: border-box;
  padding: 4px 10px;
  height: 40px;
  background-color: #2c3a47;
  display: flex;
  justify-content: flex-end;
}

.custom_tool-bar .icon {
  fill: #d2dae2;
}
.ws-markdown {
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
  font-family: Lato, Helvetica Neue, Helvetica, sans-serif;
  font-variant-ligatures: common-ligatures;
  line-height: 1.67;
  -webkit-font-smoothing: antialiased;
}
.ws-markdown_editor,
.ws-markdown_preview {
  box-sizing: border-box;
  padding: 20px;
  flex: 1;
  height: 100%;
  text-align: left;
}
.ws-markdown_tool-bar {
  box-sizing: border-box;
  padding: 0 4px;
  height: 100%;
  width: 34px;
  border-left: 1px solid #dfe4ea;
}
.ws-markdown_editor {
  line-height: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  font-size: 17px;
  font-weight: 500;
  color: #34495e;
  background-color: #f1f2f6;
}
.ws-markdown_preview {
  overflow: auto;
  /* border-left: 1px solid #dfe4ea; */
}

.button-bar__button {
  color: rgba(0, 0, 0, 0.2);
  display: block;
  width: 26px;
  height: 26px;
  padding: 2px;
  margin: 3px 0;
}

.ws-markdown .button-bar__button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.button,
.text-input {
  background-image: none;
  background: transparent;
  border: 0;
  border-radius: 3px;
  outline: none;
}

.button_on {
  background: rgba(0, 0, 0, 0.2);
}

.icon {
  fill: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  display: block;
}
</style>

