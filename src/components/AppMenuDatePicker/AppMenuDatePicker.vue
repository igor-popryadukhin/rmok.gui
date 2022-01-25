<template>
  <v-menu
    ref="menu"
    v-model="menuVisible"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    left
    min-width="auto"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
        :text="textDisplay"
      />
    </template>
    <v-date-picker
      v-model="dates"
      :range="range"
      :first-day-of-week="1"
      no-title
      show-current
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        small
        @click="closeMenu"
      >
        {{ $tc('Ok') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, VModel, Watch } from 'vue-property-decorator'

@Component
export default class AppMenuDatePicker extends Vue {
  @Prop({ default: () => 'DD.MM.YYYY' }) readonly format!: string
  @Prop({ default: () => false }) readonly range!: boolean
  @VModel({ default: () => null }) datesVModel!: string | string[]

  isoFormat = 'YYYY-MM-DD'
  menuVisible = false
  dates = null

  get textDisplay () {
    if (Array.isArray(this.dates)) {
      if (this.dates.length === 2) {
        const d1 = dayjs(this.dates[0], this.isoFormat)
        const d2 = dayjs(this.dates[1], this.isoFormat)

        if (d1.diff(d2, 'day') <= 0) {
          return [d1.format(this.format), d2.format(this.format)].join(' - ')
        }
        return [d2.format(this.format), d1.format(this.format)].join(' - ')
      } else if (this.dates.length === 1) {
        return [dayjs(this.dates[0], this.isoFormat).format(this.format), '__.__.__'].join(' - ')
      }
    } else if (typeof this.dates === 'string') {
      return dayjs(this.dates, this.isoFormat).format(this.format)
    }
    return '__.__.__'
  }

  @Watch('dates')
  datesWatchHandler (val: string[] | string) {
    if (Array.isArray(val) && val.length === 2) {
      const d1 = dayjs(val[0], this.isoFormat)
      const d2 = dayjs(val[1], this.isoFormat)

      if (d1.diff(d2, 'day') <= 0) {
        this.datesVModel = [d1.format(this.format), d2.format(this.format)]
      } else {
        this.datesVModel = [d2.format(this.format), d1.format(this.format)]
      }
    } else if (typeof val === 'string') {
      this.datesVModel = dayjs(val, this.isoFormat).format(this.format)
    }
  }

  private closeMenu () {
    this.menuVisible = false
  }

  public mounted () {
    if (Array.isArray(this.datesVModel)) {
      this.dates = []
      this.datesVModel.forEach((e) => {
        this.dates.push(dayjs(e, this.format).format(this.isoFormat))
      })
    } else if (typeof this.dates === 'string') {
      this.dates = dayjs(this.dates, this.format).format(this.isoFormat)
    }
  }
}
</script>

<style scoped>

</style>
