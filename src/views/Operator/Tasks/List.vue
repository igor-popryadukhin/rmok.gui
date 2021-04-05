<template>
  <s-task-list
    filters-enabled
    outlined
  >
    <template v-slot:item="{ item }">
      <v-list-item-title
        v-if="item.type === 'call'"
        :style="{ color: item.expired ? 'red' : '' }"
      >
        {{ `Позвонить ${$moment.unix(item.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}` }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="item.contact">
        {{ item.contact.last_name }} {{ item.contact.first_name }} {{ item.contact.middle_name }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
                        <span
                          class="label mr-2"
                          :style="{'background-color': lastContactStatus(item.contact).color }"
                          :class="lastContactStatus(item.contact).class"
                        >
                            {{ lastContactStatus(item.contact).name }}
                          </span> {{ item.description || '—' }}
      </v-list-item-subtitle>
    </template>
  </s-task-list>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { StatusInterface } from '@/api/Database'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import Tasks, { TaskInterface } from '@/api/Tasks'
import STaskDialogEditor, { DTaskInterface } from '@/snippets/STaskList/STaskDialogEditor.vue'
import STaskList from '@/snippets/STaskList/STaskList.vue'
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
  components: { STaskList },

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

    statuses () {
      const statuses = this.$store.getters['database/statuses'] as StatusInterface[]
      statuses.unshift({
        id: 0,
        name: 'Все'
      })
      return statuses
    },

    tabsCurrentValue () {
      return this.tabs[this.tabsCurrentItem].value
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
          click: (item: TaskInterface) => {
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
          }
        }
      ]
    },

    filtersStyleComputed () {
      return {
        'min-width': '200px'
      }
    }

  },

  created () {
    this.$store.dispatch('database/fetchStatuses')
    this.fetchCount()
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
        // Сохранить $route.fullPath что бы потом вернуться.
        this.$store.commit('system/route_last_full_path', this.$route.fullPath)
        this.$router.push({
          name: 'operator_contacts_view_tasks',
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
            this.$store.dispatch('tasks/pending_count')
            this.fetchCount()
          }
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
