import Vue from 'vue'
import { Route } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import { loadLanguageAsync } from '@/plugins/i18n'
import { isEmpty } from '@/Utils'

interface DynamicRuleInterface {
  val: (value: string) => void;
  min: (value: string) => void;
  max: (value: string) => void;
  regex: (value: string) => void;
}

interface AssertLengthInterface {
  max?: number;
  min?: number;
  messageMax?: string;
  messageMin?: string;
}

export default Vue.extend({
  data () {
    return {
      rules: {
        /* eslint-disable */
        notBlank: (value: string) => !!value || this.$t('This field should not be blank.'),
        positive: (value: string) => +value > 0 || this.$t('This value should be positive.'),
        required: (value: string) => !!value || this.$t('rule_required'),
        max_256: (value: string) => isEmpty(value) || value.length <= 256 || this.$t('rule_max_length_256'),
        max_50: (value: string) => isEmpty(value) || value.length <= 50 || this.$t('rule_max_length_50'),
        max_3000: (value: string) => isEmpty(value) || value.length <= 3000 || this.$t('rule_max_length_3000'),
        number: (value: string) => isEmpty(value) || /\d+/.test(value) || this.$t('rule_number'),
        email: (value: string) => {
          if (!value) {
            return true
          }
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('rule_invalid_email')
        },
        phone_number: (value: string) => isEmpty(value) || /^(8|\+\d{1,3})(\d{10}|\s([0-9]{1,3})\s(\d{3}-\d{2}-\d{2})|(|\s+)\((\d+)\)(|\s)([0-9]{7}|\s(\d{3})\s(\d{4})))/i.test(value) || this.$t('rule_invalid_phone_number'),
        lengthMax: (value: number, message = 'Empty. | This value is too long. It should have {n} characters or less. | This value is too long. It should have {n} characters or less.') => {
          return (v: string) => (v.length <= value ? true : this.$tc(message, value))
        },
        lengthMin: (value: number, message = 'Empty. | This value is too short. It should have {n} characters or more. | This value is too short. It should have {n} characters or more.') => {
          return (v: string) => (v.length >= value ? true : this.$tc(message, value))
        },
        /* eslint-enable */
      }
    }
  },

  methods: {
    ruleDynamic (val: number | string | boolean | RegExp, message?: string): DynamicRuleInterface {
      return {
        val: () => val || message || this.$t('rule_max_dynamic_length', { val }),
        max: (value: string) => isEmpty(value) || value.length <= val || message || this.$t('rule_max_dynamic_length', { val }),
        min: (value: string) => isEmpty(value) || value.length >= val || message || this.$t('rule_min_dynamic_length', { val }),
        regex: (value: string) => isEmpty(value) || new RegExp(val as string | RegExp).test(value) || message || this.$t('rule_regex_dynamic', { val })
      }
    },

    assertLength (options: AssertLengthInterface) {
      console.log('call assertLength')
      return (value: string) => {
        if (options.max) {
          const max = options.max
          const messageMax: string = options.messageMax ?? 'Empty. | This value is too long. It should have {n} characters or less. | This value is too long. It should have {n} characters or less.'
          const assertMax = (v: string) => {
            return v.length <= max ? true : this.$tc(messageMax, max)
          }

          return assertMax(value)
        }

        if (options.min) {
          const min = options.min
          const messageMin: string = options.messageMin ?? 'Empty. | This value is too short. It should have {n} characters or more. | This value is too short. It should have {n} characters or more.'
          const assertMin = (v: string) => {
            return v.length <= min ? true : this.$tc(messageMin, min)
          }

          return assertMin(value)
        }
      }
    },

    ruleComparer (val1: number | string | boolean, val2: number | string | boolean, message?: string) {
      return () => val1 === val2 || message || this.$t('rule_value_is_not_equal')
    }
  },

  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext) {
    // todo: Solve the question of how we will change the locale
    loadLanguageAsync('ru', 'rules').then(() => next())
  }
})
