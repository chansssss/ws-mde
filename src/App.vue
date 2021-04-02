<template>
  <div id="app">
    <WsMarkdown mode="editor" />
  </div>
</template>

<script>
import WsMarkdown from './components/WsMarkdown'
export default {
  name: 'App',
  components: { WsMarkdown },
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  height: 100vh;
}
</style>
