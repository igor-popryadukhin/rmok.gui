<template>
  <div class="tasks-page">
    <div class="tasks-page__tabs">
      <v-tabs
        height="35"
        hide-slider
      >
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab
            :key="`v-tab-${tabIndex}`"
            :to="tab.to"
          >
            {{ tab.title }} <span
              v-if="tab.count"
              class="ml-2"
            >[{{ tab.count > 99 ? '99+' : tab.count }}]</span>
          </v-tab>
          <v-divider
            v-if="tabIndex < tabs.length -1"
            :key="`v-divider-${tabIndex}`"
            vertical
          />
        </template>
      </v-tabs>
    </div>
    <v-divider class="mb-2" />
    <div class="tasks-page__box">
      <div class="tasks-page__filters">
        <div class="overflow-y-auto py-2">
          <div class="mb-5">
            <v-text-field
              v-model="filterQ"
              :label="$tc('Search')"
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
            />
          </div>
          <div class="mb-5">
            <v-select
              v-model="filterStatusId"
              :label="$tc('Result')"
              :items="statuses"
              item-text="name"
              item-value="id"
              item-color="color"
              outlined
              dense
              hide-details
              clearable
            />
          </div>
          <div class="mb-5">
            <v-select
              v-model="filterState"
              :label="$tc('Tasks state')"
              :items="states"
              item-text="title"
              item-value="value"
              outlined
              dense
              hide-details
            />
          </div>
        </div>
        <div class="mt-auto">
          <v-btn
            :disabled="itemsFetching"
            color="primary"
            tile
            block
            text
            @click="onBtnSearchClick"
          >
            {{ $tc('Search') }}
          </v-btn>
        </div>
      </div>
      <div class="tasks-page__list">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import debounce from '@/utils/debounce'
import { tasks } from './store'
import Base from './Base'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<Tasks>({
  components: {
    AppAutocomplete,
    AppNavigationDrawer,
    AppBtnToggleDate
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.calculateTasksCount()
    })
  }
})
export default class Tasks extends Base {
  get filterQ () {
    return this.$store.getters[`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_q`]
  }
  set filterQ (value: string) {
    this.$store.commit(`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_q`, value)
  }

  get filterStatusId () {
    return this.$store.getters[`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_status_id`]
  }
  set filterStatusId (value: number) {
    this.$store.commit(`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_status_id`, value)
  }

  get filterState () {
    return this.$store.getters[`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_state`]
  }
  set filterState (value: string) {
    this.$store.commit(`${this.getVuexModuleNamespace(this.$route)}/list/filter/filter_state`, value)
  }

