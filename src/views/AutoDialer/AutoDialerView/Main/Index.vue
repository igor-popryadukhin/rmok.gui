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
          <!-- Наименование -->
          <div class="mb-1">
            <v-text-field
              v-model="autodialerName"
              label="Название"
              dense
              outlined
            />
          </div>
          <!-- Наименование -->

          <!-- Описание -->
          <div class="mb-1">
            <v-textarea
              :label="$tc('Description')"
              rows="3"
              dense
              outlined
            />
          </div>
          <!-- Описание -->

          <!-- Режим -->
          <div class="mb-1">
            <v-select
              v-model="autodialerMode"
              :items="autodialerModeOptions"
              label="Режим"
              dense
              outlined
            />
          </div>
          <!-- Режим -->

          <div class="mb-1">
            <v-btn
              v-if="autodialerStatus === 'ready'"
              :loading="processStartingOrStopping"
              color="primary"
              outlined
              tile
              block
              @click="onBtnStartClick"
            >
              {{ $tc('Start') }}
            </v-btn>
            <v-btn
              v-else-if="autodialerStatus === 'process'"
              :loading="processStartingOrStopping"
              color="red"
              outlined
              tile
              block
              @click="onBtnStopClick"
            >
              {{ $tc('Stop') }}
            </v-btn>
            <v-btn
              v-else
              color="primary"
              outlined
              tile
              disabled
              block
            >
              {{ $tc('Start') }}
            </v-btn>
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
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <div>-->
    <!--          <h4 class="grey&#45;&#45;text">-->
    <!--            Журнал действий-->
    <!--          </h4>-->
    <!--        </div>-->
    <!--        <journal />-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <div>-->
    <!--          <h4 class="grey&#45;&#45;text">-->
    <!--            Процент сброшенных звонков-->
    <!--          </h4>-->
    <!--        </div>-->
    <!--        <stats-abandoned-call />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
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
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

@Component({
  components: { StatsAbandonedCall, StatsOnline, AppLoading, Journal }
})
export default class AutoDialerView extends Base {
  processStartingOrStopping = false;
  processApply = false;
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ];

  get autodialerMode (): string {
    return this.$store.state.autodialer.view.mode
  }

  set autodialerMode (val: string) {
    this.$store.commit('autodialer/view/mode', val)
  }

  get autodialerStatusOptions () {
    return [
      {
        text: ''
      }
    ]
  }

  /**
   * Срабатывает при нажатии на кнопку Start
   */
  onBtnStartClick () {
    this.processStartingOrStopping = true
    this.$axios.get(`/autodialer/params/${+this.$route.params.id}/start`)
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Auto dialer activated')
        this.$store
          .dispatch('autodialer/view/fetch', this.$route.params.id)
          .finally(() => (this.processStartingOrStopping = false))
      }).catch((reason: Error) => {
        this.processStartingOrStopping = false
        this.$toast.error(reason.message)
      })
  }

  /**
   * Срабатывает при нажатии на кнопку Stop
   */
  onBtnStopClick () {
    this.processStartingOrStopping = true
    this.$axios.get(`/autodialer/params/${+this.$route.params.id}/stop`)
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Auto dialer deactivated')
        this.$store
          .dispatch('autodialer/view/fetch', this.$route.params.id)
          .finally(() => (this.processStartingOrStopping = false))
      }).catch((reason: Error) => {
        this.processStartingOrStopping = false
        this.$toast.error(reason.message)
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
