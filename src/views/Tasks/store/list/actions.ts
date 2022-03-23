import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { TasksListState } from './state'

const actions: ActionTree<TasksListState, RootState> = {
  fetch: ({ commit, getters }, append = false) => {
    return new Promise<void>((resolve) => {

      if (append) {
        commit('filter/filter_offset', getters['filter/filter_offset'] + 30)
      } else {
        commit('filter/filter_offset', 0)
      }

      const query: Record<string, Record<string, unknown>> = getters['filter/all']
      commit('items_fetching', true)

      $axios.get('/tasks', {
        params: query
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          if (append) {
            const newItems = response.data?.data as Array<Record<'id', number>>
            const oldItems = getters['items'] as Array<Record<'id', number>>
            const xxItems = []
            newItems.map((e) => (Object.assign({}, {...e})))
              .forEach((e) => {
                if (oldItems.findIndex((value) => value.id === e.id) === -1) {
                  xxItems.push(e)
                }
              })
            commit('items_total', response.data?.meta?.count || 0)
            commit('items', oldItems.concat(xxItems))
          } else {
            commit('items_total', response.data?.meta?.count || 0)
            commit('items', response.data?.data || [])
          }
          resolve()
        }
      }).finally(() => (commit('items_fetching', false)))
    })
  }
}

export default actions
