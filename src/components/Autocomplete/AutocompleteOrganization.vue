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
      v-slot:prepend
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
    >
      <v-icon class="pl-5 pr-9">mdi-account-tie</v-icon>
    </template>
<!--    <template v-slot:no-data>-->
<!--      <v-list-item>-->
<!--        <v-list-item-title>-->
<!--          {{ $tc('start_typing_your_search_term') }}-->
<!--        </v-list-item-title>-->
<!--      </v-list-item>-->
<!--    </template>-->
    <template v-slot:selection="{ attr, on, item }">
      <span>{{ item.name }}</span>
    </template>
    <template v-slot:item="{ item }">
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
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { OrganizationInterface, Organizations } from '@/api/Organizations'

export default Vue.extend({
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selectedId: {
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
    }
  },

  data () {
    return {
      loading: false,
      selectOnce: false,
      selected: null,
      organizationsSearchQuery: null as null | string,
      organizationsSearchDebounce: debounce((q: string, context: any) => {
        context.loading = true
        new Organizations().find(q)
          .then(({ items }) => {
            context.organizations = items

            if (!context.selectOnce) {
              context.selectOnce = true
              context.selected = context.organizations.find((e: OrganizationInterface) => e.id === context.selectedId)
            }
          }).finally(() => {
            context.loading = false
          })
      }, 400),
      organizations: [] as OrganizationInterface[]
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    organizationsSearchQuery (val: string) {
      this.organizationsSearchDebounce(val, this)
    }
  },

  created () {
    this.organizationsSearchQuery = this.search
  }
})
</script>
