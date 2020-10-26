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
  >
    <template
      v-slot:prepend
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
    >
      <v-icon class="pl-5 pr-9">mdi-account-group</v-icon>
    </template>
    <!--    <template v-slot:no-data>-->
    <!--      <v-list-item>-->
    <!--        <v-list-item-title>-->
    <!--          {{ $tc('start_typing_your_search_term') }}-->
    <!--        </v-list-item-title>-->
    <!--      </v-list-item>-->
    <!--    </template>-->
    <template v-slot:selection="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.organization">{{ item.organization.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.organization">{{ item.organization.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { GroupInterface, Groups } from '@/api/Groups'

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
      groupsSearchQuery: null as null | string,
      groupsProcessLoading: false,
      groupsSearchDebounce: debounce((q: string, context: any) => {
        context.loading = true
        new Groups()
          .find(q, 0, 10)
          .then((items: GroupInterface[]) => {
            context.groups = items

            if (!context.selectOnce) {
              context.selectOnce = true
              context.selected = context.groups.find((e: GroupInterface) => e.id === context.selectedId)
            }
          }).finally(() => {
            context.loading = false
          })
      }, 400),
      groups: []
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    groupsSearchQuery (val: string) {
      this.groupsSearchDebounce(val, this)
    }
  },

  created () {
    this.groupsSearchQuery = this.search
  }
})
</script>
