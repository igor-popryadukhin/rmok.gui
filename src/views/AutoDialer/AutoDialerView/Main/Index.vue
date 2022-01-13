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
              v-model="description"
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
      <v-col class="d-flex justify-start">
        <stats />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4>Журнал действий и событий</h4>
        <journal
          :height="450"
          outlined
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import Journal from './Journal.vue'
import StatsOnline from './StatsOnline.vue'
import StatsAbandonedCall from './StatsAbandonedCall.vue'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'
import AppBase from '@/AppBase'
import Stats from './Stats.vue'
import { Watch } from 'vue-property-decorator'
import debounce from '@/utils/debounce'

@Component({
  components: { Stats, StatsAbandonedCall, StatsOnline, AppLoading, Journal }
})
export default class AutoDialerView extends AppBase {
  processStartingOrStopping = false;
  isChanged = false;
  processApply = false;
  isChangedDescription = false;
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ];

  get autodialerName (): string {
    return this.$store.state.autodialer.view.name
  }

  get autodialerStatus (): string {
    return this.$store.state.autodialer.view.status
  }

  get autodialerMode (): string {
    return this.$store.state.autodialer.view.mode
  }

  set autodialerMode (val: string) {
    this.$store.commit('autodialer/view/mode', val)
  }

  get description (): string {
    return this.$store.state.autodialer.view.description
  }

  set description (val: string) {
    this.$store.commit('autodialer/view/description', val)
  }

  public created () {
    this.$watch('autodialerMode', () => (this.isChanged = true))
    this.$watch('description', () => (this.isChangedDescription = true))
  }

  @Watch('isChanged')
  changeWatchHandler (value: boolean) {
    if (value) {
      this.onApplyChanges = debounce(this.onApplyChanges, 1500)
      this.onApplyChanges()
    }
  }

  @Watch('isChangedDescription')
  changeDescriptionHandler (value: boolean) {
    // Запрос на каждый пятый добавленный символ к строке
    const lengthChar = 5
    if (value && (this.description.length % lengthChar === 0)) {
      this.onApplyChanges = debounce(this.onApplyChanges, 1500)
      this.onApplyChanges()
    } else {
      this.isChangedDescription = false
    }
  }

  /**
   * Срабатывает при нажатии на кнопку Start
   */
  onBtnStartClick () {
    this.processStartingOrStopping = true
    this.$axios.get(`/auto-dialers/${this.$route.params.id}/start`)
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
    this.$axios.get(`/auto-dialers/${+this.$route.params.id}/stop`)
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
  private onApplyChanges () {
    this.processApply = true
    this.$store.dispatch('autodialer/view/apply')
      .then(() => {
        this.isChanged = false
        this.isChangedDescription = false
        this.$toast.success('Changes accepted')
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      }).finally(() => (this.processApply = false))
  }
}
</script>

<style scoped>

</style>
