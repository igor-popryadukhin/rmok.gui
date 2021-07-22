import Statuses from '@/api/Statuses'
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { FilterStateInterface } from './state'

const actions: ActionTree<FilterStateInterface, RootState> = {
  statuses (ctx: ActionContext<FilterStateInterface, RootState>, params = {}) {
    new Statuses()
      .findBy(params)
      .then((response) => {
        ctx.commit('statuses', response.data)
      })
  }
}

export default actions
