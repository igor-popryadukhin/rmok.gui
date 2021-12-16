import { RootState } from '@/store'
import { ContactListState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactListState, RootState> = {
  loading (state: ContactListState) { return state?.loading || false },
  per_page (state: ContactListState) { return state.per_page },
  total (state: ContactListState) { return state?.total || 0 },
  items (state: ContactListState) { return state?.items || [] },
  items_selected (state: ContactListState) { return state.items_selected },

  /**
   * True = все элементы выбраны
   * @param state
   */
  selected_all (state: ContactListState) { return state.selected_all },

  /**
   * True = все элементы на странице выбраны
   * @param state
   */
  selected_all_in_page (state: ContactListState) {
    if (state.items_selected.length === 0) { return false }

    for (const item of state.items) {
      if (state.items_selected.findIndex((id) => id === item.id) === -1) {
        return false
      }
    }

    return true
  },
  /**
   * Состояние неопределённости, прям как...
   *
   * Согласно принципу неопределённости у частицы не могут быть одновременно точно
   * измерены положение и скорость (импульс). ... Соотношение неопределённостей в
   * квантовой механике в математическом смысле есть прямое следствие некоего свойства преобразования Фурье.
   * @param state
   */
  selected_indeterminate (state: ContactListState) {
    if (state.items_selected.length === 0) {
      return false
    }

    for (const item of state.items) {
      if (state.items_selected.findIndex((n) => n === item.id) === -1) {
        return true
      }
    }
    return false
  },
  selected_count (state: ContactListState) { return state.selected_all ? state.total : state.items_selected.length }
}

export default getters
