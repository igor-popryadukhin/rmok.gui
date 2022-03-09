<template>
  <apex-chart
    type="bar"
    :options="apexChartOptions"
    :series="series"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts">
import { secondsToHms } from '@/utils/datetime'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

Vue.component('ApexChart', VueApexCharts)

interface Series {
  name: string;
  data: number[];
}

@Component
export default class AppChartBar extends Vue {
  @Prop({ default: '100%' }) readonly height!: number | string | null
  @Prop({ default: '100%' }) readonly width!: number | string | null
  @Prop({ default: '70%' }) readonly barHeight!: number | string | null
  @Prop({ default: '70%' }) readonly columnWidth!: number | string | null
  @Prop({
    default: false,
    type: Boolean
  }) readonly left!: boolean
  @Prop({
    default: false,
    type: Boolean
  }) readonly right!: boolean
  @Prop({ default: [] }) readonly colors!: string[]
  @Prop({ default: [] }) readonly labels!: string[]
  @Prop({ default: [] }) readonly series!: Series[]

  get apexChartOptions () {
    return {
      chart: {
        height: this.height,
        width: this.width,
        stackType: '100%',
        stacked: true,
        type: 'bar',
        toolbar: {
          show: false
        },
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
      theme: {
        mode: 'light',
        palette: 'palette5',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
      },
      dataLabels: {
        dropShadow: {
          enabled: false
        },
        enabled: true,
        formatter: function (val: any, opt: any) {
          return secondsToHms(opt.w.globals.series[opt.seriesIndex][opt.dataPointIndex], {
            h: ['ч.', 'ч.', 'ч.'],
            m: ['м.', 'м.', 'м.'],
            s: ['c.', 'c.', 'c.']
          })
        },
        offsetX: 0,
        style: {
          colors: ['#fff']
        },
        textAnchor: 'start'
      },
      legend: {
        formatter: function (seriesName, opts) {
          return [seriesName]
        },
        position: 'top',
        floating: true,
        show: true,
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        }
      },
      noData: {
        align: 'center',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontFamily: undefined,
          fontSize: '16px'
        },
        text: this.$tc('No data'),
        verticalAlign: 'middle'
      },
      plotOptions: {
        bar: {
          columnWidth: this.columnWidth,
          barHeight: this.barHeight,
          dataLabels: {
            hideOverflowingLabels: false,
            maxItems: 100,
            orientation: 'horizontal',
            position: 'bottom'
          },
          horizontal: true
        }
      },
      responsive: [
        {
          breakpoint: undefined,
          options: {}
        }
      ],
      colors: this.colors,
      series: this.series,
      xaxis: {
        categories: this.labels,
        labels: {
          show: true
        }
      },
      tooltip: {
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
          return '<div class="app-chart-bar-tooltip">' +
            '<span>' + secondsToHms(series[seriesIndex][dataPointIndex]) + '</span>' +
            '</div>'
        }
      }
    }
  }


}
</script>

<style  lang="scss" >
.app-chart-bar-tooltip {
  padding: 5px 15px 5px 15px;
  background-color: #5f6060;
  color: white;
}
</style>
