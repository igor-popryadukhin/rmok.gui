import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

const actions: ActionTree<State, RootState> = {
  /**
   *
   * @param commit
   * @param payload
   */
  fetchPermissions: ({ commit }: ActionContext<State, RootState>) => {
    $axios.get('/permissions')
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('permissions', response.data || [])
        }
      })
  }
}

export default actions
