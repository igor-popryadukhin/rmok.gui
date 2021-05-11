<template>
  <v-card>
    <v-card-title>{{ $tc('Передать контакты в другой проект') }}</v-card-title>
    <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
    <v-card-text>
      <span class="mr-2">{{ $tc('The date of creation of contacts will be kept old.') }}</span>
      <v-menu
        ref="menu_date_picker"
        v-model="menu_date_picker"
        :close-on-content-click="false"
        :return-value.sync="new_date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            tile
            text
            x-small
            outlined
            v-bind="attrs"
            v-on="on">Изменить</v-btn>
        </template>
        <v-date-picker
          v-model="new_date"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu_date_picker = false"
          >
            {{ $tc('Cancel') }}
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu_date_picker.save(new_date)"
          >
            {{ $tc('OK') }}
          </v-btn>
        </v-date-picker>
      </v-menu>
      <span class="ml-2">{{ new_date }}</span>
    </v-card-text>
    <v-card-text>
      <s-projects-autocomplete
        ref="sProjectAutocomplete"
        v-model="target_project"
        :label="$tc('The project to which the contacts will be transferred')"
        :error-messages="errors.project"
        :disabled="project_id > 0"
        dense
        outlined
      />
    </v-card-text>
    <v-card-text>
      <s-users
        v-model="target_users"
        :label="$tc('Users to receive contacts')"
        :error-messages="errors.users"
        :params="{ role_use: 'for_calls' }"
        dense
        outlined
        multiple
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
        @click="exportClick"
      >{{ $tc('Transfer to') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import { ProjectInterface } from '@/api/Projects'
import { UserInterface } from '@/api/Users'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue, { PropType } from 'vue'

export interface SContactTransferScopeInterface {
  filters: any,

  /** Идентификатор проекта */
  target_project?: unknown & number | undefined;

  /** Идентификаторы выбранных пользователей */
  target_users: number[];

  /** Новая дата в формате Unixtime */
  new_date?: number
}

type Transfer = (scope: SContactTransferScopeInterface) => void

interface IProps {
  subtitle: string;
  width: string | number;
  project_id?: number;
  onTransfer: Transfer;
  onCancel: () => void;
}

interface Errors {
  project: string[],
  users: string[]
}

interface IData {
  menu_date_picker: false,
  errors: Errors,
  target_project: unknown & ProjectInterface | null,
  target_users: UserInterface[],
  new_date: string
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'SContactTransferDialog',

  props: {
    onCancel: {
      default: null,
      type: Function
    },
    onTransfer: {
      default: null,
      type: Function as PropType<Transfer>,
      validator (fn: Transfer) {
        return !!fn
      }
    },
    project_id: {
      default: () => 0,
      type: Number
    },

    subtitle: {
      default: '',
      type: String
    },
    width: {
      default: () => '100%',
      type: String
    }
  },

  components: { SProjectsAutocomplete, SUsers },

  computed: {
    notBlank: (value: any) => !!value || this.$t('This field should not be blank.')
  },

  data (): IData {
    return {
      errors: {
        project: [],
        users: []
      },
      menu_date_picker: false,
      new_date: '',
      target_project: null,
      target_users: []
    }
  },

  methods: {
    cancel () {
      if (typeof this.onCancel === 'function') {
        this.onCancel()
      }
    },

    exportClick () {
      if (!this.target_project) {
        this.errors.project = [this.$tc('This field should not be blank.')]
      }

      if (!this.target_users) {
        this.errors.users = [this.$tc('This field should not be blank.')]
      }
      if (this.errors.users.length > 0 || this.errors.users.length > 0) {
        return
      }

      if (typeof this.onTransfer === 'function') {
        const scope: SContactTransferScopeInterface = {
          target_project: this.target_project?.id,
          target_users: this.target_users.map(value => value.id)
        }

        // Новая дата опциональна
        if (this.new_date) {
          const newDate = new Date()
          newDate.setDate(new Date(this.new_date).getDate())
          scope.new_date = newDate.getTime() / 1000
        }

        this.onTransfer(scope)
      }
    }
  },

  mounted () {
    if (this.$props.project_id > 0) {
      this.$refs.sProjectAutocomplete.setDefault(this.$props.project_id)
    }
  }
})
</script>

<style lang="scss">
</style>
