<template>
  <div class="autodialer-main-page d-flex flex-nowrap">
    <div
      class="fill-height overflow-y-auto"
      style="width: 280px"
    >
      <!-- Наименование -->
      <div class="mb-1 mt-1">
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
          v-model="autodialerDescription"
          :label="$tc('Description')"
          rows="3"
          dense
          outlined
        />
      </div>
      <!-- Описание -->

      <!-- Проект -->
      <div class="mb-1">
        <app-autocomplete
          v-model="autodialerProjectId"
          :options="projects"
          :label="$tc('Project')"
          :loading="projectsFetching"
          item-text="name"
          item-value="id"
          clearable
          @search="searchProjects"
          @focus="searchProjects()"
        />
      </div>
      <!-- Проект -->

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

      <div class="d-flex flex-row mb-1">
        <div
          class="mr-1"
          style="width: 50%"
        >
          <v-btn
            v-if="autodialerStatus === 'ready'"
            :loading="processStartingOrStopping"
            color="primary"
            outlined
            tile
            block
            small
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
            small
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
            small
          >
            {{ $tc('Start') }}
          </v-btn>
        </div>
        <div
          class="ml-1"
          style="width: 50%"
        >
          <v-btn
            color="primary"
            :loading="processApply"
            :disabled="autodialerStatus === 'process'"
            outlined
            tile
            block
            small
            @click="onBtnSaveClick"
          >
            {{ $tc('Save') }}
          </v-btn>
        </div>
      </div>
    </div>
    <v-divider
      class="mx-2"
      vertical
    />
    <div
      class="d-flex flex-row  mt-1"
      style="width: 100%"
    >
      <div
        class="d-flex flex-wrap flex-row align-content-start overflow-auto"
        style="height: calc(100vh - 145px); width: 100%"
      >
        <template v-for="(item, itemIndex) in autodialerSummary">
          <v-card
            :key="'v-card-' + itemIndex"
            class="mr-2 mb-2"
            min-width="150"
            max-width="250"
            height="100"
            flat
            outlined
            tile
          >
            <div class="d-flex justify-center align-center fill-height pa-2">
              <div class="d-flex flex-column flex-nowrap">
                <v-icon size="24">
                  {{ item.icon }}
                </v-icon>
                <span class="text-h6 text-center mb-n2 ">
                  <template v-if="typeof item.value === 'number'">
                    <app-count-up
                      :end-val="item.value"
                      style="font-size: 16px"
                    />
                  </template>
                  <template
                    v-else
                    style="font-size: 16px"
                  >
                    {{ item.value }}
                  </template>
                </span>
                <span
                  class="text-center grey--text"
                  style="font-size: 12px"
                >
                  {{ item.title }}
                </span>
              </div>
            </div>
          </v-card>
        </template>
        <template v-for="(item, itemIndex) in workerStatus">
          <v-card
            :key="'v-card-worker-status' + itemIndex"
            class="mr-2 mb-2"
            width="150"
            height="100"
            flat
            outlined
            tile
          >
            <div class="d-flex justify-center align-center fill-height pa-2">
              <div class="d-flex flex-column flex-nowrap">
                <v-icon size="24">
                  {{ item.icon }}
                </v-icon>
                <span
                  class="text-h6 text-center mb-n2 "
                >
                  <template v-if="typeof item.value === 'number'">
                    <app-count-up
                      :end-val="item.value"
                      style="font-size: 16px"
                    />
                  </template>
                  <template
                    v-else
                    style="font-size: 16px"
                  >
                    {{ item.value }}
                  </template>
                </span>
                <span
                  class="text-center grey--text"
                  style="font-size: 12px"
                >
                  {{ item.title }}
                </span>
              </div>
            </div>
          </v-card>
        </template>
      </div>
      <v-divider
        class="mx-2"
        vertical
      />
      <div
        class="overflow-y-auto"
        style="height: calc(100vh - 145px); width: 500px;"
      >
        <div
          v-if="workerAgents.length === 0"
          class="d-flex align-center justify-center fill-height"
        >
          <span class="grey--text">
            {{ $tc('Empty') }}
          </span>
        </div>
        <div
          class="overflow-y-auto"
        >
          <v-list class="py-0">
            <template v-for="(item) in workerAgents">
              <v-list-item :key="'v-list-item-' + item.login">
                <v-list-item-avatar
                  width="25"
                >
                  <v-icon
                    v-if="item.status === 'in_use'"
                    size="24"
                  >
                    mdi-phone-in-talk-outline
                  </v-icon>
                  <v-icon
                    v-else-if="item.paused"
                    size="24"
                  >
                    mdi-phone-paused-outline
                  </v-icon>
                  <v-icon
                    v-else-if="item.status === 'not_inuse'"
                    size="24"
                  >
                    mdi-phone-check-outline
                  </v-icon>
                  <v-icon v-else-if="['ringing', 'ring_in_use'].includes(item.status)">
                    mdi-phone-ring-outline
                  </v-icon>
                  <v-icon
                    v-else-if="item.status === 'unavailable'"
                    size="24"
                  >
                    mdi-phone-minus-outline
                  </v-icon>
                  <v-icon
                    v-else
                    size="24"
                  >
                    mdi-cube-outline
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-space-between">
                    <span style="font-size: 14px">{{ item.user_name }}</span>
                    <span
                      class="grey--text"
                      style="font-size: 11px"
                    >{{ $dayjs(item.last_call_at * 1000).format('DD.MM.YYYY HH:mm:ss') }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    @{{ item.login }}
                  </v-list-item-subtitle>
                  <!--                <div-->
                  <!--                  class="d-flex align-center"-->
                  <!--                  style="height: 16px; "-->
                  <!--                >-->
                  <!--                  - -->
                  <!--                </div>-->
                </v-list-item-content>
                <!--              <v-list-item-action>-->
                <!--                <v-list-item-action-text>{{ $dayjs(item.last_call_at * 1000).format('DD.MM.YYYY HH:mm:ss') }}</v-list-item-action-text>-->
                <!--              </v-list-item-action>-->
              </v-list-item>
              <v-divider :key="'v-list-item-divider-' + item.login" />
            </template>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Project from '@/api/interfaces/Project'
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

interface Agent {
  user_name: string;
  login: string;
  in_call: boolean;
  paused: boolean;
  status: 'not_inuse' | 'inuse' | 'busy' | 'invalid' | 'unavailable' | 'ringing' | 'ring_in_use' | 'on_hold';
  last_call_at: number;
  last_pause: number;
}

@Component({
  components: { AppBlockResize, AppCountUp, AppAutocomplete, AppSummary, AppLoading }
})
export default class Main extends AppBase {
  timerIds = []
  processStartingOrStopping = false;
  processApply = false;
  autodialerModeOptions = [
    { text: 'Предиктивный', value: 'predictive' },
    { text: 'Прогрессивный', value: 'progressive' }
  ];

  workerStatus = []
  workerAgents = []
  projectsFetching = false
  projects = []

  get autodialerSummary () {
    return this.$store.getters['autodialer/view/summary']
  }

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

  get autodialerDescription (): string {
    return this.$store.state.autodialer.view.description
  }

  set autodialerDescription (val: string) {
    this.$store.commit('autodialer/view/description', val)
  }

  get autodialerProjectId (): number {
    if (this.projects.length === 0 && this.$store.state.autodialer.view.project?.id) {
      this.searchProjects(this.$store.state.autodialer.view.project.name)
      this.searchProjects('')
    }
    return this.$store.state.autodialer.view.project?.id || 0
  }

  set autodialerProjectId (val: number) {
    const project = this.projects.find((e) => e.id === val)
    if (project) { this.$store.commit('autodialer/view/project', project) }
  }

  public created () {
    this.$root.$on('sse-autodialer-worker-stats', this.onSSEAutodialerWorkerStats)
    this.$root.$on('sse-autodialer-worker-agents', this.onSSEAutodialerWorkerAgents)

    this.fetchSummary()
    this.timerIds.push(setInterval(() => {
      if (this.$route.name === 'auto_dialer_view_tab_main' && this.autodialerStatus === 'process') {
        this.fetchSummary()
      }
    }, 10000))
  }

  public beforeDestroy () {
    this.$root.$off('sse-autodialer-worker-stats', this.onSSEAutodialerWorkerStats)
    this.$root.$off('sse-autodialer-worker-agents', this.onSSEAutodialerWorkerAgents)
    this.timerIds.map(clearInterval)
  }

  private onSSEAutodialerWorkerStats (data: Array<Record<string, unknown>>) {
    this.workerStatus = data
  }

  private onSSEAutodialerWorkerAgents (data: Agent[]) {
    this.workerAgents = (data || []).sort((a, b) => {
      if (['not_inuse', 'ringing', 'in_use'].includes(a.status)) { return -1 }

      return 1
    })
  }

  /**
   * Срабатывает при нажатии на кнопку Start
   */
  private onBtnStartClick () {
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
  private onBtnStopClick () {
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

  private onBtnSaveClick () {
    this.onApplyChanges()
  }

  private fetchSummary () {
    this.$axios.get(`/auto-dialers/${this.$route.params.id}/summary`)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          this.$store.commit('autodialer/view/summary', response.data)
        }
      })
  }

  /**
   * Срабатывает при нажатии на кнопку Apply
   */
  private onApplyChanges () {
    this.processApply = true
    this.$axios.patch(`/auto-dialers/${this.$route.params.id}`, {
      project_id: this.autodialerProjectId,
      mode: this.autodialerMode,
      description: this.autodialerDescription
    }).then((response: AxiosResponse) => {
      if (response.status !== 200) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason) => {
      this.$toast.error(reason.message)
    }).finally(() => (this.processApply = false))
  }

  private searchProjects (q = '') {
    if (this.projects.length === 0 || this.projects.findIndex((e: Project) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.projectsFetching = true
      this.$axios.get('/projects', { params: { q } })
        .then((response: AxiosResponse) => {
          (response.data?.data as Project[])
            .forEach((e1) => {
              if (this.projects.findIndex((e2) => e2.id === e1.id) === -1) {
                this.projects.push(e1)
              }
            })
        }).finally(() => (this.projectsFetching = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.autodialer-main-page {
  height: 100%;
}
</style>

<i18n>
{
  "ru": {
    "Paused": "Приостановлен",
    "agent_status": {
      "not_inuse" : "Ожидает",
      "ringing" : "Входящий вызов",
      "in_use" : "Разговаривает"
    }

  }
}
</i18n>
