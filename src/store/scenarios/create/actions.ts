import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import Scenarios from '@/api/Scenarios';

export const actions: ActionTree<State, RootState> = {

  /**
   * Создаём сценарий.
   *
   * @param ctx
   */
  apply (ctx: ActionContext<State, RootState>) {
    const data: Record<string, unknown> = {
      name: ctx.state.name,
      scenario: ctx.state.scenario
    };
    return new Scenarios().create(data);
  }
};
