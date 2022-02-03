<template>
  <v-sheet>
    <v-row>
      <v-col
        xl="4"
        lg="4"
        md="4"
        sm="12"
      >
        <!-- Наименование очереди -->
        <div class="mb-1">
          <v-text-field
            v-model="queueName"
            label="Имя очереди"
            dense
            outlined
          />
        </div>
        <!-- Наименование очереди -->

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
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <v-row
      class="mb-2"
      no-gutters
    >
      <v-col class="d-flex">
        <v-spacer />
        <v-btn
          color="primary"
          :loading="processApply"
          :disabled="!isChanged"
          outlined
          tile
          small
          @click="onBtnApplyClick"
        >
          {{ $tc('Apply') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import AppBase from '@/AppBase'
import { AxiosResponse } from 'axios'
import { Watch } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<Telephony>({
  beforeRouteLeave (to, from, next) {
    if (this.isChanged) {
      if (this.$confirm()) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
})
export default class Telephony extends AppBase {
  processApply = false
  isChanged = false
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ]

  get queueName (): string { return this.$store.state.autodialer.view.queue_name }
  set queueName (val: string) { this.$store.commit('autodialer/view/queue_name', +val) }

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

  @Watch('isChanged')
  isChangedWatchHandle (value: boolean) {
    if (value) { this.$confirmBeforeunload() } else { this.$confirmBeforeunloadFlush() }
  }

  created () {
    this.$watch('queueName', () => (this.isChanged = true))
    this.$watch('pickupTimeout', () => (this.isChanged = true))
    this.$watch('maxCallsNumber', () => (this.isChanged = true))
  }

  private onBtnApplyClick () {
    this.processApply = true
    this.$axios.patch(`/auto-dialers/${this.$route.params.id}`, {
      max_calls_number: this.maxCallsNumber,
      pickup_timeout: this.pickupTimeout,
      queue_name: this.queueName
    }).then((response: AxiosResponse) => {
      if (response.status === 200) {
        this.isChanged = false
        this.$toast.success('Changes accepted')
      }
    }).catch((e: Error) => (this.$toast.error(e.message)))
      .finally(() => (this.processApply = false))
  }
}
</script>

<style scoped>

</style>
