import { RootState } from '@/store'
import { ContactsState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsState, RootState> = {
  process_loading (state: ContactsState) { return state.process_loading },
  per_page (state: ContactsState) { return state.per_page },
  total (state: ContactsState) { return state.total },
  items (state: ContactsState) { return state.items },
  selected (state: ContactsState) { return state.selected },
  /**
   * True = все элементы выбраны
   * @param state
   */
  selected_all (state: ContactsState) { return state.selected_all },
  /**
   * ![Google](https://sovsys.by/upload/iblock/6d7/6d7c6df52d4c433a1fbbb22069df9666.jpg)
   *
   * Состояние неопределённости, прям как...
   *
   * Согласно принципу неопределённости у частицы не могут быть одновременно точно
   * измерены положение и скорость (импульс). ... Соотношение неопределённостей в
   * квантовой механике в математическом смысле есть прямое следствие некоего свойства преобразования Фурье.
   * @param state
   */
  selected_indeterminate (state: ContactsState) {
    if (state.selected.length === 0) {
      return false
    }

    for (const item of state.items) {
      if (state.selected.findIndex((n) => n === item.id) === -1) {
        return true
      }
    }
    return false
    // return state.selected.length < state.per_page && state.selected.length > 0
  },
  selected_count (state: ContactsState) { return state.selected_all ? state.total : state.selected.length }
}

export default getters
