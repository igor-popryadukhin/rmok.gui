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
      #prepend
    >
      <v-icon class="pl-5 pr-9">
        mdi-account-tie
      </v-icon>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import { RoleInterface } from '@/api/Roles'

export default Vue.extend({
  name: 'SRoleComboBox',
  model: {
    event: 'change',
    prop: 'selected'
  },

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
  data () {
    return {
      roles: [] as RoleInterface[],
      selected: null
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
