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
        <phone-numbers-country-calling-code
          :key="`item-${item.country_code}`"
          v-model="item.country_code"
          :label="$tc('country_code')"
          :country-code-selected="item.country_code"
          :on-selected="(e) => { item.country_code = e.country_code; item.country_calling_code = e.country_calling_code; }"
          :rules="rulesCountryCode"
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            #prepend
          >
            <v-icon
              v-if="key === 0"
              class="pl-5 pr-9"
            >
              mdi-phone
            </v-icon>
            <v-spacer
              v-else
              class="pl-10 pr-10"
            />
          </template>
        </phone-numbers-country-calling-code>
      </v-col>
      <v-col
        cols="3"
        lg="3"
      >
        <v-text-field
          v-model="item.raw"
          :label="$tc('Phone number')"
          :rules="rulesNumber ? rulesNumber.concat([() => validate(item.raw, item.country_code)]) : [() => validate(item.value, item.country_code)]"
        />
      </v-col>
      <v-col
        cols="6"
      >
        <v-text-field
          v-model="item.label"
          :label="$tc('label')"
          :rules="rulesLabel"
          counter
        >
          <template #append-outer>
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
import PhoneNumbersCountryCallingCode from '@/snippets/SPhoneNumbers/PhoneNumbersCountryCallingCode.vue'
import parsePhoneNumber from 'libphonenumber-js'
import { CountryCode } from 'libphonenumber-js/types'

export default Vue.extend({

  name: 'SPhoneNumbers',
  components: {
    PhoneNumbersCountryCallingCode
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    messageError: {
      default: 'Invalid number format',
      type: String
    },
    rulesCountryCode: {
      default: undefined,
      type: Array
    },
    rulesLabel: {
      default: undefined,
      type: Array
    },
    rulesNumber: {
      default: undefined,
      type: Array
    },
    value: {
      default: undefined,
      type: [Array]
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
  beforeDestroy () {
    this.$off('change', this.onChange)
  },
  created () {
    this.phones = this.value
  },

  mounted () {
    this.$on('change', this.onChange)
  },

  methods: {
    doAddPhoneNumber (id = 0, countryCode = '', countryCallingCode = '', label = '', raw = '') {
      this.phones.push({
        /* eslint-disable */
        id,
        country_code: countryCode,
        country_calling_code: countryCallingCode,
        label,
        raw
        /* eslint-enable */
      })
    },

    onAddClick () {
      this.doAddPhoneNumber()
    },

    onChange (value: any) {
      this.phones = value
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
