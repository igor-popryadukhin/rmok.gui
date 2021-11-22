<template>
  <v-sheet>
    <template v-if="processLoading">
      <div
        class="d-flex align-center justify-center"
        style="height: 500px"
      >
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <v-sheet
            class="d-flex flex-column"
            :height="250"
          >
            <div class="mb-5">
              <h3>{{ autodialerName }}</h3>
            </div>
            <div class="py-2">
              <v-btn
                v-if="autodialerStatus === 'ready'"
                :loading="processStartingOrStopping"
                color="primary"
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
                outlined
                tile
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
              >
                Start
              </v-btn>
            </div>
            <div class="d-flex py-2">
              <v-text-field
                class="mr-4"
                type="number"
                label="Количество минут через которое следует позвонить лиду"
                value="0"
              />
              <v-text-field
                type="number"
                label="Количество линий"
                value="0"
              />
            </div>
          </v-sheet>
        </v-col>
        <v-col>
          <operators-online
            height="200"
            outlined
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <journal />
        </v-col>
        <v-col>
          ***
        </v-col>
      </v-row>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import Journal from './Journal.vue'
import Control from './Control.vue'
import Base from './Base'
import AutodialerParams from '@/api/AutodialerParams'
import OperatorsOnline from '@/views/AutoDialer/AutoDialerView/OperatorsOnline.vue'

@Component({
  components: { OperatorsOnline, AppLoading, Journal, Control }
})
export default class AutoDialerView extends Base {
  processLoading = true
  processStartingOrStopping = false

  mounted () {
    this.$store
      .dispatch('autodialer/view/fetch', this.$route.params.id)
      .finally(() => (this.processLoading = false))
  }

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
}
</script>

<style scoped>

</style>
