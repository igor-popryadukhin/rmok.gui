
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { SymfonyStateInterface } from './state'

const actions: ActionTree<SymfonyStateInterface, RootState> = {
  call_collection_clear (ctx: ActionContext<SymfonyStateInterface, RootState>) {
    ctx.state.call_collection = []
  }
}

export default actions
