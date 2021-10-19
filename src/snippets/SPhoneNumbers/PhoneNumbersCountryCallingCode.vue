<template>
  <v-combobox
    v-model="selected"
    :items="$store.getters['system/country_codes']"
    item-text="name"
    item-value="country_code"
    :label="label"
    :rules="rules"
    :prefix="selected ? selected.country_code : ''"
  >
    <template
      #item="{ item }"
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.name }} ({{ item.name2 }})</v-list-item-title>
        <v-list-item-subtitle>+{{ item.country_calling_code }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template
      #prepend
    >
      <slot name="prepend" />
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import { RoleInterface } from '@/api/Roles'
import { CountryCodeInterface } from '@/api/Database'

export default Vue.extend({

  name: 'ComboBoxCountryCallingCode',
  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    countryCodeSelected: {
      default: '',
      required: false,
      type: String
    },
    icon: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
    },
    onSelected: {
      required: false,
      type: Function
    },
    rules: {
      default: undefined,
      type: Array
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      roles: [] as RoleInterface[],
      selected: null as any
    }
  },

  watch: {

    countryCodeSelected (value: string) {
      /* eslint-disable */
      const countryCodes: CountryCodeInterface[] = this.$store.getters['system/country_codes']
      if (countryCodes) {
        for (let item of countryCodes) {
          if (item.country_code === value) {
            this.selected = item
            break
          }
        }
      }
      /* eslint-enable */
    },

    selected (value) {
      this.$emit('change', value.country_code)
      if (typeof this.onSelected === 'function') {
        this.onSelected(value)
      }
    }
  },
  created () {
    const countryCodes: CountryCodeInterface[] = this.$store.getters['system/country_codes']
    if (countryCodes) {
      for (const item of countryCodes) {
        if (item.country_code === this.countryCodeSelected) {
          this.selected = item
          break
        }
      }
    }
  }
})
</script>
