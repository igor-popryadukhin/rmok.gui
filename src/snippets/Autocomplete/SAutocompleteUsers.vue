<template>
  <v-autocomplete
      ref="autocomplete"
    v-model="selected"
    :items="users"
    :search-input.sync="usersSearchQuery"
    no-filter
    disable-lookup
    :cache-items="false"
    persistent-hint
    :label="label"
    :rules="rules"
    :loading="loading"
    :no-data-text="$t('empty')"
    :disabled="disabled"
    :chips="multiple"
    :multiple="multiple"
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
      <v-icon class="pl-5 pr-9">mdi-account-tie</v-icon>
    </template>
    <template v-slot:selection="{ selected, item }">
      <template v-if="multiple">
        <v-chip
          :selected="selected"
          close
          color="#af2db1"
          text-color="white"
          class="pl-1 pr-2"
          label
          @click:close="onChipRemove(item.id)"
        >
          <v-avatar
            v-if="item.first_name && item.last_name"
            style="margin-right: 5px; border: white 1px solid; font-size: 11px"
          >
            {{ item.first_name.charAt(0) }}{{ item.last_name.charAt(0) }}
          </v-avatar>
          {{ item.first_name }} {{ item.last_name }}
        </v-chip>
      </template>
      <template v-else>
        <span>{{ item.first_name }} {{ item.last_name }}</span>
      </template>
    </template>
    <template v-slot:item="{ parent, item }">
      {{ parent.selected }}
      <v-list-item-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >
        {{ item.first_name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.role">Роль: {{ item.role.name }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="displayOrganization && item.organization">Организация: {{ item.organization.name }}</v-list-item-subtitle>
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
    prop: 'value',
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
    },
    value: {
      type: [Object, Array],
      default: null
    },
    selectOnClear: {
      type: Boolean,
      default: false
    },
    displayOrganization: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      selectOnce: false,
      selected: null as any[] | any,
      usersSearchQuery: null as null | string,
      usersProcessLoading: false,
      usersSearchDebounce: debounce((q: string, context: any) => {
        if (!context.disabled) {
          context.loading = true
          context.users = []
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

  mounted () {
    this.$on('change', this.onSelected)
  },

  created () {
    this.usersSearchQuery = this.search
  },

  beforeDestroy () {
    this.$off('change', this.onSelected)
  },

  methods: {
    onSelected (data: any) {
      this.selected = data
    },

    onChipRemove (id: number) {
      if (Array.isArray(this.selected)) {
        const index = this.selected.findIndex((e) => e.id === id)
        if (index >= 0) this.selected.splice(index, 1)
      }
    }
  }
})
</script>
