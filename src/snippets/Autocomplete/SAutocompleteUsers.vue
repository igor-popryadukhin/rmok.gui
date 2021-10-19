<template>
  <v-autocomplete
    ref="autocomplete"
    v-model="selected"
    :items="users"
    :search-input.sync="dataSearch"
    no-filter
    disable-lookup
    :cache-items="false"
    persistent-hint
    :outlined="outlined"
    :label="label"
    :rules="rules"
    :loading="loading"
    :no-data-text="$t('empty')"
    :disabled="disabled"
    :chips="multiple"
    :multiple="multiple"
    :dense="dense"
    :clearable="clearable"
  >
    <template #no-data>
      <slot name="no-data">
        No data
      </slot>
    </template>
    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      #prepend
    >
      <v-icon class="pl-5 pr-9">
        mdi-account-tie
      </v-icon>
    </template>
    <template #selection="{ selected, item }">
      <template v-if="multiple">
        <v-chip
          :input-value="selected"
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
    <template #item="{item }">
      <v-list-item-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >
        {{ item.first_name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.role">
          Роль: {{ item.role.name }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="displayOrganization && item.organization">
          Организация: {{ item.organization.name }}
        </v-list-item-subtitle>
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
    event: 'change',
    prop: 'value'
  },

  props: {
    clearable: {
      default: false,
      type: Boolean
    },
    dense: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    displayOrganization: {
      default: false,
      type: Boolean
    },
    label: {
      default: '',
      type: String
    },
    multiple: {
      default: false,
      type: Boolean
    },
    organizationId: {
      default: 0,
      type: Number
    },
    outlined: {
      default: false,
      type: Boolean
    },
    projectId: {
      default: 0,
      type: Number
    },
    roles: {
      default: '',
      type: String
    },
    rules: {
      default: undefined,
      type: Array
    },
    search: {
      default: '',
      type: String
    },
    selectOnClear: {
      default: false,
      type: Boolean
    },
    selectedId: {
      default: 0,
      type: Number
    },
    value: {
      default: null,
      type: [Object, Array]
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      attributes: null,
      dataSearch: null as string | null,
      loading: false,
      selectOnce: false,
      selected: null as any[] | any,
      users: [],
      usersProcessLoading: false,
      usersSearchDebounce: debounce((context: any) => {
        if (!context.disabled) {
          context.loading = true
          context.users = []
          new Users()
            .find({
              count: 50,
              offset: 0,
              organization_id: context.organizationId,
              project_id: context.projectId,
              q: context.dataSearch,
              roles: context.roles
            })
            .then(({ data }) => {
              context.users = data

              if (!context.selectOnce) {
                context.selectOnce = true
                context.selected = context.users.find((e: UserInterface) => e.id === context.selectedId)
              }
            }).finally(() => {
              context.loading = false
            })
        }
      }, 400)
    }
  },

  watch: {
    dataSearch () {
      this.usersSearchDebounce(this)
    },

    organizationId () {
      this.usersSearchDebounce(this)
    },

    projectId () {
      this.usersSearchDebounce(this)
    },

    selected (value) {
      this.$emit('change', value)
    }
  },
  beforeDestroy () {
    this.$off('change', this.onSelected)
  },
  created () {
    if (!this.disabled) {
      this.dataSearch = this.search
    }
  },

  mounted () {
    this.$on('change', this.onSelected)
  },

  methods: {
    onChipRemove (id: number) {
      if (Array.isArray(this.selected)) {
        const index = this.selected.findIndex((e) => e.id === id)
        if (index >= 0) this.selected.splice(index, 1)
      }
    },

    onSelected (data: any) {
      this.selected = data
    }
  }
})
</script>
