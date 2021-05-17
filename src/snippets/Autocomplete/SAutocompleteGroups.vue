<template>
  <v-combobox
    v-model="selected"
    :items="groups"
    item-text="name"
    item-value="id"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :loading="loading"
    return-object
    disable-lookup
  >
    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      v-slot:prepend
    >
      <v-icon class="pl-5 pr-9">mdi-account-group</v-icon>
    </template>
    <template
      v-slot:no-data
    >
      <slot name="no-data">
        <div class="pt-2 pb-2 pl-2 pr-2">
          {{ $tc('No data') }}
        </div>
      </slot>
    </template>
  </v-combobox>
<!--  <v-autocomplete-->
<!--    v-model="selected"-->
<!--    :items="groups"-->
<!--    :search-input.sync="groupsSearchQuery"-->
<!--    no-filter-->
<!--    :label="label"-->
<!--    :rules="rules"-->
<!--    :loading="loading"-->
<!--    :disabled="disabled"-->
<!--    disable-lookup-->
<!--    clearable-->
<!--    hide-details-->
<!--  >-->
<!--    <template v-slot:no-data>-->
<!--      <slot name="no-data">-->
<!--        No data-->
<!--      </slot>-->
<!--    </template>-->
<!--    <template-->
<!--      v-slot:prepend-->
<!--      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"-->
<!--    >-->
<!--      <v-icon class="pl-5 pr-9">mdi-account-group</v-icon>-->
<!--    </template>-->
<!--    <template v-slot:selection="{ item }">-->
<!--      <v-list-item-content>-->
<!--        <v-list-item-title>{{ item.name }}</v-list-item-title>-->
<!--        <v-list-item-subtitle v-if="item.organization && visibleOrganizationName">{{ item.organization.name }}</v-list-item-subtitle>-->
<!--      </v-list-item-content>-->
<!--    </template>-->
<!--    <template v-slot:item="{ item }">-->
<!--      <v-list-item-content :key="item.id">-->
<!--        <v-list-item-title>{{ item.name }}</v-list-item-title>-->
<!--        <v-list-item-subtitle v-if="item.organization  && visibleOrganizationName">{{ item.organization.name }}</v-list-item-subtitle>-->
<!--      </v-list-item-content>-->
<!--    </template>-->
<!--  </v-autocomplete>-->
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { GroupFindQueryInterface, GroupInterface, Groups } from '@/api/Groups'

export default Vue.extend({
  created () {
    if (this.autoLoad && this.disabled === false) {
      this.loadGroups()
    }
  },
  data () {
    return {
      groups: [],
      groupsSearchDebounce: debounce((context: any) => {
        if (context.disabled) { return }
        context.loading = true

        const query = {}

        if (context.organizationId > 0) {
          query.organization_id = context.organizationId
        }

        new Groups()
          .find(query)
          .then((items: GroupInterface[]) => {
            context.groups = items
            context.selected = context.groups.find((e: GroupInterface) => e.id === context.selectedId)
          }).finally(() => {
            context.loading = false
          })
      }, 400),
      groupsSearchQuery: null as null | string,
      loading: false,
      selectOnce: false,
      selected: null as any
    }
  },
  methods: {
    loadGroups () {
      this.loading = true
      const query: GroupFindQueryInterface = {
        count: 100,
        offset: 0
      }

      if (this.organizationId) {
        query.organization_id = this.organizationId
      }

      new Groups()
        .find(query)
        .then((items: GroupInterface[]) => {
          this.groups = items
          this.selected = this.groups.find((e: GroupInterface) => e.id === this.selectedId)
        }).finally(() => {
          this.loading = false
        })
    }
  },

  model: {
    event: 'change',
    prop: 'selected'
  },

  name: 'SAutocompleteGroups',

  props: {
    autoLoad: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    label: {
      default: '',
      type: String
    },
    organizationId: {
      default: 0,
      type: Number
    },
    rules: {
      default: undefined,
      type: Array
    },
    search: {
      default: null,
      type: [String, Object]
    },
    selectedId: {
      default: 0,
      type: Number
    },
    visibleIcon: {
      default: false,
      type: Boolean
    },
    visibleOrganizationName: {
      default: true,
      type: Boolean
    }
  },

  watch: {
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

    selected (value) {
      if (!this.disabled) {
        this.$emit('change', value)
      }
    },

    async selectedId () {
      this.groupsSearchDebounce(this)
    }
  }
})
</script>
