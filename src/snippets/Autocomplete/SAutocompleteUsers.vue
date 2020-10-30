<template>
  <v-autocomplete
    v-model="selected"
    :items="users"
    :search-input.sync="usersSearchQuery"
    no-filter
    persistent-hint
    :label="label"
    :rules="rules"
    :loading="loading"
    :no-data-text="$t('empty')"
    :disabled="disabled"
  >
    <template
      v-slot:prepend
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
    >
      <v-icon class="pl-5 pr-9">mdi-account-tie</v-icon>
    </template>
    <template v-slot:selection="{ attr, on, item }">
      <span>{{ item.first_name }} {{ item.last_name }}</span>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >
        {{ item.first_name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
        <v-list-item-subtitle
            v-if="item.role"
        >{{ item.role.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { UserInterface, Users } from '@/api/Users'

export default Vue.extend({
  name: 'SAutocompleteUsers',
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selectedId: {
      type: Number,
      default: 0
    },
    organizationId: {
      type: Number,
      default: 0
    },
    search: {
      type: String,
      default: ''
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
    role: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      selectOnce: false,
      selected: null,
      usersSearchQuery: null as null | string,
      usersProcessLoading: false,
      usersSearchDebounce: debounce((q: string, context: any) => {
        if (!context.disabled) {
          context.loading = true
          new Users()
            .find(q, this.role, context.organizationId)
            .then(({ items }) => {
              context.users = items

              if (!context.selectOnce) {
                context.selectOnce = true
                context.selected = context.users.find((e: UserInterface) => e.id === context.selectedId)
              }
            }).finally(() => {
              context.loading = false
            })
        }
      }, 400),
      users: []
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    usersSearchQuery (val: string) {
      this.usersSearchDebounce(val, this)
    },

    organizationId () {
      this.usersSearchDebounce(this.usersSearchQuery, this)
    }
  },

  created () {
    this.usersSearchQuery = this.search
  }
})
</script>
