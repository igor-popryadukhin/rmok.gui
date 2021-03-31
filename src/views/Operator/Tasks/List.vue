<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col
          class=""
        >
          <v-tabs
            v-model="tabsCurrentItem"
          >
            <v-tab
              v-for="(item, tabIndex) in tabs"
              :key="tabIndex"
            >
              {{ $tc(item.title) }}
              <v-badge
                v-if="item.count > 0"
                :content="item.count"
                inline
              ></v-badge>
            </v-tab>
          </v-tabs>
          <v-divider />
        </v-col>
      </v-row>

      <!-- Фильтры -->
      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-wrap justify-start"
        >
          <v-text-field
            v-model="filter.q"
            :style="filtersStyleComputed"
            style="max-width: 458px"
            class="mr-3 mb-3"
            clearable
            hide-details
            outlined
            dense
          >
            <template v-if="filter.q === null || filter.q === ''" v-slot:append>
              <v-icon>mdi-magnify</v-icon>
            </template>
          </v-text-field>
          <v-select
            v-model="sort.select"
            :items="sort.items"
            :style="filtersStyleComputed"
            style="max-width: 100px"
            class="mr-3 mb-3 ml-auto"
            item-text="title"
            item-value="value"
            hide-details
            outlined
            dense
          >
            <template v-slot:append>
              <v-icon>mdi-sort-ascending</v-icon>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- Задачи -->
      <v-row>
        <v-col
          class="py-0"
        >
          <v-tabs-items
            v-model="tabsCurrentItem"
          >
            <v-tab-item
              v-for="(item, tabIndex) in tabs"
              :key="tabIndex"
              :transition="false"
              :reverse-transition="false"
            >
              <template v-if="tasks.length === 0 && tasksLoading  === true">
                <div
                  class="d-flex align-center justify-center"
                >
                  <div class="grey--text">{{ $tc('Loading content...') }}</div>
                </div>
              </template>
              <template v-if="tasks.items.length === 0 && tasksLoading  === false">
                <div
                  class="d-flex align-center justify-center"
                >
                  <div class="grey--text">{{ $tc('Task list is empty') }}</div>
                </div>
              </template>
              <template v-if="tasks.items.length > 0">
                <v-list>
                  <template v-for="(task, taskIndex) in tasks.items">
                    <v-divider
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
                      :style="vListItemStyleComputed(task)"
                      link
                      exact
                      @click.stop="onTaskItemClick(task)"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-if="task.type === 'call'">
                          {{ `Позвонить ${$moment.unix(task.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}` }}
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="task.contact">
                          {{ task.contact.last_name }} {{ task.contact.first_name }} {{ task.contact.middle_name }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <span
                            class="label mr-2"
                            :style="{'background-color': lastContactStatus(task.contact).color }"
                            :class="lastContactStatus(task.contact).class"
                          >
                            {{ lastContactStatus(task.contact).name }}
                          </span> {{ task.description || '—' }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <template v-if="tabsCurrentValue === 'pending' && !tasksLoading">
                          <v-btn
                            v-if="task.state === 'pending'"
                            min-width="100"
                            tile
                            ripple
                            outlined
                            @click.stop="onTaskItemActionTaskDoneClick(task.id)"
                          >{{ $tc('Выполнить') }}</v-btn>
                          <v-btn
                            v-else-if="task.state === 'done'"
                            style="opacity: 1!important;"
                            min-width="100"
                            tile
                            ripple
                            outlined
                            @click.stop="onTaskItemActionTaskUndoDoneClick(task.id)"
                          >{{ $tc('Undo') }}</v-btn>
                        </template>
                        <template v-else-if="tabsCurrentValue === 'done' && !tasksLoading">
                          <v-btn
                            min-width="100"
                            tile
                            ripple
                            outlined
                            @click.stop="onTaskItemActionTaskUndoDoneClick(task.id)"
                          >{{ $tc('Undo') }}</v-btn>
                        </template>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>

      <v-row v-if="tasks.pages > 1">
        <v-col class="mb-10">
          <div class="text-center">
            <v-pagination
              v-model="tasks.page"
              :length="tasks.pages"
              total-visible="10"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import Tasks, { TaskInterface } from '@/api/Tasks'
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
  tabs: unknown & {title: string;count: number;value: any; attrs: any}[];
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

  data () {
    return {
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
        q: null as unknown & string
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
      }
    }
  },

  computed: {
    ...mapGetters({
      task_total_count: 'tasks/total_count',
      task_done_count: 'tasks/done_count',
      task_pending_count: 'tasks/pending_count'
    }),

    tabsCurrentValue () {
      return this.tabs[this.tabsCurrentItem].value
    },

    /**
     * Вкладки
     */
    tabs () {
      return [
        {
          title: 'Выполнить',
          count: this.task_pending_count,
          value: 'pending',
          attrs: {}
        },
        {
          title: 'Выполнено',
          count: this.task_done_count,
          value: 'done',
          attrs: {}
        },
        {
          title: 'Все',
          count: this.task_total_count,
          value: 'all',
          attrs: {}
        }
      ]
    },

    filtersStyleComputed () {
      return {
        'min-width': '200px'
      }
    }

  },

  mounted () {
    // поместите любое обещание, для того что бы подождать, прежде чем начнётся загрузка данных для графика
    const promises: Promise<any>[] = []

    if (this.$routerQuery.hasQuery('tab')) {
      this.tabsCurrentItem = Number(this.$route.query.tab)
    }

    if (this.$routerQuery.hasQuery('page')) {
      this.tasks.page = Number(this.$route.query.page)
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

    vListItemStyleComputed (task: TaskInterface) {
      const style: any = {}

      if (this.tabsCurrentValue === 'pending') {
        if (task.state === 'done') {
          style.opacity = 0.5
        }
      }

      return style
    },

    onTaskItemClick (item: TaskInterface) {
      if (item.contact) {
        this.$router.push({
          name: 'operator_contacts_view_tasks',
          params: { contact_id: item.contact.id } as any,
          query: { task_id: String(item.id) }
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
            this.$root.$emit('root-tasks-fetch-count')
            // TODO: TASKS FETCH DATA

            setTimeout(() => {
              const taskIndex = this.tasks.items.findIndex((e: TaskInterface) => e.id === taskId && e.state === 'done')
              if (taskIndex > -1) {
                this.tasks.items.splice(taskIndex, 1)
              }

              if (this.tasks.items.length === 0) {
                this.fetchTasks()
              }
            }, 5000)
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
            this.$root.$emit('root-tasks-fetch-count')
            // TODO: TASKS FETCH DATA
          }
        })
    },

    onTaskItemEditClick (id: number) {
      new Tasks()
        .getById(id)
        .then((response) => {
          const plannedFor = new Date(response.planned_for * 1000)
          // this.$dialog.show(STaskDialogEditor, {
          //   waitForResult: true,
          //   width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
          //   persistent: true,
          //   performerId: response.performer.id,
          //   contactId: response.contact?.id,
          //   type: response.type,
          //   date: plannedFor.toISOString().substr(0, 10),
          //   time: plannedFor.toTimeString().substr(0, 5),
          //   description: response.description,
          //   responsibleDisabled: true,
          //   onSave: (data: any) => {
          //     const taskData: any = {
          //       performer_id: data.performer_id,
          //       description: data.description,
          //       planned_for: Date.parse(`${data.date} ${data.time}`) / 1000,
          //       type: data.type,
          //       contact_id: response.contact?.id
          //     }
          //
          //     new Tasks()
          //       .edit(id, taskData)
          //       .then(() => {
          //         this.$toast.success(this.$tc('Task successfully updated'))
          //       })
          //       .catch((e: APIError) => {
          //         let text = ''
          //         if (this.assertObjectHasAttribute(e, 'errors')) {
          //           text = e.errors.map(e => e.message).join('\n')
          //         }
          //         this.$toast.error(`${e.message}\n${text}`)
          //       })
          //       .finally(() => {
          //         // TODO: TASKS FETCH DATA // Генерирую глобальное событие, для обновления уведомлений
          //       })
          //   }
          // })
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
      // this.$dialog.show(STaskDialogEditor, {
      //   waitForResult: true,
      //   width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
      //   persistent: true,
      //   performerId: this.$store.getters['profile/id'],
      //   responsibleDisabled: true,
      //   onSave: (data: any) => {
      //     const taskData: any = {
      //       performer_id: data.performer_id,
      //       description: data.description,
      //       planned_for: Date.parse(`${data.date} ${data.time}`) / 1000,
      //       type: data.type,
      //       contact_id: +this.$route.params.contact_id
      //     }
      //
      //     new Tasks()
      //       .add<number>(taskData)
      //       .then(() => {
      //         this.$toast.success(this.$tc('Task successfully created'))
      //       })
      //       .catch((e: APIError) => {
      //         let text = ''
      //         if (this.assertObjectHasAttribute(e, 'errors')) {
      //           text = e.errors.map(e => e.message).join('\n')
      //         }
      //         this.$toast.error(`${e.message}\n${text}`)
      //       })
      //       .finally(() => {
      //         // TODO: TASKS FETCH DATA // Генерирую глобальное событие, для обновления уведомлений
      //       })
      //   }
      // })
    },

    fetchTasks (params = {}) {
      return new Promise<void>((resolve, reject) => {
        this.tasksLoading = true

        const offset = this.tasks.per_page * this.tasks.page - this.tasks.per_page

        const newParams: any = Object.assign({
          state: 'pending',
          count: this.tasks.per_page,
          offset
        }, params)

        if (this.assertObjectHasAttribute(this.$route.query, 'tab')) {
          newParams.state = this.tabs[Number(this.$route.query.tab)].value
        }

        // Поиск по тексту
        if (this.assertObjectHasAttribute(this.$route.query, 'q')) {
          newParams.q = this.$route.query.q
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'sort')) {
          newParams.sort = this.$route.query.sort
        }

        new Tasks()
          .find<{ count: number; }, TaskInterface[]>(newParams)
          .then((response) => {
            resolve()
            this.tasks.count = response.meta.count
            this.tasks.pages = Math.ceil(response.meta.count / this.tasks.per_page)
            this.tasks.items = response.data as TaskInterface[]

            // if (((Math.ceil(this.tasks.page * this.tasks.per_page) / this.tasks.per_page)) > this.tasks.pages) {
            //   this.tasks.page = 1
            // }
          }).finally(() => {
            this.tasksLoading = false
          }).catch(reject)
      })
    },

    initializeWatchFilters () {
      const debounceDelay = 500 // Задержка выполнения загрузки данных (избавит от дребезга)

      // Сортировка
      this.$watch('sort.select', debounce((value: string) => {
        if (value) {
          this.$routerQuery.setQuery({
            sort: value
          }).finally(() => {
            this.fetchTasks()
          })
        } else {
          this.$routerQuery
            .removeQuery(['sort'])
            .finally(() => {
              this.fetchTasks()
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

      this.$watch('tabsCurrentItem', debounce((newVal: unknown) => {
        this.tasks.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            tab: newVal
          }).finally(() => {
            this.fetchTasks()
          })
        } else {
          this.$routerQuery
            .removeQuery(['tab'])
            .finally(() => {
              this.fetchTasks()
            })
        }
      }, debounceDelay))
    }
  }
})
</script>

<style lang="scss" scoped>
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
