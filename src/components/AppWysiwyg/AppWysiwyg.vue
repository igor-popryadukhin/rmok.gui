<template>
  <Vueditor ref="editor"></Vueditor>
</template>

<script>
import Vue from 'vue'
import Vueditor from 'vueditor'
import 'vueditor/dist/style/vueditor.min.css'

Vue.use(Vueditor, {
  toolbar: [
    'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor'
  ],
  fontName: [
    { val: 'arial black' },
    { val: 'times new roman' },
    { val: 'Courier New' }
  ],
  fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
  uploadUrl: ''
})

export default {

  methods: {
    getContent () {
      return this.$refs.editor.getContent()
    },

    setContent (value) {
      return this.$refs.editor.setContent(value)
    }
  }
}
</script>

<style scoped>
.vueditor {
  min-height: 400px
}
</style>
