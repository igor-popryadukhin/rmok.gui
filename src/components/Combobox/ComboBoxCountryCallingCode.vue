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
      v-slot:item="{ item }"
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.name }} ({{ item.name2 }})</v-list-item-title>
        <v-list-item-subtitle>+{{ item.country_calling_code }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template
      v-slot:prepend
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
    prop: 'value',
    event: 'change'
  },
  props: {
    rules: {
      type: Array,
      default: undefined
    },
    visibleIcon: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    countryCodeSelected: {
      type: String,
      required: false,
      default: ''
    },
    onSelected: {
      type: Function,
      required: false
    }
  },

  data () {
    return {
      selected: null,
      roles: [] as RoleInterface[]
    }
  },

  watch: {

    selected (value) {
      this.$emit('change', value.country_code)
      if (typeof this.onSelected === 'function') {
        this.onSelected(value)
      }
    },

    countryCodeSelected (value: string) {
      /* eslint-disable */
      const countryCodes: CountryCodeInterface[] = this.$store.getters['system/country_codes']
      if (countryCodes) {
        for (let i = 0; i < countryCodes.length; i++) {
          console.log(countryCodes[i].country_code, value)
          if (countryCodes[i].country_code === value) {
            this.selected = countryCodes[i]
            break
          }
        }
      }
      /* eslint-enable */
    }
  },

  created () {
    const countryCodes: CountryCodeInterface[] = this.$store.getters['system/country_codes']
    if (countryCodes) {
      for (let i = 0; i < countryCodes.length; i++) {
        if (countryCodes[i].country_code === this.countryCodeSelected) {
          this.selected = countryCodes[i]
          break
        }
      }
    }
  }
})
</script>
