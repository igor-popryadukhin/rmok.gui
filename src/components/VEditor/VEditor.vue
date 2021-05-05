<template>
  <Vueditor></Vueditor>
</template>

<script>
import Vue from 'vue'
import Vueditor from 'vueditor'
import 'vueditor/dist/style/vueditor.min.css'
Vue.use(Vueditor, {})

export default {
  computed: {},
  data () {
    return {}
  },
  methods: {},
  mounted () {
    this.$children[0].$children[0].$el.remove()
  },
  watch: {}
}
</script>

<style scoped>
  .vueditor {
    min-height: 400px
  }
</style>
