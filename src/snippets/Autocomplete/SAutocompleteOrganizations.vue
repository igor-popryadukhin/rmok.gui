<template>
  <v-autocomplete
    v-model="selected"
    :items="organizations"
    :search-input.sync="organizationsSearchQuery"
    no-filter
    persistent-hint
    :label="label"
    :rules="rules"
    :loading="loading"
  >
    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      #prepend
    >
      <v-icon class="pl-5 pr-9">
        mdi-office-building
      </v-icon>
    </template>
    <template #selection="{ item }">
      <span>{{ item.name }}</span>
    </template>
    <template #item="{ item, on }">
      <v-list-item
        link
        v-on="on"
      >
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item.name.charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle
            v-if="item.sphere_activity"
            v-text="item.sphere_activity"
          />
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { OrganizationInterface, Organizations } from '@/api/Organizations'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

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
    rules: {
      default: undefined,
      type: Array
    },
    search: {
      default: '',
      type: String
    },
    selectedId: {
      default: 0,
      type: Number
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      organizations: [] as OrganizationInterface[],
      organizationsSearchDebounce: debounce((q: string, context: any) => {
        context.loading = true
        new Organizations().find({
          q
        })
          .then((response: ResponseInterface<any, OrganizationInterface[]>) => {
            context.organizations = response.data

            if (!context.selectOnce) {
              context.selectOnce = true
              context.selected = context.organizations.find((e: OrganizationInterface) => e.id === context.selectedId)
            }
          }).finally(() => {
            context.loading = false
          })
      }, 400),
      organizationsSearchQuery: null as null | string,
      selectOnce: false,
      selected: null
    }
  },

  watch: {
    organizationsSearchQuery (val: string) {
      this.organizationsSearchDebounce(val, this)
    },

    selected (value) {
      this.$emit('change', value)
    },

    selectedId (id: number) {
      this.organizations.find((e: OrganizationInterface) => e.id === id)
    }
  },
  created () {
    this.organizationsSearchQuery = this.search
  }
})
</script>
