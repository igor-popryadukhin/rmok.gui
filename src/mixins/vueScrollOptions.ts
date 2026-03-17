import Vue from 'vue';

const vueScrollOptions = Vue.extend({
  data () {
    return {
      vueScrollOptions: {
        bar: {
          background: '#c912c6',
          keepShow: true
        },
        rail: {
          background: '#c912c6',
          border: '1px solid #cecece',
          opacity: '0.2',
          size: '10px'
        },
        scrollPanel: {
          easing: undefined,
          initialScrollX: false,
          initialScrollY: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          verticalNativeBarPos: 'right'
        },
        vuescroll: {
          wheelScrollDuration: 500
        }
      }
    };
  }
});

export default vueScrollOptions;
