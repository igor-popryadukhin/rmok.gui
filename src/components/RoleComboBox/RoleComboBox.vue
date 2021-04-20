<template>
  <v-combobox
    v-model="selected"
    :items="$store.getters['system/roles']"
    item-text="name"
    item-value="id"
    :label="label"
    :rules="rules"
    return-object
    disable-lookup
  >
    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      v-slot:prepend
    >
      <v-icon class="pl-5 pr-9">mdi-account-tie</v-icon>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import { RoleInterface } from '@/api/Roles'

export default Vue.extend({
  data () {
    return {
      roles: [] as RoleInterface[],
      selected: null
    }
  },
  model: {
    event: 'change',
    prop: 'selected'
  },
  name: 'SRoleComboBox',

  props: {
    label: {
      default: '',
      type: String
    },
    rules: {
      default: undefined,
      type: Array
    },
    value: {
      default: undefined,
      type: Object
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    value (val) {
      this.selected = val
    }
  }
})
</script>
