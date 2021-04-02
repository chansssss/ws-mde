<template>
  <div class="ws-markdown">
    <div
      v-if="isEditorMode"
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
        :class="previewVisible ? '' : 'button_on'"
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

      <button class="button button-bar__button" :class="syncScroll ? 'button_on' : ''" @click="toggleSyncScroll">
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
    <div v-show="previewVisible" class="ws-markdown_preview" v-html="html" />
  </div>
</template>

<script>
import markdownIt from './mixins/markdown-it'
import syncScroll from './mixins/syncScroll'

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
    toggleSidePreview() {
      this.previewVisible = !this.previewVisible
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

<style scoped>
.ws-markdown {
  height: 100%;
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
  font-size: 18px;
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

.button-bar__button:hover {
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
  background: rgba(0, 0, 0, 0.1);
}

.icon {
  fill: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  display: block;
}
</style>
