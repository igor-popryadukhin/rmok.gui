import Vue from 'vue'

const vueScrollOptions = Vue.extend({
  data () {
    return {
      vueScrollOptions: {
        scrollPanel: {
          initialScrollY: false,
          initialScrollX: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          easing: undefined,
          verticalNativeBarPos: 'right'
        },
        vuescroll: {
          wheelScrollDuration: 500
        },
        bar: {
          background: '#c912c6',
          keepShow: true
        },
        rail: {
          opacity: '0.2',
          background: '#c912c6',
          border: '1px solid #cecece',
          size: '10px'
        }
      }
    }
  }
})

export default vueScrollOptions
