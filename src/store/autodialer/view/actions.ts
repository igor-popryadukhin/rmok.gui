import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import AutodialerParams from '@/api/AutodialerParams'

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param id
   */
  fetch (ctx: ActionContext<State, RootState>, id) {
    return new AutodialerParams()
      .getById(id)
      .then((response) => {
        ctx.commit('fill', response)
      })
  }

}

export default actions
