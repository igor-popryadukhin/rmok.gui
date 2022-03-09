<template>
  <v-card
    :width="width"
    :height="height"
    class="mr-2 mb-2"
    flat
    outlined
    tile
  >
    <div class="d-flex justify-center align-center fill-height pa-2">
      <div class="d-flex flex-column flex-nowrap">
        <v-icon size="24">
          {{ icon }}
        </v-icon>
        <span class="text-h6 text-center mb-n2 ">
          <template v-if="typeof value === 'number'">
            <app-count-up
              :end-val="value"
              style="font-size: 16px"
            />
          </template>
          <template
            v-else
            style="font-size: 16px"
          >
            {{ value }}
          </template>
        </span>
        <span
          class="text-center grey--text text-wrap"
          style="font-size: 12px"
        >
          {{ text }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppCountUp from '@/components/AppCountup/AppCountUp.vue'
import { Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCountUp
  }
})
export default class AppSummary extends Vue {
  @Prop({ default: false }) readonly loading: boolean
  @Prop({ default: 150 }) readonly width: number
  @Prop({ default: 250 }) readonly height: number
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
