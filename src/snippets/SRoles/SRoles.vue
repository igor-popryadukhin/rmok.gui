<template>
  <v-combobox
    v-model="selected"
    :items="roles"
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

  model: {
    event: 'change',
    prop: 'selected'
  },

  props: {
    label: {
      default: '',
      type: String
    },
    options: {
      default: () => [],
      type: Array
    },
    rules: {
      default: () => [],
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
  },
  created () {
    if (this.options.length === 0) {
      this.roles = this.$store.getters['system/roles']
    } else {
      this.roles = this.options
    }
  }
})
</script>
