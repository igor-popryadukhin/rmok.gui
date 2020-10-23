import Vue from 'vue'
import { Route } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import { loadLanguageAsync } from '@/plugins/i18n'
import { isEmpty } from '@/Utils'

interface DynamicRuleInterface {
  min: (value: string) => void;
  max: (value: string) => void;
  regex: (value: string) => void;
}

export default Vue.extend({
  data () {
    return {
      rules: {
        /* eslint-disable */
        required: (value: string) => !!value || this.$t('rule_required'),
        max_256: (value: string) => isEmpty(value) || value.length <= 256 || this.$t('rule_max_length_256'),
        max_50: (value: string) => isEmpty(value) || value.length <= 50 || this.$t('rule_max_length_50'),
        max_3000: (value: string) => isEmpty(value) || value.length <= 3000 || this.$t('rule_max_length_3000'),
        email: (value: string) => {
          if (!value) {
            return true
          }
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('rule_invalid_email')
        },
        phone_number: (value: string) => isEmpty(value) || /^(8|\+\d{1,3})(\d{10}|\s([0-9]{1,3})\s(\d{3}-\d{2}-\d{2})|(|\s+)\((\d+)\)(|\s)([0-9]{7}|\s(\d{3})\s(\d{4})))/i.test(value) || this.$t('rule_phone_number')
        /* eslint-enable */
      }
    }
  },

  methods: {
    ruleDynamic (val: number | string | RegExp, message?: string): DynamicRuleInterface {
      return {
        max: (value: string) => isEmpty(value) || value.length <= val || message || this.$t('rule_max_dynamic_length', { val }),
        min: (value: string) => isEmpty(value) || value.length >= val || message || this.$t('rule_min_dynamic_length', { val }),
        regex: (value: string) => isEmpty(value) || new RegExp(val as string | RegExp).test(value) || message || this.$t('rule_regex_dynamic', { val })
      }
    }
  },

  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext) {
    // todo: Solve the question of how we will change the locale
    loadLanguageAsync('ru', 'rules').then(() => next())
  }
})
