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
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'

Vue.component('ApexChart', VueApexCharts)

@Component
export default class AppChartPie extends Vue {
  @Prop({ default: null }) readonly height!: number | string | null
  @Prop({ default: null }) readonly width!: number | string | null
  @Prop({ default: false, type: Boolean }) readonly left!: boolean
  @Prop({ default: false, type: Boolean }) readonly right!: boolean
  @Prop({ default: [] }) readonly colors!: string[]
  @Prop({ default: [] }) readonly labels!: string[]
  @Prop({ default: [] }) readonly series!: number[]

  get apexChartOptions () {
    return {
      chart: {
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      noData: {
        text: this.$tc('No data'),
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined
        }
      },
      colors: this.colors,
      labels: this.labels,
      legend: {
        // offsetX: 400,
        formatter: (seriesName: string, opts: any) => {
          return [opts.w.globals.series[opts.seriesIndex], ' - ', seriesName]
        },
        markers: {
          onClick: (chart: any, seriesIndex: any, opts: any) => {
            console.log('series- ' + seriesIndex + '\'s marker was clicked')
          }
        },
        position: 'left',
        fontSize: '12px',
        inverseOrder: true,
        floating: false,
        show: true
      }
    }
  }

  private strTruncate (str: string, len: number, useWordBoundary = true) {
    if (str.length <= len) { return str }

    const subString = str.substr(0, len - 1)

    return useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' ')) + ' ...'
      : subString + ' ...'
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
