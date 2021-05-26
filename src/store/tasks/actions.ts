import Tasks, { TaskInterface } from '@/api/Tasks'
import { RootStateInterface } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { TasksStateInterface } from './state'

const actions: ActionTree<TasksStateInterface, RootStateInterface> = {

  /**
   *
   * @param ctx
   * @param payload
   */
  async items (ctx: ActionContext<TasksStateInterface, RootStateInterface>, payload = null) {
    return new Promise<void>((resolve, reject) => {
      if (payload) {
        // Установить параметры, это позволит сохранить параметры последней загрузки
        ctx.commit('filter', Object.assign(ctx.state.filter, payload))
      }

      const offset = ctx.state.options.per_page * ctx.state.options.page - ctx.state.options.per_page

      const newParams: any = {
        count: ctx.state.options.per_page,
        offset
      }

      // Поиск по тексту
      if (ctx.state.filter.contact_id) {
        newParams.contact_id = ctx.state.filter.contact_id
      }

      // Поиск по тексту
      if (ctx.state.filter.q) {
        newParams.q = ctx.state.filter.q
      }

      if (ctx.state.filter.sort) {
        newParams.sort = ctx.state.filter.sort
      }

      // Статус контакта
      if (ctx.state.filter.status_id) {
        newParams.status_id = ctx.state.filter.status_id
      }

      // Статус Задачи
      if (ctx.state.filter.state) {
        newParams.state = ctx.state.filter.state
      }

      // Статус контакта
      if (ctx.state.filter.planned_for) {
        newParams.planned_for = ctx.state.filter.planned_for
      }

      new Tasks()
        .find<any, TaskInterface[]>(newParams)
        .then((response) => {
          ctx.commit('options_count', response.meta?.count)
          ctx.commit('options_pages', Math.ceil(response.meta?.count / ctx.state.options.per_page))
          ctx.commit('items', response.data)

          resolve()
        }).catch(reject)
    })
  },

  /**
   *
   * @param ctx
   */
  async pending_count (ctx: ActionContext<TasksStateInterface, RootStateInterface>) {
    return new Promise<void>((resolve) => {
      new Tasks()
        .count({ state: 'pending' })
        .then((response) => {
          ctx.commit('pending_count', response.data.count)
          resolve()
        })
    })
  },

  /**
   * Сбросить параметры запроса
   * @param commit
   */
  reset_filter (ctx: ActionContext<TasksStateInterface, RootStateInterface>) {
    ctx.commit('filter', {
      contact_id: 0,
      planned_for: 'all',
      q: null,
      sort: null,
      state: 'all',
      status_id: 0
    })
  },

  /**
   *
   * @param state
   * @param commit
   * @param payload
   */
  async sort (ctx: ActionContext<TasksStateInterface, RootStateInterface>) {
    return new Promise<void>((resolve) => {
      ctx.commit('items', ctx.state.items.sort((a: TaskInterface, b: TaskInterface) => {
        if (a.state === b.state) {
          return -1
        } else {
          return 0
        }
      }))
      resolve()
    })
  }

}

export default actions
