<template>
  <apex-chart
    type="pie"
    :options="apexChartOptions"
    :series="series"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'

Vue.component('ApexChart', VueApexCharts)

@Component
export default class Index extends AppBase {
  @Prop({ default: null }) readonly height: number | string | null
  @Prop({ default: null }) readonly width: number | string | null
  @Prop({ default: false, type: Boolean }) readonly left: boolean
  @Prop({ default: false, type: Boolean }) readonly right: boolean
  @Prop({ default: [] }) readonly colors: string[]
  @Prop({ default: [] }) readonly labels: string[]
  @Prop({ default: [] }) readonly series: number[]

  get apexChartOptions (): any {
    return {
      chart: {
        animations: {
          enabled: false // Off animations
        }
      },
      colors: this.colors,
      labels: this.labels,
      legend: {
        // formatter: function (seriesName: string, opts: any) {
        //   return [opts.w.globals.series[opts.seriesIndex], ' - ', seriesName]
        // },
        markers: {
          onClick: (chart: any, seriesIndex: any, opts: any) => {
            console.log('series- ' + seriesIndex + '\'s marker was clicked')
          }
        },
        position: 'right',
        show: true
      }
    }
  }
}
</script>

<style lang="scss">
.margin-right > *:not(:nth-child(0)) {
  margin-right: 10px;
}

.simple-table th:first-child {
  border-right: 3px solid #3b71d5;
  background: #e8edff!important;
  color: #669;
}
.simple-table td:first-child {
  border-right: 3px solid #3b71d5;
  background: #e8edff;
  color: #669;
}

</style>
