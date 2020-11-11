<template>
  <v-container fill-height fluid>
    <v-row
      justify="center"
      align="center"
    >
      <apexchart
        width="500"
        type="donut"
        :options="options"
        :series="series" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default Vue.extend({
  data () {
    return {
      options: {},
      series: [44, 55, 41, 17, 15, 33, 23, 432]
    }
  }
})
</script>

<style scoped>

</style>
