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
          ctx.commit('id', response.id || 0)
          ctx.commit('name', response.name || '')
          ctx.commit('statuses', response.statuses || [])
          ctx.commit('scenario', response.scenario || '')
          ctx.commit('created_at', response.created_at || 0)

          resolve()
        })
    })
  },

  /**
   * Получить доступные проекты
   * @param ctx
   */
  async fetchAvailableProjects (ctx: ActionContext<ProjectStateInterface, RootStateInterface>) {
    return new Projects()
      .find()
      .then((response) => {
        ctx.commit('available', response.data)
      })
  }
}

export default actions
