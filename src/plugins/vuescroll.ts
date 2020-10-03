import Vue from 'vue'
import vuescroll from 'vuescroll'

// You can set global config here.
Vue.use(vuescroll, {
  ops: {
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#c1c1c1',
      opacity: 1,
      hoverStyle: false
    }
  }
})
