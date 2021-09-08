import { Account } from '@/api/Account'
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ProfileState } from './state'

const actions: ActionTree<ProfileState, RootState> = {
  load (ctx: ActionContext<ProfileState, RootState>): Promise<void> {
    return new Promise((resolve) => {
      new Account()
        .getProfile()
        .then((response) => {
          ctx.commit('fill', response)

          // PBX Config
          ctx.commit('pbx_config/display_name', response.pbx_config?.display_name || '')
          ctx.commit('pbx_config/login', response.pbx_config?.login || '')
          ctx.commit('pbx_config/password', response.pbx_config?.password || '')
          ctx.commit('pbx_config/server', response.pbx_config?.server || '')
          ctx.commit('pbx_config/port', response.pbx_config?.port || 443)

          resolve()
        })
    })
  }
}

export default actions
