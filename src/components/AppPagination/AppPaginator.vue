<template>
  <div class="d-flex text-no-wrap">
    <div
      class="align-self-center"
      style="font-size: 14px; margin-right: 10px"
    >
      <slot
        name="display"
        :count="count"
        :offset="offset"
      >
        <div
          class="mr-2"
          style="padding: 4px; font-size: 13px; user-select: none"
        >
          <app-count-up :end-val="offsetStart" /> — <app-count-up :end-val="offsetEnd" /> {{ $tc('From').toLowerCase() }} <app-count-up :end-val="count" />
        </div>
      </slot>
    </div>
    <v-btn
      :disabled="isBtnLeftDisabled || disabled"
      icon
      small
      @click="onBtnLeftClick"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      :disabled="isBtnRightDisabled || disabled"
      icon
      small
      @click="onBtnRightClick"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import Component from 'vue-class-component'
import { Prop, Emit, Watch, VModel } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<AppPaginator>({
  components: { AppCountUp }
})
export default class AppPaginator extends Vue {
  @Prop({ default: 50 }) readonly perPage: number
  @Prop({ default: 0 }) readonly count: number
  @Prop({ default: false }) readonly disabled: boolean
  @Prop({ default: false }) readonly debounce: boolean

  @VModel({ type: Number, default: () => 0 }) offset!: number

  public page = 0

  get pages () {
    return Math.ceil(this.count / this.perPage)
  }

  get offsetStart () {
    return this.offset + 1
  }

  get offsetEnd () {
    const offsetEnd = this.offset + this.perPage
    return offsetEnd >= this.count ? this.count : offsetEnd
  }

  get isBtnRightDisabled () {
    return this.offset >= (this.count - this.perPage)
  }

  get isBtnLeftDisabled () {
    return this.page <= 1
  }

  private calculate () {
    this.page = (this.pages - Math.ceil((this.count - this.offset) / this.perPage)) + 1
  }

  @Watch('count')
  WatchCount () {
    this.calculate()
  }

  @Emit('click:btn:left')
  private onBtnLeftClick () {
    this.page--
    this.offset = Math.ceil(this.page * this.perPage) - +this.perPage
    return {
      page: this.page,
      offset: this.offset
    }
  }

  @Emit('click:btn:right')
  private onBtnRightClick () {
    this.page++
    this.offset = Math.ceil(this.page * this.perPage) - +this.perPage
    return {
      page: this.page,
      offset: this.offset
    }
  }

  public mounted () {
    this.calculate()
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "From": "Из"
  }
}
</i18n>
