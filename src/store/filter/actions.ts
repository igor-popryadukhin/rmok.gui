import Statuses from '@/api/Statuses'
import { RootStateInterface } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { FilterStateInterface } from './state'

const actions: ActionTree<FilterStateInterface, RootStateInterface> = {
  statuses (ctx: ActionContext<FilterStateInterface, RootStateInterface>, params = {}) {
    new Statuses()
      .findBy(params)
      .then((response) => {
        ctx.commit('statuses', response.data)
      })
  }
}

export default actions
