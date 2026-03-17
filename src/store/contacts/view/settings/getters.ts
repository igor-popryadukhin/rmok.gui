import { RootState } from '@/store';
import { ContactsViewSettingsState } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<ContactsViewSettingsState, RootState> = {
  left_width (state) { return state.left_width; },
  right_width (state) { return state.right_width; }
};

export default getters;
