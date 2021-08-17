import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import Notifications from '@/api/Notifications'
import Notification from '@/api/interfaces/Notification'
import { debounce } from 'vuetify/src/util/helpers'

const actions: ActionTree<State, RootState> = {
  /**
   * Загрузит список системных уведомлений.
   *
   * @param commit
   * @param payload
   */
  notifications: ({ commit }: ActionContext<State, RootState>, payload = null) => {
    return new Promise<void>((resolve) => {
      return new Notifications()
        .get()
        .then((response) => {
          commit('notifications_count', response.meta?.count)
          commit('notifications', response.data)
        }).finally(() => (resolve()))
    })
  },

  notifications_close ({ commit, state }, id: number) {
    const notifications = state.notifications.map((e) => e)
    const index = notifications.findIndex((e: Notification) => e.id === id)
    if (index > -1) {
      const notifications_count = state.notifications_count
      commit('notifications_count', notifications_count - 1)

      notifications.splice(index, 1)
      commit('notifications', notifications)

      return new Notifications().close(id)
    }
  },

  /**
   * Закроет все открытые системные уведомления.
   *
   * @param commit
   * @param state
   * @param id
   */
  notifications_close_all ({ commit, state }) {
    const notifications = state.notifications.map((e) => e)
    const index = notifications.findIndex((e: Notification) => e.id === 0)
    if (index > -1) {
      const notifications_count = state.notifications_count
      commit('notifications_count', notifications_count - 1)

      notifications.splice(index, 1)
      commit('notifications', notifications)

      // return new Notifications().close()
    }
  }
}

export default actions
