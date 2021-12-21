<template>
  <v-sheet>
    <v-row no-gutters>
      <v-col>
        <v-sheet
          class="d-flex flex-column"
          :height="250"
        >
          <div class="mb-5">
            <h3>{{ autodialerName }}</h3>
          </div>
          <div class="py-2 row">
            <div class="col-6">
              <v-btn
                v-if="autodialerStatus === 'ready'"
                :loading="processStartingOrStopping"
                color="primary"
                style="min-width: 150px"
                outlined
                tile
                @click="onBtnStartClick"
              >
                {{ $tc('Start') }}
              </v-btn>
              <v-btn
                v-else-if="autodialerStatus === 'process'"
                :loading="processStartingOrStopping"
                color="primary"
                style="min-width: 150px"
                outlined
                tile
                @click="onBtnStopClick"
              >
                {{ $tc('Stop') }}
              </v-btn>
              <v-btn
                v-else
                color="primary"
                style="min-width: 150px"
                outlined
                tile
                disabled
              >
                {{ $tc('Start') }}
              </v-btn>
            </div>
            <div class="col-6">
              <v-select
                v-model="autodialerMode"
                :items="autodialerModeOptions"
                label="Режим"
                dense
              />
            </div>
          </div>
          <div class="d-flex py-2">
            <v-text-field
              v-model="callBackInMinutes"
              class="mr-4"
              type="number"
              label="Количество минут"
              messages="Количество минут через которое следует позвонить лиду"
              style="width: 50%"
            />
            <v-text-field
              v-model="countOfCallLines"
              type="number"
              label="Количество линий"
              style="width: 50%"
            />
          </div>
          <div class="row py-2">
            <div class="col-6">
              <v-text-field
                v-model="queueName"
                label="Имя очереди"
              />
            </div>
            <div class="col-6 text-right">
              <v-btn
                :loading="processApply"
                color="primary"
                outlined
                tile
                @click="onBtnApplyClick"
              >
                {{ $tc('Apply') }}
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
      <v-col>
        <stats-online
          height="200"
          outlined
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="mt-6"
    >
      <v-col>
        <div>
          <h4 class="grey--text">
            Журнал действий
          </h4>
        </div>
        <journal />
      </v-col>
      <v-col>
        <div>
          <h4 class="grey--text">
            Процент сброшенных звонков
          </h4>
        </div>
        <stats-abandoned-call />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import Journal from './Journal.vue'
import Base from '../Base'
import AutodialerParams from '@/api/AutodialerParams'
import StatsOnline from './StatsOnline.vue'
import StatsAbandonedCall from './StatsAbandonedCall.vue'

@Component({
  components: { StatsAbandonedCall, StatsOnline, AppLoading, Journal }
})
export default class AutoDialerView extends Base {
  processStartingOrStopping = false
  processApply = false
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ]

  get callBackInMinutes (): number { return +this.$store.state.autodialer.view.call_back_in_minutes }
  set callBackInMinutes (val: number) { this.$store.commit('autodialer/view/call_back_in_minutes', +val) }

  get countOfCallLines (): number { return this.$store.state.autodialer.view.count_of_call_lines }
  set countOfCallLines (val: number) {
    if (+val < 1) {
      this.$store.commit('autodialer/view/count_of_call_lines', 1)
    } else {
      this.$store.commit('autodialer/view/count_of_call_lines', +val)
    }
  }

  get autodialerMode (): string { return this.$store.state.autodialer.view.mode }
  set autodialerMode (val: string) { this.$store.commit('autodialer/view/mode', val) }

  get tabs () {
    return [
      {
        title: 'Параметры',
        to: {
          name: 'auto_dialer_tab_params'
        }
      },
      {
        title: 'Контакты',
        to: {
          name: 'auto_dialer_tab_queue'
        }
      }
    ]
  }

  get queueName (): string { return this.$store.state.autodialer.view.queue_name }
  set queueName (val: string) { this.$store.commit('autodialer/view/queue_name', val) }

  /**
   * Срабатывает при нажатии на кнопку Start
   */
  onBtnStartClick () {
    this.processStartingOrStopping = true
    new AutodialerParams()
      .start(+this.$route.params.id)
      .then(() => {
        this.$toast.success(this.$tc('Autodial is starting'))
        this.$store
          .dispatch('autodialer/view/fetch', this.$route.params.id)
          .finally(() => (this.processStartingOrStopping = false))
      }).catch((e: Error) => {
        this.$toast.error(this.$tc(e.message))
      })
  }

  /**
   * Срабатывает при нажатии на кнопку Stop
   */
  onBtnStopClick () {
    this.processStartingOrStopping = true
    new AutodialerParams()
      .stop(+this.$route.params.id)
      .then(() => {
        this.$toast.success(this.$tc('Autodial is stopping'))
        this.$store
          .dispatch('autodialer/view/fetch', this.$route.params.id)
          .finally(() => (this.processStartingOrStopping = false))
      }).catch((e: Error) => {
        this.$toast.error(this.$tc(e.message))
      })
  }

  /**
   * Срабатывает при нажатии на кнопку Apply
   */
  onBtnApplyClick () {
    this.processApply = true
    this.$store.dispatch('autodialer/view/apply')
      .then(() => {
        this.$toast.success('Changes accepted')
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      }).finally(() => (this.processApply = false))
  }
}
</script>

<style scoped>

</style>
