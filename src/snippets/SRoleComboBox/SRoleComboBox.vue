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
  name: 'SRoleComboBox',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: undefined
    },
    visibleIcon: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
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
      this.$emit('change', value)
    },

    value (val) {
      this.selected = val
    }
  }
})
</script>
