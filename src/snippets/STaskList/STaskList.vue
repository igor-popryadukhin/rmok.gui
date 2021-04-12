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
      <template>
        <v-btn-toggle
          v-model="filter.planned_for"
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
            ref="menuDateRange"
            v-model="menuDateRange"
            :close-on-content-click="false"
            :return-value.sync="filter.date_range"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="/^\d+,\d+/s.test(String($route.query[prefix('planned_for')])) ? 'v-btn--active' : ''"
                :value="null"
                :x-small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                :small="['md'].includes($vuetify.breakpoint.name)"
              >
                <v-icon>mdi-calendar-month-outline</v-icon>
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
              <v-spacer></v-spacer>
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
        <v-select
          v-model="filter.status_id"
          v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name)"
          :items="statuses"
          :label="$tc('Status')"
          style="max-width: 250px; min-width: 250px"
          item-text="name"
          item-value="id"
          hide-details
          outlined
          dense
        >
        </v-select>
      </template>
      <v-spacer />
    </v-app-bar>

    <v-card-text class="py-0" :class="outlined ? '' : 'px-0'">
      <template v-if="task_items.length === 0 && tasksLoading  === true">
        <div
          class="d-flex align-center justify-center"
        >
          <div class="grey--text">{{ $tc('Loading content...') }}</div>
        </div>
      </template>
      <template v-if="task_items.length === 0 && tasksLoading  === false">
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
              type="list-item-three-line"
              :key="`v-skeleton-loader-${taskIndex}`"
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
                    v-if="taskItem.type === 'call'"
                    :style="{ color: taskItem.expired ? 'red' : '' }"
                  >
                    {{ `Позвонить ${$moment.unix(taskItem.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="taskItem.contact">
                    {{ taskItem.contact.last_name }} {{ taskItem.contact.first_name }} {{ taskItem.contact.middle_name }}
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
                  <template v-slot:activator="{ on, attrs }">
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
      <div v-if="task_paginator.pages > 1" >
        <v-pagination
          v-model="task_paginator.page"
          :length="task_paginator.pages"
          total-visible="10"
        ></v-pagination>
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
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

interface IProps {
  [key: string]: any;
}

interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

interface IMethod {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend<IData, IMethod, IComputed, IProps>({

  props: {
    /**
     * Дополнительные параметры передаваемые конечной точке (имеет наивысший приоритет)
     **/
    params: {
      type: Object,
      default () {
        return {}
      }
    },

    /**
     * Количество задач на страницу
     **/
    perPage: {
      type: Number,
      default: 10
    },

    /**
     * Включить фильтр
     **/
    filtersEnabled: {
      type: Boolean,
      default () {
        return false
      }
    },

    /**
     * Включить инструменты
     **/
    toolsEnabled: {
      type: Boolean,
      default () {
        return false
      }
    },

    paramPrefix: {
      type: String,
      default () {
        return 't_'
      }
    },

    outlined: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      menuDateRange: false,
      dateRange: null as string[] | null,
      // --------------------
      tasksLoading: false,
      task_items: [] as TaskInterface[],
      task_count: 0,
      task_paginator: {
        per_page_count: 25,
        page: 1,
        pages: 1
      },
      // Сортировка
      sort: {
        select: 'created_desc',
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
        ] as unknown[] & { title: string; value: string }
      },
      // Фильтр
      filter: {
        contact_id: 0,
        q: '',
        sort: '',
        status_id: 0,
        state: '',
        planned_for: null,
        date_range: null
      },

      btnToggles: [
        {
          title: 'For tomorrow',
          value: 'tomorrow',
          count: 0,
          badge: {
            color: 'red'
          },
          params: () => {
            return {
              planned_for: 'tomorrow',
              state: 'pending',
              status_id: +this.filter.status_id
            }
          }
        },
        {
          title: 'For today',
          value: 'today',
          count: 0,
          badge: {
            color: 'red'
          },
          params: () => {
            return {
              planned_for: 'today',
              state: 'pending',
              status_id: +this.filter.status_id
            }
          }
        },
        {
          title: 'Yesterday\'s',
          value: 'yesterday',
          count: 0,
          badge: {
            color: 'red'
          },
          params: () => {
            return {
              planned_for: 'yesterday',
              state: 'pending',
              status_id: +this.filter.status_id
            }
          }
        },
        {
          title: 'The day before yesterday',
          value: 'the_day_before_yesterday',
          count: 0,
          badge: {
            color: 'red'
          },
          params: () => {
            return {
              planned_for: 'the_day_before_yesterday',
              state: 'pending',
              status_id: +this.filter.status_id
            }
          }
        },
        {
          title: 'All',
          value: 'all',
          count: 0,
          badge: {
            color: 'grey'
          },
          params: () => {
            return {
              state: 'pending',
              status_id: +this.filter.status_id
            }
          }
        }
      ]
    }
  },

  computed: {

    isVisibleDivider () {
      return this.task_items.length > 1
    },

    statuses () {
      const statuses = this.$store.getters['database/statuses'] as StatusInterface[]
      statuses.unshift({
        id: 0,
        name: 'Все'
      })
      return statuses
    },

    filtersStyleComputed () {
      return {
        'min-width': '200px'
      }
    },

    itemActions () {
      return [
        {
          title: this.$tc('Close'),
          attrs: {},
          click: (item: TaskInterface) => {
            item.state = 'done'
            new Tasks()
              .setState(item.id, 'done')
              .then(() => {
                this.$store.dispatch('tasks/pending_count')
              })
          }
        },
        {
          title: this.$tc('Edit'),
          attrs: {},
          click: this.onTaskItemEditClick
        }
      ]
    }
  },

  created () {
    if (this.$props.filtersEnabled) {
      this.$store.dispatch('database/statuses', { group: 0 }) // group: 0 без группировки
    }

    this.update()
  },

  mounted () {
    this.initializeFiltersFromQuery()
    this.initializeWatchFilters()
    this.fetchCount()
  },

  methods: {
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

    onClearDateRangeClick () {
      this.menuDateRange = false
      this.$routerQuery.removeQuery(['planned_for']).finally(() => (this.update()))
    },

    lastContactStatus (contact: ContactInterface) {
      if (contact) {
        if (contact.last_status) {
          return {
            name: contact.last_status.name,
            class: '',
            color: contact.last_status.color
          }
        }
      }
      return {
        name: this.$tc('Status not set'),
        class: 'label-outlined label-color-grey',
        color: ''
      }
    },

    vListItemStyleComputed (item: TaskInterface) {
      const style: any = {}

      if (item.state === 'done') {
        style.opacity = 0.5
      }

      return style
    },

    onTaskItemClick (item: TaskInterface) {
      if (item.contact) {
        // Сохранить $route.fullPath что бы потом вернуться.
        this.$store.commit('system/route_last_full_path', this.$route.fullPath)
        this.$router.push({
          name: 'operator_contacts_view',
          params: { contact_id: item.contact.id } as any
        })
      }
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

    onTaskItemEditClick (item: TaskInterface) {
      new Tasks()
        .getById(item.id)
        .then((response) => {
          this.$dialog.show(STaskDialogEditor, {
            waitForResult: true,
            width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
            persistent: true,
            performerId: response.performer.id,
            contactId: response.contact?.id,
            type: response.type,
            plannedFor: response.planned_for, // Передайте дату и время в формате Unixtime
            description: response.description, // Передайте описание задачи
            responsibleDisabled: true,
            onSave: (data: DTaskInterface) => {
              // Новые данные задачи
              const taskData: any = {
                performer_id: data.performer_id,
                description: data.description,
                planned_for: data.planned_for,
                type: data.type,
                contact_id: response.contact?.id
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
            }
          })
        })
    },

    onTaskItemDeleteClick (id: number) {
      this.$dialog.confirm({
        title: this.$tc('Deleting task'),
        text: this.$tc('All information about the task, the history of interaction will be deleted permanently.'),
        actions: {
          false: {
            color: 'red',
            outlined: true,
            flat: true,
            tile: true,
            text: this.$tc('no')
          },
          true: {
            text: this.$tc('yes'),
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
            }
          }
        }
      })
    },

    /**
     * Параметры которые будут добавлены в фильтр
     * @param params
     */
    update (params = {}) {
      return new Promise<void>((resolve, reject) => {
        let offset = this.task_count * this.task_paginator.page - this.task_paginator.per_page_count
        if (offset < 0) {
          offset = 0
        }

        const newParams: any = Object.assign({}, {
          count: this.task_paginator.per_page_count,
          offset
        }, params, this.params)

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
            resolve()
          }).catch(reject)
      })
    },

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

    prefix (name: string) {
      return this.paramPrefix + name
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
    },

    /**
     *
     * @param debounceDelay
     */
    initializeWatchFilters (debounceDelay = 200) {
      // Запланировано на
      this.$watch('filter.planned_for', debounce((val: string | string[]) => {
        if (val) {
          // Зарезервированная константа даты
          switch (val) {
            case 'all':
            case 'the_day_before_yesterday':
            case 'yesterday':
            case 'tomorrow':
            case 'today': {
              this.$routerQuery.setQuery({
                [this.prefix('planned_for')]: val
              }).then(() => {
                this.update()
              })
              break
            }
          }
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
    }
  }
})
</script>

<style lang="scss" scoped>

   .v-btn--example {
     bottom: 0;
     position: relative!important;
     margin: 0 0 16px 16px;
   }
</style>
