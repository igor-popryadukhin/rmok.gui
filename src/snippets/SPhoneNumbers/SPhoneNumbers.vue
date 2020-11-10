<template>
  <div>
    <v-row
      v-for="(item, key) in phones"
      :key="`item-${key}`"
    >
      <v-col
        cols="3"
        lg="3"
      >
        <combo-box-country-calling-code
          v-model="item.country_code"
          :key="`item-${item.country_code}`"
          :label="$tc('country_code')"
          :country-code-selected="item.country_code"
          :on-selected="(e) => { item.country_code = e.country_code; item.country_calling_code = e.country_calling_code; }"
          :rules="rulesCountryCode"
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon v-if="key === 0" class="pl-5 pr-9">mdi-phone</v-icon>
            <v-spacer v-else class="pl-10 pr-10"></v-spacer>
          </template>
        </combo-box-country-calling-code>
      </v-col>
      <v-col
        cols="3"
        lg="3"
      >
        <v-text-field
          v-model="item.value"
          :label="$tc('phone')"
          :prefix="item.country_calling_code ? `+${item.country_calling_code}` : ''"
          :rules="rulesNumber ? rulesNumber.concat([() => validate(item.value, item.country_code)]) : [() => validate(item.value, item.country_code)]"
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="6"
      >
        <v-text-field
          v-model="item.label"
          :label="$tc('label')"
          :rules="rulesLabel"
        >
          <template v-slot:append-outer>
            <v-btn
              v-if="(phones.length - 1) === key"
              icon
              @click="onAddClick"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-else
              icon
              color="red"
              @click="onDeleteClick(key)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ComboBoxCountryCallingCode from '@/components/Combobox/ComboBoxCountryCallingCode.vue'
import parsePhoneNumber from 'libphonenumber-js'
import { CountryCode } from 'libphonenumber-js/types'

export default Vue.extend({
  name: 'SPhoneNumbers',
  components: {
    ComboBoxCountryCallingCode
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    messageError: {
      type: String,
      default: 'Invalid number format'
    },
    rulesLabel: {
      type: Array,
      default: undefined
    },
    rulesNumber: {
      type: Array,
      default: undefined
    },
    rulesCountryCode: {
      type: Array,
      default: undefined
    },
    value: {
      type: [Array],
      default: undefined
    }
  },

  data () {
    return {
      phones: [] as any[]
    }
  },

  watch: {
    value (value) {
      this.phones = value
    }
  },

  mounted () {
    this.$on('change', this.onChange)
  },

  created () {
    this.phones = this.value
  },

  beforeDestroy () {
    this.$off('change', this.onChange)
  },

  methods: {
    onChange (value: any) {
      this.phones = value
    },

    onAddClick () {
      this.doAddPhoneNumber()
    },

    doAddPhoneNumber (id = 0, countryCode = '', countryCallingCode = '', label = '', value = '') {
      this.phones.push({
        /* eslint-disable */
        id,
        country_code: countryCode,
        country_calling_code: countryCallingCode,
        label,
        value
        /* eslint-enable */
      })
    },

    onDeleteClick (index: number) {
      this.phones.splice(index, 1)
    },

    validate (text: string, defaultCountry?: CountryCode) {
      try {
        return parsePhoneNumber(text, defaultCountry)?.isValid() || false
      } catch (e) {
        return false
      }
    }
  }
})
</script>

<style scoped>

</style>
