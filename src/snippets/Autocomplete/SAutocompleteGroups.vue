<template>
  <v-autocomplete
    v-model="selected"
    :items="groups"
    :search-input.sync="groupsSearchQuery"
    no-filter
    persistent-hint
    :label="label"
    :rules="rules"
    :loading="loading"
    :disabled="disabled"
  >
    <template v-slot:no-data>
      <slot name="no-data">
        No data
      </slot>
    </template>
    <template
      v-slot:prepend
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
    >
      <v-icon class="pl-5 pr-9">mdi-account-group</v-icon>
    </template>
    <template v-slot:selection="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.organization && visibleOrganizationName">{{ item.organization.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.organization  && visibleOrganizationName">{{ item.organization.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { GroupInterface, Groups } from '@/api/Groups'

export default Vue.extend({
  name: 'SAutocompleteGroups',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selectedId: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    organizationId: {
      type: Number,
      default: 0
    },
    search: {
      type: [String, Object],
      default: null
    },
    visibleOrganizationName: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Array,
      default: undefined
    },
    visibleIcon: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    autoLoad: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      selectOnce: false,
      selected: null as any,
      groupsSearchQuery: null as null | string,
      groupsProcessLoading: false,
      groupsSearchDebounce: debounce((context: any) => {
        context.loading = true
        new Groups()
          .find(context.groupsSearchQuery, context.organizationId)
          .then((items: GroupInterface[]) => {
            context.groups = items
            context.selected = context.groups.find((e: GroupInterface) => e.id === context.selectedId)
          }).finally(() => {
            context.loading = false
          })
      }, 400),
      groups: []
    }
  },

  watch: {
    selected (value) {
      if (!this.disabled) {
        this.$emit('change', value)
      }
    },

    groupsSearchQuery () {
      if (!this.disabled) {
        this.groupsSearchDebounce(this)
      }
    },

    organizationId () {
      if (!this.disabled) {
        this.groupsSearchDebounce(this)
      }
    },

    selectedId (val: number) {
      this.selected = this.groups.find((e: GroupInterface) => e.id === val)
    }
  },

  created () {
    if (this.autoLoad) {
      this.groupsSearchDebounce(this)
    }
  }
})
</script>
