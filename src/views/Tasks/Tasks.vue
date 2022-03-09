<template>
  <div class="tasks-page">
    <v-sheet
      class="d-flex flex-nowrap grow"
      height="35"
    >
      <v-tabs
        height="35"
        hide-slider
      >
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab
            :key="`v-tab-${tabIndex}`"
            :to="tab.to"
          >
            {{ tab.title }}
            <v-badge
              v-if="tab.count"
              :content="tab.count > 99 ? '99+' : tab.count"
              color="red"
              inline
            />
          </v-tab>
          <v-divider
            v-if="tabIndex < tabs.length -1"
            :key="`v-divider-${tabIndex}`"
            vertical
          />
        </template>
      </v-tabs>
    </v-sheet>

    <app-divider class="my-1" />

    <v-row
      no-gutters
      style="height: inherit"
    >
      <v-col
        style="height: inherit"
      >
        <v-sheet
          class="overflow-auto"
          style="height: inherit"
        >
          <keep-alive>
            <router-view />
          </keep-alive>
        </v-sheet>
      </v-col>
      <v-divider vertical />
      <v-col
        cols="3"
        style="height: inherit"
      >
        <v-sheet
          class="overflow-auto"
          style="height: inherit"
        >
          <tasks-filters />
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import { tasks } from '@/store/tasks'
import TasksBase from '@/views/Tasks/TasksBase'

import Component from 'vue-class-component'
import TasksFilters from './TasksFilters.vue'

// eslint-disable-next-line no-use-before-define
@Component<Tasks>({
  components: {
    AppAutocomplete,
    TasksFilters,
    AppNavigationDrawer,
    AppBtnToggleDate
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.calculateTasksCount()
    })
  }
})
export default class Tasks extends TasksBase {
  isoFormat = 'YYYY-MM-DD'

  get tabs () {
    const from = this.$dayjs().local()
    const to = this.$dayjs().local()
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
          planned_for: `${from.add(1, 'day').format(this.isoFormat)}|${to.add(1, 'day').format(this.isoFormat)}`
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
          planned_for: `${from.format(this.isoFormat)}|${to.format(this.isoFormat)}`
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
          planned_for: `${from.subtract(1, 'day').format(this.isoFormat)}|${to.subtract(1, 'day').format(this.isoFormat)}`
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
          planned_for: `${from.subtract(2, 'day').format(this.isoFormat)}|${to.subtract(2, 'day').format(this.isoFormat)}`
        }
      },
      {
        id: 'custom',
        title: this.customDisplay,
        to: {
          name: 'tasks_list',
          params: { id: 'custom' }
        },
        menu: {
          visible: false
        }
      }
    ]
  }

  get customDisplay () {
    const arr = String(this.$store.getters['tasks/custom/list/filter/planned_for'] || '')
      .split('|')
    if (arr.length === 2) {
      const from = this.$dayjs(arr[0], 'YYYY-MM-DD').format('DD.MM.YYYY')
      const to = this.$dayjs(arr[1], 'YYYY-MM-DD').format('DD.MM.YYYY')
      return `с ${from} по ${to}`
    } else {
      return 'Настраиваемый'
    }
  }

  public created () {
    this.initializeVuexModules()
  }

  private initializeVuexModules () {
    // Регистрация модулей vuex
    this.tabs.forEach((tab) => {
      const path = ['tasks', tab.to.params.id]
      if (!this.$store.hasModule(path)) {
        this.$store.registerModule(path, tasks)

        if ('params' in tab && 'planned_for' in tab.params) {
          this.$store.commit(`tasks/${tab.to.params.id}/list/filter/filter_planned_for`, tab.params.planned_for)
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
}
</script>

<style lang="scss" scoped>
.tasks-page {
  height: calc(100vh - 145px);
}

.tools-right {
  display: flex;
  margin-right: 10px;
}

.task-toolbar {
  flex: none !important;
  box-shadow: none !important;

  &-extension {
    display: flex;
    flex-flow: column;
  }

  &-extension small {
    font-size: 12px;
    color: #848484;
  }
}
</style>
