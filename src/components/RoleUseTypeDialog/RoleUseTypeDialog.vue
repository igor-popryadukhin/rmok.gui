<template>
  <v-card>
    <v-card-title>{{ $tc('Создание новой роли') }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="role_name"
        :label="$tc('Role name')"
      />
    </v-card-text>
    <v-card-text>
      <v-select
        v-model="role_use.selected"
        :items="role_use.options"
        :label="$tc('The role is used for')"
        item-text="title"
        item-value="value"
      />
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn
        color="red darken-1"
        tile
        outlined
        @click="cancel"
      >{{ $tc('Cancel') }}</v-btn>
      <v-btn
        color="primary"
        tile
        outlined
        @click="create"
      >{{ $tc('Create') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import Vue from 'vue'

export interface SContactExportScopeInterface {
  /** Идентификатор проекта */
  target_project?: unknown & number | undefined;

  /** Идентификаторы выбранных пользователей */
  target_users: number[];

  /** Новая дата в формате Unixtime */
  new_date?: number
}

type Transfer = (scope: SContactExportScopeInterface) => void

interface IProps {
  onCancel: () => void;
}

interface Errors {
  project: string[],
  users: string[]
}

interface IData {
  [key: string]: any;
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'RoleUseTypeDialog',

  props: {
    onCreate: {
      type: Function,
      default: null
    },
    onCancel: {
      type: Function,
      default: null
    },
    width: {
      type: String,
      default: () => '100%'
    }
  },

  data (): IData {
    return {
      role_name: null,
      role_use: {
        selected: null,
        options: [
          {
            title: this.$tc('For administration'),
            value: 'for_administration'
          },
          {
            title: this.$tc('For calls'),
            value: 'for_calls'
          }
        ]
      }
    }
  },

  computed: {
    notBlank: (value: any) => !!value || this.$t('This field should not be blank.')
  },

  methods: {

    cancel () {
      if (typeof this.onCancel === 'function') {
        this.onCancel()
      }
    },

    create () {
      if (typeof this.onCreate === 'function') {
        // TODO: Сделать валидацию.
        const context: any = {
          name: this.role_name,
          use: this.role_use.selected
        }
        this.onCreate(context)
      }
    }
  }

})
</script>

<style lang="scss">
</style>
