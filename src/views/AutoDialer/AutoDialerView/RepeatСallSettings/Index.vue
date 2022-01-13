<template>
  <v-sheet class="fill-height">
    <v-row
      class="mb-2"
      no-gutters
    >
      <v-col
        class="d-flex align-center"
        cols="3"
      >
        <h4>Результат звонка</h4>
      </v-col>
      <v-col>
        <h4>Действие</h4>
      </v-col>
      <v-col cols="2">
        <h4>Интервал</h4>
      </v-col>
      <v-col cols="2">
        <h4>Попытки</h4>
      </v-col>
    </v-row>
    <v-divider class="mb-3" />

    <!-- Статусы -->
    <template v-if="statuses.length > 0">
      <v-row
        v-for="(item, key) in statuses"
        :key="key"
        class="mb-2"
        no-gutters
      >
        <v-col cols="3">
          <div class="d-flex align-center">
            {{ item.status_name }}
          </div>
        </v-col>
        <v-col>
          <v-select
            v-model="item.action"
            :items="repeatCallsSettingsAvailableActions"
            item-text="name"
            item-value="value"
            class="mr-2"
            dense
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model.number="item.interval"
            type="number"
            class="mr-2"
            dense
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model.number="item.attempts"
            type="number"
            dense
            outlined
            hide-details
          />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row
        class="mb-2"
        no-gutters
      >
        <v-col
          class="d-flex flex-column align-center justify-center"
          style="height: 200px; background-color: #ededed"
        >
          <div class="mb-2">
            Нет не одного правила, что бы добавить правило нажмите "Добавить"
          </div>
          <div>
            <v-btn
              text
              tile
              small
              outlined
              @click="onBtnAddRuleClick"
            >
              Добавить
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <!-- Статусы -->

    <v-divider class="my-3" />
    <v-row
      class="mb-2"
      no-gutters
    >
      <v-col class="d-flex">
        <div class="align-self-center mr-3">
          Максимальное число звонков клиенту
        </div>
        <div>
          <v-text-field
            v-model.number="maximumAttempts"
            type="number"
            style="max-width: 80px"
            dense
            outlined
            hide-details
          />
        </div>
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
        >
          {{ $tc('Default') }}
        </v-btn>
        <v-spacer />
        <v-btn
          :loading="processSave"
          :disabled="!isChanged"
          color="primary"
          outlined
          tile
          @click="onBtnSaveClick"
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
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { Watch } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: { AppLoading },
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
export default class Index extends AppBase {
  processSave = false
  isChanged = false
  availableStatuses = []
  statuses = []
  maximumAttempts = 0

  /**
   * Возможные варианты действий
   */
  get repeatCallsSettingsAvailableActions () {
    return this.$store.getters['autodialer/view/repeat_calls_settings_available_actions']
  }

  get repeatCallSettings () {
    return this.$store.getters['autodialer/view/repeat_calls_settings']
  }

  @Watch('isChanged')
  isChangedWatchHandle (value: boolean) {
    if (value) { this.$confirmBeforeunload() } else { this.$confirmBeforeunloadFlush() }
  }

  mounted () {
    this.maximumAttempts = this.$store.getters['autodialer/view/maximum_attempts']

    // Копирую в новый массив, это позволит открепиться от "vuex"
    this.statuses = this.repeatCallSettings.map((e) => {
      return {
        id: e.id,
        action: e.action,
        attempts: e.attempts,
        interval: e.interval,
        status_name: e.status_name,
        status_code: e.status_code
      }
    })

    this.$watch('maximumAttempts', () => (this.isChanged = true))
    this.$watch('statuses', () => (this.isChanged = true), { deep: true })
  }

  /**
   * Срабатывает при нажатии на кнопку сохранить.
   *
   * @private
   */
  private onBtnSaveClick () {
    this.processSave = true
    $axios.patch(`/auto-dialers/${this.$route.params.id}`, {
      maximum_attempts: this.maximumAttempts,
      repeat_calls_settings: this.statuses.map((e: Record<string, unknown>) => {
        return {
          id: e.id,
          action: e.action,
          attempts: e.attempts,
          interval: e.interval
        }
      })
    }).then((response: AxiosResponse) => {
      if (response.status === 200) {
        this.isChanged = false
        this.$toast.success('Changes accepted')
      }
    }).catch((e: Error) => (this.$toast.error(e.message))).finally(() => (this.processSave = false))
  }

  private async onBtnAddRuleClick () {
    // TODO: Скорее всего реализация не требуется.
  }
}
</script>

<style lang="scss" scoped>
.controls div:not(:last-child) {
  margin-right: 10px;
}
</style>
