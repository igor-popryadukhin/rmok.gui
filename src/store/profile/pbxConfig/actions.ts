import Account from '@/api/Account'
import { ProfileState } from '@/store/profile/state'
import { ActionContext, ActionTree } from 'vuex'
import { PBXConfigState } from '@/store/profile/pbxConfig/state'

const actions: ActionTree<PBXConfigState, ProfileState> = {
  save ({ state }: ActionContext<PBXConfigState, ProfileState>): Promise<void> {
    return new Account()
      .updateProfile({
        pbx_config: {
          login: state.login,
          password: state.password,
          server: state.server,
          port: state.port,
          display_name: state.display_name
        }
      })
  }
}

export default actions
