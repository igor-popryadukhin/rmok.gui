<template>
  <v-sheet>
    <v-row>
      <v-col
        xl="4"
        lg="4"
        md="4"
        sm="12"
      >
        <v-sheet
          class="d-flex flex-column"
        >
          <!-- Количество линий -->
          <div class="mb-1">
            <v-text-field
              v-model="maxCallsNumber"
              type="number"
              label="Количество линий"
              dense
              outlined
            />
          </div>
          <!-- Количество линий -->

          <!-- Время дозвона, сек -->
          <div class="mb-1">
            <v-text-field
              v-model="pickupTimeout"
              type="number"
              label="Время дозвона, сек"
              dense
              outlined
            />
          </div>
          <!-- Время дозвона, сек -->
        </v-sheet>
      </v-col>
    </v-row>
    <v-divider class="my-3" />
    <v-row
      class="mb-2"
      no-gutters
    >
      <v-col class="d-flex">
        <v-btn
          outlined
          tile
          small
        >
          {{ $tc('Default') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          tile
          small
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import AppBase from '@/AppBase'

@Component
export default class AutoDialerView extends AppBase {
  processStartingOrStopping = false
  processApply = false
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ]

  get pickupTimeout (): number { return +this.$store.state.autodialer.view.pickup_timeout }
  set pickupTimeout (val: number) { this.$store.commit('autodialer/view/pickup_timeout', +val) }

  get maxCallsNumber (): number { return this.$store.state.autodialer.view.max_calls_number }
  set maxCallsNumber (val: number) {
    if (+val < 1) {
      this.$store.commit('autodialer/view/max_calls_number', 1)
    } else {
      this.$store.commit('autodialer/view/max_calls_number', +val)
    }
  }

  get autodialerMode (): string { return this.$store.state.autodialer.view.mode }
  set autodialerMode (val: string) { this.$store.commit('autodialer/view/mode', val) }
}
</script>

<style scoped>

</style>
