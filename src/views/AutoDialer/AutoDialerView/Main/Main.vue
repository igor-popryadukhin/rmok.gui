<template>
  <div>
    <div class="d-flex flex-row mb-5">
      <div
        class="d-flex flex-column mr-5"
        style="width: 350px"
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

        <div class="d-flex flex-row grow mb-1">
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
              @click="onBtnSaveClick"
            >
              {{ $tc('Save') }}
            </v-btn>
          </div>
        </div>
      </div>
      <div
        class="d-flex align-self-start justify-start flex-wrap"
        style="width: 100%"
      >
        <template v-for="(item, itemIndex) in autodialerSummary">
          <v-card
            :key="'v-card-' + itemIndex"
            class="mr-2 mb-2"
            width="200"
            height="150"
            flat
            outlined
            tile
          >
            <div class="d-flex justify-center align-center fill-height pa-2">
              <div class="d-flex flex-column flex-nowrap">
                <v-icon size="32">
                  {{ item.icon }}
                </v-icon>
                <span class="text-h6 text-center mb-n2 ">
                  <template v-if="typeof item.value === 'number'">
                    <app-count-up
                      :end-val="item.value"
                    />
                  </template>
                  <template v-else>
                    {{ item.value }}
                  </template>
                </span>
                <span class="text-subtitle-2 text-center grey--text">
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
            width="200"
            height="150"
            flat
            outlined
            tile
          >
            <div class="d-flex justify-center align-center fill-height pa-2">
              <div class="d-flex flex-column flex-nowrap">
                <v-icon size="32">
                  {{ item.icon }}
                </v-icon>
                <span class="text-h6 text-center mb-n2 ">
                  <template v-if="typeof item.value === 'number'">
                    <app-count-up
                      :end-val="item.value"
                    />
                  </template>
                  <template v-else>
                    {{ item.value }}
                  </template>
                </span>
                <span class="text-subtitle-2 text-center grey--text">
                  {{ item.title }}
                </span>
              </div>
            </div>
          </v-card>
        </template>
      </div>
    </div>
    <v-row>
      <v-col>
        <h4>Журнал действий и событий</h4>
        <journal
          :height="450"
          outlined
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Project from '@/api/interfaces/Project'
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'
import Journal from './Journal.vue'

@Component({
  components: { AppCountUp, AppAutocomplete, AppSummary, AppLoading, Journal }
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

    this.fetchSummary()
    this.timerIds.push(setInterval(() => {
      if (this.$route.name === 'auto_dialer_view_tab_main' && this.autodialerStatus === 'process') {
        this.fetchSummary()
      }
    }, 10000))
  }

  public beforeDestroy () {
    this.$root.$off('sse-autodialer-worker-stats', this.onSSEAutodialerWorkerStats)
    this.timerIds.map(clearInterval)
  }

  private onSSEAutodialerWorkerStats (data: Array<Record<string, unknown>>) {
    this.workerStatus = data
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

<style scoped>

</style>
