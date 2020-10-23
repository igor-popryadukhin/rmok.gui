<template>
  <v-autocomplete
    v-model="selected"
    :items="users"
    :search-input.sync="usersSearchQuery"
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
          v-text="item.role.name"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { Users } from '@/api/Users'

export default Vue.extend({
  name: 'UserAutocomplete',
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
      usersSearchQuery: null,
      usersProcessLoading: false,
      usersSearchDebounce: debounce((q: string) => {
        this.loading = true
        new Users().findUsers(q)
          .then(({ count, items }) => {
            this.users = items

            if (this.selectOnce === false) {
              this.selectOnce = true
              this.selected = this.users.find((e) => e.id === this.selectedId)
              console.log(this.selectedId, this.users)
              console.log(this.selected)
            }
          }).finally(() => {
            this.loading = false
          })
      }, 400),
      users: []
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    usersSearchQuery (val: string) {
      this.usersSearchDebounce(val)
    }
  },

  created () {
    this.usersSearchQuery = this.search
  }
})
</script>
