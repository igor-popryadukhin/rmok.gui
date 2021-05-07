import Projects, { ProjectInterface } from '@/api/Projects'
import { RootStateInterface } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ProjectStateInterface } from './state'

const actions: ActionTree<ProjectStateInterface, RootStateInterface> = {
  async load (ctx: ActionContext<ProjectStateInterface, RootStateInterface>) {
    return new Promise<void>((resolve) => {
      new Projects()
        .current()
        .then((response: ProjectInterface) => {
          ctx.commit('project/id', response.id || 0)
          ctx.commit('project/name', response.name || '')
          ctx.commit('project/statuses', response.statuses || [])
          ctx.commit('project/scenario', response.scenario || '')
          ctx.commit('project/created_at', response.created_at || 0)

          resolve()
        })
    })
  }
}

export default actions
