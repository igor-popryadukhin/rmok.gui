<template>
  <v-card
    :outlined="outlined"
    class="px-0"
    flat
    tile
  >
    <v-app-bar
      color="white"
      flat
      tile
    >
      <template v-if="filtersEnabled">
        <v-btn-toggle
          v-model="filter.planned_for"
          group
          dense
        >
          <template v-for="item in btnToggles">
            <v-btn
              :key="item.value"
              :value="item.value"
            >
              {{ $tc(item.title) }}
              <v-badge
                v-if="item.count > 0"
                :content="item.count"
                v-bind="item.badge"
                inline
              />
            </v-btn>
          </template>

          <v-menu
            ref="menuDateRange"
            v-model="menuDateRange"
            :close-on-content-click="false"
            :return-value.sync="filter.planned_for"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :class="/^\d+,\d+/s.test($routerQuery.getQuery('planned_for')) ? 'v-btn--active' : ''"
                :value="null"
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
          v-model="filter.status"
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
      <template v-if="toolsEnabled">
        <v-btn
          color="primary"
          tile
          text
          @click="onTaskAddClick"
        >{{ $tc('Add') }}</v-btn>
      </template>

    </v-app-bar>

    <v-card-text class="py-0" :class="outlined ? '' : 'px-0'">
      <template v-if="tasks.length === 0 && tasksLoading  === true">
        <div
          class="d-flex align-center justify-center"
        >
          <div class="grey--text">{{ $tc('Loading content...') }}</div>
        </div>
      </template>
      <template v-if="tasks.items.length === 0 && tasksLoading  === false">
        <div
          class="d-flex flex-wrap align-center justify-center"
          style="height: 400px"
        >
          <div class="grey--text">
            {{ $tc('Task list is empty') }}
          </div>
        </div>
      </template>
      <template v-if="tasks.items.length > 0">
        <v-list>
          <template v-for="(taskItem, taskIndex) in tasks.items">
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
      <div v-if="tasks.pages > 1" >
        <v-pagination
          v-model="tasks.page"
          :length="tasks.pages"
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
import { mapGetters } from 'vuex'

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

    outlined: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      menuDateRange: false,
      dateRange: null as string[] | null,
      tabsCurrentItem: 0,
      // --------------------
      tasksLoading: false,
      tasks: {
        per_page: 10, // Количество на страницу
        page: 1, // Текущая страница
        pages: 0, // Всего страниц, зависит от per_page
        count: 0, // Всего записей
        items: [] as unknown & TaskInterface[] // Элементы задач
      },
      // Фильтры
      filter: {
        status: 0,
        planned_for: null,
        q: null as null | string
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
              status_id: +this.$route.query.status_id || 0
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
              status_id: +this.$route.query.status_id || 0
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
              status_id: +this.$route.query.status_id || 0
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
              status_id: +this.$route.query.status_id || 0
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
              status_id: +this.$route.query.status_id || 0
            }
          }
        }
      ]
    }
  },

  computed: {
    ...mapGetters({
      task_pending_count: 'tasks/pending_count'
    }),

    isVisibleDivider () {
      return this.tasks.items.length > 1
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
      this.$store.dispatch('database/fetchStatuses')
      this.fetchCount()
    }
  },

  mounted () {
    // поместите любое обещание, для того что бы подождать, прежде чем начнётся загрузка данных для графика
    const promises: Promise<any>[] = []

    // Статус контакта
    if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
      this.filter.status = +this.$route.query.status_id
    }

    // Статус контакта
    if (this.assertObjectHasAttribute(this.$route.query, 'planned_for')) {
      this.filter.planned_for = this.$route.query.planned_for
    }

    if (this.$routerQuery.hasQuery('q')) {
      this.filter.q = this.$route.query.q
    }

    if (this.$routerQuery.hasQuery('sort')) {
      this.sort.select = this.$route.query.sort
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(async () => {
        await this.fetchTasks()
        this.initializeWatchFilters()
      })
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

      this.$routerQuery.setQuery({ planned_for: dr }).finally(() => (this.fetchTasks()))
    },

    onClearDateRangeClick () {
      this.menuDateRange = false
      this.$routerQuery.removeQuery(['planned_for']).finally(() => (this.fetchTasks()))
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
          name: 'operator_contacts_view_script',
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
          const taskIndex = this.tasks.items.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.tasks.items[taskIndex].state = 'done'
            this.$store.dispatch('tasks/pending_count')
            this.fetchCount()

            setTimeout(() => {
              const taskIndex = this.tasks.items.findIndex((e: TaskInterface) => e.id === taskId && e.state === 'done')
              if (taskIndex > -1) {
                this.tasks.items.splice(taskIndex, 1)
              }

              if (this.tasks.items.length === 0) {
                this.fetchTasks()
              }
            }, 3000)
          }
        })
    },

    onTaskItemActionTaskUndoDoneClick (taskId: number) {
      new Tasks()
        .setState(taskId, 'pending')
        .then(() => {
          const taskIndex = this.tasks.items.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.tasks.items[taskIndex].state = 'pending'
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
                  this.fetchTasks()
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

    onTaskAddClick () {
      this.$dialog.show(STaskDialogEditor, {
        waitForResult: true,
        width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
        persistent: true,
        performerId: this.$store.getters['profile/id'],
        responsibleDisabled: true,
        onSave: (data: DTaskInterface) => {
          const taskData: any = {
            performer_id: data.performer_id,
            description: data.description,
            planned_for: data.planned_for,
            type: data.type,
            contact_id: +this.$route.params.contact_id
          }

          new Tasks()
            .add<number>(taskData)
            .then(() => {
              this.$toast.success(this.$tc('Task successfully created'))
              this.fetchTasks()
              this.fetchCount()
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
    },

    fetchTasks (params = {}) {
      return new Promise<void>((resolve, reject) => {
        this.tasksLoading = true

        const offset = this.tasks.per_page * this.tasks.page - this.tasks.per_page

        const newParams: any = Object.assign({
          count: this.tasks.per_page,
          offset
        }, params)

        // Поиск по тексту
        if (this.assertObjectHasAttribute(this.$route.query, 'q')) {
          newParams.q = this.$route.query.q
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'sort')) {
          newParams.sort = this.$route.query.sort
        }

        // Статус контакта
        if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
          newParams.status_id = this.$route.query.status_id
        }

        // Статус Задачи
        if (this.assertObjectHasAttribute(this.$route.query, 'state')) {
          newParams.state = this.$route.query.state
        }

        // Статус контакта
        if (this.assertObjectHasAttribute(this.$route.query, 'planned_for')) {
          newParams.planned_for = this.$route.query.planned_for
        }

        new Tasks()
          .find<{ count: number; }, TaskInterface[]>(Object.assign({}, this.$props.params, newParams))
          .then((response) => {
            resolve()
            this.tasks.count = response.meta.count
            this.tasks.pages = Math.ceil(response.meta.count / this.tasks.per_page)
            this.tasks.items = response.data as TaskInterface[]

            this.$emit('loaded-data', response)
          }).finally(() => {
            this.tasksLoading = false
          }).catch(reject)
      })
    },

    async fetchCount () {
      const task = new Tasks()
      for (let i = 0; i < this.btnToggles.length; i++) {
        await task.count(this.btnToggles[i].params())
          .then((value) => {
            this.btnToggles[i].count = value.data.count
          })
        await sleep(100)
      }
    },

    initializeWatchFilters () {
      const debounceDelay = 250 // Задержка выполнения загрузки данных (избавит от дребезга)

      // Сортировка
      this.$watch('filter.status', debounce((value: number) => {
        if (value) {
          this.$routerQuery.setQuery({
            status_id: value
          }).finally(() => {
            this.fetchTasks()
            this.fetchCount()
          })
        } else {
          this.$routerQuery
            .removeQuery(['status_id'])
            .finally(() => {
              this.fetchTasks()
              this.fetchCount()
            })
        }
      }, debounceDelay))

      // Поиск по тексту
      this.$watch('filter.q', debounce((value: string) => {
        this.tasks.page = 1 // Установить первую страницу, если поиск по тексту
        if (value) {
          this.$routerQuery.setQuery({
            q: value
          }).finally(() => {
            this.fetchTasks()
          })
        } else {
          this.$routerQuery
            .removeQuery(['q'])
            .finally(() => {
              this.fetchTasks()
            })
        }
      }, debounceDelay))

      this.$watch('tasks.page', debounce((page: number) => {
        if (page) {
          this.$routerQuery.setQuery({
            page
          }).finally(() => {
            this.fetchTasks()
          })
        } else {
          this.$routerQuery
            .removeQuery(['page'])
            .finally(() => {
              this.fetchTasks()
            })
        }
      }, debounceDelay))

      // Фильтрация по датам
      this.$watch('filter.planned_for', debounce(async (newVal: unknown & string) => {
        // Удалить пагинацию.
        this.tasks.page = 1
        // Удалить статус задачи.
        if (this.$routerQuery.hasQuery('state')) {
          await this.$routerQuery.removeQuery(['state'])
        }
        switch (newVal) {
          case 'today': {
            this.$routerQuery.setQuery({ planned_for: 'today' }).finally(this.fetchTasks)
            break
          }
          case 'yesterday': {
            this.$routerQuery.setQuery({ planned_for: 'yesterday' }).finally(this.fetchTasks)
            break
          }
          case 'tomorrow': {
            this.$routerQuery.setQuery({ planned_for: 'tomorrow' }).finally(this.fetchTasks)
            break
          }
          case 'the_day_before_yesterday': {
            this.$routerQuery.setQuery({ planned_for: 'the_day_before_yesterday' }).finally(this.fetchTasks)
            break
          }
          case 'all': {
            this.$routerQuery.setQuery({
              planned_for: 'all',
              state: 'pending'
            }).finally(this.fetchTasks)
            break
          }
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
