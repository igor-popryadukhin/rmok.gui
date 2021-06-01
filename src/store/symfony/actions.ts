
import { RootStateInterface } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { SymfonyStateInterface } from './state'

const actions: ActionTree<SymfonyStateInterface, RootStateInterface> = {
  call_collection_clear (ctx: ActionContext<SymfonyStateInterface, RootStateInterface>) {
    ctx.state.call_collection = []
  }
}

export default actions