  get tabs () {
    const {
      // $route,
      // $store,
      $dayjs
      // getVuexModuleNamespace
    } = this

    const from = $dayjs().local()
    const to = $dayjs().local()
    const isoFormat = 'YYYY-MM-DD'

    return [
      {
        id: 'for-next-day',
        title: 'На завтра',
        count: this.tabTaskCount('for-next-day'),
        to: {
          name: 'tasks_list',
          params: { id: 'for-next-day' }
        },
        params: {
          planned_for: `${from.add(1, 'day').format(isoFormat)}|${to.add(1, 'day').format(isoFormat)}`
        }
      },
      {
        id: 'for-today',
        title: 'На сегодня',
        count: this.tabTaskCount('for-today'),
        to: {
          name: 'tasks_list',
          params: { id: 'for-today' }
        },
        params: {
          planned_for: `${from.format(isoFormat)}|${to.format(isoFormat)}`
        }
      },
      {
        id: 'yesterday',
        title: 'Вчерашние',
        count: this.tabTaskCount('yesterday'),
        to: {
          name: 'tasks_list',
          params: { id: 'yesterday' }
        },
        params: {
          planned_for: `${from.subtract(1, 'day').format(isoFormat)}|${to.subtract(1, 'day').format(isoFormat)}`
        }
      },
      {
        id: 'day-before-yesterday',
        title: 'Позавчерашние',
        count: this.tabTaskCount('day-before-yesterday'),
        to: {
          name: 'tasks_list',
          params: { id: 'day-before-yesterday' }
        },
        params: {
          planned_for: `${from.subtract(2, 'day').format(isoFormat)}|${to.subtract(2, 'day').format(isoFormat)}`
        }
      },
      {
        id: 'month',
        title: $dayjs().format('MMM'),
        count: this.tabTaskCount('month'),
        to: {
          name: 'tasks_list',
          params: { id: 'month' }
        },
        params: {
          planned_for: `${from.startOf('month').format(isoFormat)}|${to.endOf('month').format(isoFormat)}`
        }
      },
      {
        id: 'per_year',
        title: this.$tc('Per year'),
        count: this.tabTaskCount('per_year'),
        to: {
          name: 'tasks_list',
          params: { id: 'per_year' }
        },
        params: {
          planned_for: `${from.startOf('year').format(isoFormat)}|${to.endOf('year').format(isoFormat)}`,
          state: 'pending'
        }
      },
      // {
      //   id: 'custom',
      //   get title () {
      //     const arr = String($store.getters[`${getVuexModuleNamespace($route)}/list/filter/planned_for`] || '')
      //       .split('|')
      //     if (arr.length === 2) {
      //       const from = $dayjs(arr[0], 'YYYY-MM-DD').format('DD.MM.YYYY')
      //       const to = $dayjs(arr[1], 'YYYY-MM-DD').format('DD.MM.YYYY')
      //       return `с ${from} по ${to}`
      //     } else {
      //       return 'Настраиваемый'
      //     }
      //   },
      //   to: {
      //     name: 'tasks_list',
      //     params: { id: 'custom' }
      //   },
      //   menu: {
      //     visible: true
      //   }
      // }
    ]
  }

  get statuses () {
    return this.$profile?.project?.statuses || []
  }

  get states () {
    return [
      {
        title: this.$tc('task_pending'),
        value: 'pending',
      },
      {
        title: this.$tc('task_done'),
        value: 'done',
      }
    ]
  }

  public created () {
    this.initializeVuexModules()
    this.onSSETasksChanged = debounce(this.onSSETasksChanged, 10000)
    this.$root.$on('sse:tasks:changed', this.onSSETasksChanged)
  }

  public beforeDestroy () {
    this.$root.$off('sse:tasks:changed', this.onSSETasksChanged)
  }

  private onSSETasksChanged () {
    this.calculateTasksCount()
    this.fetchTasks()
  }

  private initializeVuexModules () {
    // Регистрация модулей vuex
    this.tabs.forEach((tab) => {
      const path = `tasks_${tab.to.params.id}`
      if (!this.$store.hasModule(path)) {
        this.$store.registerModule(path, tasks)

        if ('params' in tab && 'planned_for' in tab.params) {
          this.$store.commit(`${path}/list/filter/filter_planned_for`, tab.params.planned_for)
        }
      }
    })
  }

  /**
   *
   * @private
   */
  private calculateTasksCount () {
    const request = []
    this.tabs.forEach((tab) => {
      if ('params' in tab && 'planned_for' in tab.params) {
        request.push({
          id: tab.to.params.id,
          params: {
            planned_for: tab.params.planned_for
          }
        })
      }
    })

    this.$store.dispatch('tasks/calculate', request)
  }

  private tabTaskCount (id: string) {
    return (this.$store.getters['tasks/pending_items'] || []).find((e) => e.id === id)?.count || 0
  }

  private onBtnSearchClick () {
    this.calculateTasksCount()
    this.fetchTasks()
  }
}
</script>

<style lang="scss" scoped>
.tasks-page {
  display: flex;
  flex-direction: column;
  height: var(--page-calculated-height2);
  overflow: auto;
}

.tasks-page__tabs {
  background-color: #ff8866;
  height: 35px;
}

.tasks-page__box {
  display: flex;
  flex-direction: row;
  height: calc(var(--page-calculated-height2) - 45px);
}

.tasks-page__filters {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 250px;
  overflow: auto;
  border-right: #0000001f solid 1px;
  height: 100%;
  padding-right: 5px;
  margin-right: 5px;
}

.tasks-page__list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
  height: 100%;
}
</style>
