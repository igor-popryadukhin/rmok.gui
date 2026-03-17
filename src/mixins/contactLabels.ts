import Vue from 'vue';
import { Contacts } from '@/api/Contacts';

export default Vue.extend({

  data () {
    return {
      contactLabels: [] as string[]
    };
  },
  created () {
    new Contacts()
      .getLabels()
      .then((response) => {
        /* eslint-disable */
        // @ts-ignore
        this.contactLabels = response
        /* eslint-enable */
      });
  }
});
