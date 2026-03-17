import Projects, { ProjectInterface } from '@/api/Projects';
import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { ProjectState } from './state';

const actions: ActionTree<ProjectState, RootState> = {

  /**
   * Загрузить текущий проект пользователя.
   *
   * @param ctx
   */
  async current (ctx: ActionContext<ProjectState, RootState>) {
    new Projects()
      .current()
      .then((response: ProjectInterface) => {
        ctx.commit('current', {
          id: response.id,
          name: response.name,
          scenario: response.scenario,
          statuses: response.statuses,
          created_at: response.created_at
        });
      }).catch(() => {
        ctx.commit('current', null);
      });
  },

  /**
   * Загрузить проекты пользователя.
   *
   * @param ctx
   * @param params параметр которые будут переданы конечной точке.
   */
  async available (ctx: ActionContext<ProjectState, RootState>, params = {}) {
    return new Projects()
      .find(params)
      .then((response) => {
        ctx.commit('available', response.data.map((value) => {
          return {
            id: value?.id,
            name: value?.name,
            created_at: value?.created_at
          };
        }));
      });
  },

  /**
   * Очистить текущее хранилище
   *
   * @param ctx
   */
  clear (ctx: ActionContext<ProjectState, RootState>) {
    ctx.commit('available', []);
    ctx.commit('current', null);
  }

};

export default actions;
