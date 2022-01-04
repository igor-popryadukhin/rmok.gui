<template>
  <div
    class="app-summary"
    :style="{ 'width': width + 'px', 'height': height + 'px' }"
  >
    <div
      class="d-flex flex-column align-center"
    >
      <v-avatar
        size="40"
        :style="{ 'background-color': color + '36'}"
      >
        <v-progress-circular
          v-if="loading"
          :color="color + '70'"
          size="40"
          indeterminate
        />
        <v-icon
          v-else
          :color="color"
        >
          {{ icon }}
        </v-icon>
      </v-avatar>
      <p class="text-h6 text-center mb-n2">
        <app-count-up
          v-if="typeof value === 'number'"
          :end-val="value"
        />
        <template v-else>
          {{ value }}
        </template>
      </p>
      <p class="text-subtitle-2 text-center text-no-wrap grey--text">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import { Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCountUp
  }
})
export default class AppSummary extends Vue {
  @Prop({ default: false }) readonly loading: boolean
  @Prop({ default: 200 }) readonly width: number
  @Prop({ default: 200 }) readonly height: number
  @Prop({ default: 'grey' }) readonly color: string
  @Prop({ default: 0 }) readonly value: string|number
  @Prop({ default: '' }) readonly text: string
  @Prop({ default: '' }) readonly icon: string
}
</script>

<style lang="scss" scoped>
.app-summary {
  display: flex;
  box-shadow: #c4c4c4 0px 0px 2px;
  border-style: solid;
  border-radius: 2px;
  border-width: 0px;
  justify-content: space-evenly;
  align-items: center;
  user-select: none;
}
</style>
