import Vue from 'vue'
import { secondsToHms as sth } from '@/utils/datetime'

const secondsToHms = Vue.extend({
  methods: {
    secondsToHms (s: number) {
      return sth(s)
    }
  }
})

export default secondsToHms
