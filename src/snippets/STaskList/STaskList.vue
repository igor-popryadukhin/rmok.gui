<template>
  <v-card
    :outlined="outlined"
    class="px-0"
    flat
    tile
  >
    <v-app-bar
      v-if="filtersEnabled"
      color="white"
      flat
      tile
    >
      <div class="d-flex flex-wrap">
        <v-btn-toggle
          v-model="filter.planned_for"
          class="d-flex flex-wrap justify-start"
          group
          dense
        >
          <template v-for="item in btnToggles">
            <v-btn
              :key="item.value"
              :value="item.value"
              :x-small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              :small="['md'].includes($vuetify.breakpoint.name)"
            >
              {{ $tc(item.title) }}
              <v-badge
                v-if="item.count > 0"
                v-bind="item.badge"
                :content="item.count"
                :dot="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                inline
              />
            </v-btn>
          </template>

          <v-menu
            v-model="menuSelectStatus"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                :x-small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                :small="['md'].includes($vuetify.breakpoint.name)"
                :color="filterSelectedStatus ? filterSelectedStatus.color : ''"
                outlined
                v-on="on"
              >
                <template v-if="filterSelectedStatus">
                  {{ filterSelectedStatus.name }}
                </template>
                <template v-else>
                  {{ $tc('Select status') }}
                </template>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in statuses"
                :key="index"
                :value="item.id"
                :color="item.color"
                :class="filter.status_id === item.id ? 'v-list-item--active' : ''"
                link
                selectable
                @click="filter.status_id = item.id"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu
            ref="menuDateRange"
            v-model="menuDateRange"
            :close-on-content-click="false"
            :return-value.sync="filter.date_range"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-btn
                :class="/^\d+,\d+/s.test(String($route.query[prefix('planned_for')])) ? 'v-btn--active' : ''"
                :value="null"
                :x-small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                :small="['md'].includes($vuetify.breakpoint.name)"
                v-on="on"
              >
                <v-icon>mdi-calendar-month-outline</v-icon>
                {{ $tc('Select date') }}
              </v-btn>
            </template>
            <v-date-picker
              v-model="dateRange"
              :first-day-of-week="1"
              scrollable
              range
              no-title
              locale="ru"
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="onClearDateRangeClick"
              >
                {{ $tc('Cancel') }}
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="onSaveDateRangeClick(dateRange)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-btn-toggle>
      </div>
      <v-spacer />
    </v-app-bar>

    <v-card-text
      class="py-0"
      :class="outlined ? '' : 'px-0'"
    >
      <template v-if="task_items.length === 0 && tasksLoading === true">
        <div
          class="d-flex align-center justify-center"
        >
          <div class="grey--text">
            {{ $tc('Loading content...') }}
          </div>
        </div>
      </template>
      <template v-if="task_items.length === 0 && tasksLoading === false">
        <div
          class="d-flex flex-wrap align-center justify-center"
          style="height: 400px"
        >
          <div class="grey--text">
            {{ $tc('Task list is empty') }}
          </div>
        </div>
      </template>
      <template v-if="task_items.length > 0">
        <v-list>
          <template v-for="(taskItem, taskIndex) in task_items">
            <v-divider
              v-if="isVisibleDivider && taskIndex > 0"
              :key="`v-divider-${taskIndex}`"
            />
            <v-skeleton-loader
              v-if="tasksLoading"
              :key="`v-skeleton-loader-${taskIndex}`"
              type="list-item-three-line"
              height="79"
            />
            <v-list-item
              v-else
              :key="`v-list-item-${taskIndex}`"
              :style="vListItemStyleComputed(taskItem)"
              link
              exact
              @click.stop="onTaskItemClick(taskItem)"
            >
              <v-list-item-content>
                <slot
                  name="item"
                  :item="taskItem"
                >
                  <v-list-item-title
                    :style="{ color: taskItem.expired ? 'red' : '' }"
                  >
                    {{ `Позвонить ${$moment.unix(taskItem.planned_for).format(`Do MMMM, dddd, ${date_time_format.long_time} a`)}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="taskItem.contact">
                    {{ taskItem.contact.last_name }} {{ taskItem.contact.first_name }} {{
                      taskItem.contact.middle_name
                    }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span
                      class="label mr-2"
                      :style="{'background-color': lastContactStatus(taskItem.contact).color }"
                      :class="lastContactStatus(taskItem.contact).class"
                    >
                      {{ lastContactStatus(taskItem.contact).name }}
                    </span> {{ taskItem.description || '—' }}
                  </v-list-item-subtitle>
                </slot>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu
                  bottom
                  left
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item
                      v-for="(itemAction, i) in itemActions"
                      :key="i"
                      v-bind="itemAction.attrs"
                      @click="itemAction.click(taskItem)"
                    >
                      <v-list-item-title>{{ itemAction.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </v-card-text>

    <v-card-actions class="d-flex align-center justify-center py-5">
      <div v-if="task_paginator.pages > 1">
        <v-pagination
          v-model="task_paginator.page"
          :length="task_paginator.pages"
          total-visible="10"
        />
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { StatusInterface } from '@/api/Database'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import Tasks, { TaskInterface } from '@/api/Tasks'
import STaskDialogEditor, { DTaskInterface } from '@/snippets/STaskList/STaskDialogEditor.vue'
import { sleep } from '@/Utils'
import VInterface from '@/VInterface'
import moment from 'moment'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

interface Props {
  [key: string]: any;
}

interface Ref {
  [key: string]: any;
}

interface Data {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface Method {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Ref;
}

export default (Vue as VueConstructor<VInnerInterface>).extend<Data, Method, Computed, Props>({

  props: {

    /**
     * Включить фильтр
     **/
    filtersEnabled: {
      default () {
        return false
      },
      type: Boolean
    },

    outlined: {
      default: false,
      type: Boolean
    },

    paramPrefix: {
      default () {
        return 't_'
      },
      type: String
    },

    /**
     * Дополнительные параметры передаваемые конечной точке (имеет наивысший приоритет)
     **/
    params: {
      default () {
        return {}
      },
      type: Object
    },

    /**
     * Количество задач на страницу
     **/
    perPage: {
      default: 10,
      type: Number
    },

    /**
     * Включить инструменты
     **/
    toolsEnabled: {
      default () {
        return false
      },
      type: Boolean
    }
  },

  data () {
    return {
      dateRange: null as string[] | null,

      // Фильтр
      filter: {
        contact_id: 0,
        date_range: null,
        planned_for: null,
        q: '',
        sort: '',
        state: '',
        status_id: 0
      },

      menuDateRange: false,

      menuSelectStatus: false,

      // Сортировка
      sort: {
        items: [
          {
            title: 'По умолчанию',
            value: null
          },
          {
            title: 'Сначала новые',
            value: 'created_desc'
          },
          {
            title: 'Сначала старые',
            value: 'created_asc'
          }
        ] as unknown[] & { title: string; value: string },
        select: 'created_desc'
      },

      task_count: 0,

      task_items: [] as TaskInterface[],

      task_paginator: {
        page: 1,
        pages: 1,
        per_page_count: 25
      },

      // Метод загрузки задач
      fetchTasks: debounce((params = {}) => {
        let offset = this.task_paginator.per_page_count * this.task_paginator.page - this.task_paginator.per_page_count
        if (offset < 0) {
          offset = 0
        }
        const newParams: any = Object.assign({}, {
          count: this.task_paginator.per_page_count,
          offset
        }, params)

        // Поиск по тексту
        if (this.$route.query[this.prefix('q')]) {
          newParams.q = this.$route.query[this.prefix('q')]
        }

        if (this.$route.query[this.prefix('sort')]) {
          newParams.sort = this.$route.query[this.prefix('sort')]
        }

        // Статус контакта
        if (this.$route.query[this.prefix('status_id')]) {
          newParams.status_id = this.$route.query[this.prefix('status_id')]
        }

        // Статус Задачи
        if (this.$route.query[this.prefix('state')]) {
          newParams.state = this.$route.query[this.prefix('state')]
        }

        // Статус контакта
        if (this.$route.query[this.prefix('planned_for')]) {
          newParams.planned_for = this.$route.query[this.prefix('planned_for')]
        }

        new Tasks()
          .find<any, TaskInterface[]>(newParams)
          .then((response) => {
            this.task_count = response.meta?.count
            this.task_paginator.pages = Math.ceil(response.meta?.count / this.task_paginator.per_page_count)
            this.task_items = response.data
          })
      }, 350),

      btnToggles: [
        {
          badge: {
            color: 'red'
          },
          count: 0,
          params: () => {
            return {
              planned_for: `${moment('00:00:00', 'hh:mm:ss').add(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').add(1, 'day').unix()}`,
              state: 'pending',
              status_id: +this.filter.status_id
            }
          },
          title: 'For tomorrow',
          value: `${moment('00:00:00', 'hh:mm:ss').add(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').add(1, 'day').unix()}`
        },
        {
          badge: {
            color: 'red'
          },
          count: 0,
          params: () => {
            return {
              planned_for: `${moment('00:00:00', 'hh:mm:ss').unix()},${moment('23:59:59', 'hh:mm:ss').unix()}`,
              state: 'pending',
              status_id: +this.filter.status_id
            }
          },
          title: 'For today',
          value: `${moment('00:00:00', 'hh:mm:ss').unix()},${moment('23:59:59', 'hh:mm:ss').unix()}`
        },
        {
          badge: {
            color: 'red'
          },
          count: 0,
          params: () => {
            return {
              planned_for: `${moment('00:00:00', 'hh:mm:ss').subtract(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(1, 'day').unix()}`,
              state: 'pending',
              status_id: +this.filter.status_id
            }
          },
          title: 'Yesterday\'s',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(1, 'day').unix()}`
        },
        {
          badge: {
            color: 'red'
          },
          count: 0,
          params: () => {
            return {
              planned_for: `${moment('00:00:00', 'hh:mm:ss').subtract(2, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(2, 'day').unix()}`,
              state: 'pending',
              status_id: +this.filter.status_id
            }
          },
          title: 'The day before yesterday',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(2, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(2, 'day').unix()}`
        },
        {
          badge: {
            color: 'grey'
          },
          count: 0,
          params: () => {
            return {
              planned_for: 'all',
              state: 'all',
              status_id: +this.filter.status_id
            }
          },
          title: 'All tasks',
          value: 'all'
        }
      ],

      tasksLoading: false,

      /**
       * Параметры которые будут добавлены в фильтр
       * @param params
       */
      update: debounce((params = {}) => {
        let offset = this.task_paginator.per_page_count * this.task_paginator.page - this.task_paginator.per_page_count
        if (offset < 0) {
          offset = 0
        }

        const newParams: any = Object.assign({}, {
          count: this.task_paginator.per_page_count,
          offset
        }, this.params, params)

        // Поиск по тексту
        if (this.$route.query[this.prefix('q')]) {
          newParams.q = this.$route.query[this.prefix('q')]
        }

        if (this.$route.query[this.prefix('sort')]) {
          newParams.sort = this.$route.query[this.prefix('sort')]
        }

        // Статус контакта
        if (this.$route.query[this.prefix('status_id')]) {
          newParams.status_id = this.$route.query[this.prefix('status_id')]
        }

        // Статус Задачи
        if (this.$route.query[this.prefix('state')]) {
          newParams.state = this.$route.query[this.prefix('state')]
        }

        // Статус контакта
        if (this.$route.query[this.prefix('planned_for')]) {
          newParams.planned_for = this.$route.query[this.prefix('planned_for')]
        }

        new Tasks()
          .find<any, TaskInterface[]>(newParams)
          .then((response) => {
            this.task_count = response.meta?.count
            this.task_paginator.pages = Math.ceil(response.meta?.count / this.task_paginator.per_page_count)
            this.task_items = response.data
          })
      })
    }
  },

  computed: {

    filterSelectedStatus () {
      return this.statuses.find((e: StatusInterface) => e.id === this.filter.status_id)
    },

    filtersStyleComputed () {
      return {
        'min-width': '200px'
      }
    },

    isVisibleDivider () {
      return this.task_items.length > 1
    },

    itemActions () {
      return [
        {
          attrs: {},
          click: (item: TaskInterface) => {
            item.state = 'done'
            new Tasks()
              .setState(item.id, 'done')
              .then(() => {
                this.$store.dispatch('tasks/pending_count')
              })
          },
          title: this.$tc('Close')
        },
        {
          attrs: {},
          click: this.onTaskItemEditClick,
          title: this.$tc('Edit')
        }
      ]
    },

    statuses () {
      let statuses: any[] = []
      statuses = statuses.concat(
        [{
          id: 0,
          name: this.$tc('All statuses')
        }],
        this.$store.getters['database/statuses_not_grouped'] as StatusInterface[]
      )
      return statuses
    }
  },

  created () {
    this.update()
  },

  mounted () {
    this.initializeFiltersFromQuery()
    this.initializeWatchFilters()
    this.fetchCount()
  },

  methods: {

    /**
     * Получить количество по фильтрам
     **/
    async fetchCount () {
      if (this.filtersEnabled) {
        const task = new Tasks()
        for (let i = 0; i < this.btnToggles.length; i++) {
          await task.count(Object.assign({}, this.btnToggles[i].params()))
            .then((value) => {
              this.btnToggles[i].count = value.data.count
            })
          await sleep(100)
        }
      }
    },

    /**
     * После перезагрузки страницы восстановит параметры фильтров из адресной строки браузера
     */
    initializeFiltersFromQuery () {
      if (this.$route.query[this.prefix('planned_for')]) {
        this.filter.planned_for = this.$route.query[this.prefix('planned_for')]
      }

      if (this.$route.query[this.prefix('q')]) {
        this.filter.q = this.$route.query[this.prefix('q')]
      }

      if (this.$route.query[this.prefix('status_id')]) {
        this.filter.status_id = +this.$route.query[this.prefix('status_id')]
      }

      if (this.$route.query[this.prefix('state')]) {
        this.filter.state = this.$route.query[this.prefix('state')]
      }

      if (this.$route.query[this.prefix('page')]) {
        this.task_paginator.page = +this.$route.query[this.prefix('page')]
      }
    },

    /**
     *
     * @param debounceDelay
     */
    initializeWatchFilters (debounceDelay = 200) {
      // Запланировано на
      this.$watch('filter.planned_for', debounce((val: string | string[]) => {
        // Устанавливаю первую страницу
        this.task_paginator.page = 1
        if (val) {
          this.$routerQuery.setQuery({
            [this.prefix('planned_for')]: val
          }).then(() => {
            if (val === 'all') {
              this.update({
                state: 'all'
              })
            } else {
              this.update()
            }
          })
        } else {
          this.$routerQuery.removeQuery([
            this.prefix('planned_for')
          ]).then(() => {
            this.update()
          })
        }
      }, debounceDelay))

      // Поиск по тексту
      this.$watch('filter.q', debounce((val: string) => {
        if (val) {
          this.$routerQuery.setQuery({
            [this.prefix('q')]: val
          }).then(() => {
            this.update()
          })
        } else {
          this.$routerQuery.removeQuery([
            this.prefix('q')
          ]).then(() => {
            this.update()
          })
        }
      }, debounceDelay))

      // Поиск по статусу
      this.$watch('filter.status_id', debounce((val: string) => {
        if (val) {
          this.$routerQuery.setQuery({
            [this.prefix('status_id')]: val
          }).then(() => {
            this.update()
            this.fetchCount()
          })
        } else {
          this.$routerQuery.removeQuery([
            this.prefix('status_id')
          ]).then(() => {
            this.update()
            this.fetchCount()
          })
        }
      }, debounceDelay))

      // Поиск по состоянию.
      this.$watch('filter.state', debounce((val: string) => {
        if (val) {
          this.$routerQuery.setQuery({
            [this.prefix('state')]: val
          }).then(() => {
            this.update()
          })
        } else {
          this.$routerQuery.removeQuery([
            this.prefix('state')
          ]).then(() => {
            this.update()
          })
        }
      }, debounceDelay))

      // Пагинатор
      this.$watch('task_paginator.page', debounce((val: number) => {
        if (val) {
          this.$routerQuery.setQuery({
            [this.prefix('page')]: val
          }).then(() => {
            this.update()
          })
        } else {
          this.$routerQuery.removeQuery([
            this.prefix('page')
          ]).then(() => {
            this.update()
          })
        }
      }, debounceDelay))
    },

    lastContactStatus (contact: ContactInterface) {
      if (contact) {
        if (contact.last_status) {
          return {
            class: '',
            color: contact.last_status.color,
            name: contact.last_status.name
          }
        }
      }
      return {
        class: 'label-outlined label-color-grey',
        color: '',
        name: this.$tc('Status not set')
      }
    },

    onClearDateRangeClick () {
      this.menuDateRange = false
      this.$routerQuery.removeQuery(['planned_for']).finally(() => (this.update()))
    },

    onItemSelectedStatus (item: StatusInterface) {
      this.$toast.info(item.name)
    },

    /**
     * Происходит когда выбрали временной диапазон и нажали кнопку сохранить
     * @param dateRange
     */
    onSaveDateRangeClick (dateRange: string[]) {
      this.$refs.menuDateRange.save(dateRange)
      const date1 = new Date(dateRange[0])
      const date2 = new Date(dateRange[1])

      let dr = ''
      if (date1.getTime() < date2.getTime()) {
        dr = `${date1.getTime() / 1000},${date2.getTime() / 1000}`
      } else {
        dr = `${date2.getTime() / 1000},${date1.getTime() / 1000}`
      }

      this.filter.planned_for = dr
      this.$routerQuery.setQuery({
        [this.prefix('planned_for')]: dr
      }).then(() => {
        this.update()
      })
    },

    /**
     * Происходит когда нажали на кнопу Done | Выполнить
     * @param taskId
     */
    onTaskItemActionTaskDoneClick (taskId: number) {
      new Tasks()
        .setState(taskId, 'done')
        .then(() => {
          const taskIndex = this.task_items.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.task_items[taskIndex].state = 'done'
            this.$store.dispatch('tasks/pending_count')
            this.fetchCount()

            setTimeout(() => {
              const taskIndex = this.task_items.findIndex((e: TaskInterface) => e.id === taskId && e.state === 'done')
              if (taskIndex > -1) {
                this.task_items.splice(taskIndex, 1)
              }

              if (this.task_items.length === 0) {
                this.update()
              }
            }, 3000)
          }
        })
    },

    onTaskItemActionTaskUndoDoneClick (taskId: number) {
      new Tasks()
        .setState(taskId, 'pending')
        .then(() => {
          const taskIndex = this.task_items.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.task_items[taskIndex].state = 'pending'
            this.$store.dispatch('tasks/pending_count')
            this.fetchCount()
          }
        })
    },

    onTaskItemClick (item: TaskInterface) {
      if (item.contact) {
        // Сохранить $route.fullPath что бы потом вернуться.
        this.$store.commit('system/route_last_full_path', this.$route.fullPath)
        this.$router.push({
          name: 'contacts_view',
          params: { contact_id: item.contact.id } as any
        })
      }
    },

    onTaskItemDeleteClick (id: number) {
      this.$dialog.confirm({
        actions: {
          false: {
            color: 'red',
            flat: true,
            outlined: true,
            text: this.$tc('no'),
            tile: true
          },
          true: {
            handle: () => {
              return new Promise<void>((resolve) => {
                new Tasks()
                  .delete(id)
                  .then(() => {
                    this.$toast.success(this.$tc('Task successfully deleted'))
                    // TODO: TASKS FETCH DATA
                  }).catch((e: APIError) => {
                    this.$toast.error(e.message)
                  })
                resolve()
              })
            },
            text: this.$tc('yes')
          }
        },
        text: this.$tc('All information about the task, the history of interaction will be deleted permanently.'),
        title: this.$tc('Deleting task')
      })
    },

    onTaskItemEditClick (item: TaskInterface) {
      new Tasks()
        .getById(item.id)
        .then((response) => {
          this.$dialog.show(STaskDialogEditor, {
            contactId: response.contact?.id,
            // Передайте дату и время в формате Unixtime
            description: response.description,

            onSave: (data: DTaskInterface) => {
              // Новые данные задачи
              const taskData: any = {
                contact_id: response.contact?.id,
                description: data.description,
                performer_id: data.performer_id,
                planned_for: data.planned_for,
                type: data.type
              }

              new Tasks()
                .edit(item.id, taskData)
                .then(() => {
                  this.$toast.success(this.$tc('Task successfully updated'))
                  this.update()
                })
                .catch((e: APIError) => {
                  let text = ''
                  if (this.assertObjectHasAttribute(e, 'errors')) {
                    text = e.errors.map(e => e.message).join('\n')
                  }
                  this.$toast.error(`${e.message}\n${text}`)
                })
            },

            performerId: response.performer.id,

            persistent: true,

            plannedFor: response.planned_for,

            // Передайте описание задачи
            responsibleDisabled: true,

            type: response.type,

            waitForResult: true,

            width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%'
          })
        })
    },

    prefix (name: string) {
      return this.paramPrefix + name
    },

    vListItemStyleComputed (item: TaskInterface) {
      const style: any = {}

      if (item.state === 'done') {
        style.opacity = 0.5
      }

      return style
    }
  }
})
</script>

<style lang="scss" scoped>

.v-btn--example {
  bottom: 0;
  position: relative !important;
  margin: 0 0 16px 16px;
}
</style>
