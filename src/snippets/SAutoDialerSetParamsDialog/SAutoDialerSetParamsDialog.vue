<template>
  <v-card min-width="450px">
    <div class="d-flex justify-space-between">
      <div>
        <v-card-title class="py-3">
          {{ title }}
        </v-card-title>
      </div>
    </div>
    <v-card-text>
      <s-projects-autocomplete
        ref="sProjectAutocomplete"
        v-model="target_project"
        :label="$tc('Выберите проект для автообзвона')"
        :error-messages="errors.project"
        dense
        outlined
        @change="errors.project = []"
      />
    </v-card-text>
    <v-card-text class="py-0">
      <v-divider />
    </v-card-text>

    <v-card-actions class="d-flex justify-end px-4">
      <div>
        <v-btn
          text
          tile
          @click="cancel"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          text
          tile
          @click="save"
        >
          {{ $tc('Save') }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { ProjectInterface } from '@/api/Projects'
import rules from '@/mixins/rules'
import { SContactTransferScopeInterface } from '@/snippets/SContactTransferDialog/SContactTransferDialog.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import Vue, { PropType } from 'vue'

export interface SCreateAutoDialerParamScopeInterface {
  /** Идентификатор проекта */
  target_project?: unknown & number | undefined;
}
type CreateAutoDialerParam = (scope: SCreateAutoDialerParamScopeInterface) => void

interface Props {
  title: string;
  width: string | number;
  onCancel: () => void;
  onCreate: CreateAutoDialerParam;
}

interface Errors {
  project: string[],
}

interface Data {
  errors: Errors,
  target_project: unknown & ProjectInterface | null,
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'SAutoDialerSetParamsDialog',
  components: { SProjectsAutocomplete },

  mixins: [rules],

  props: {
    onCancel: {
      default: null,
      type: Function
    },

    onCreate: {
      default: null,
      type: Function as PropType<CreateAutoDialerParam>,
      validator (fn: CreateAutoDialerParam) {
        return !!fn
      }
    },

    title: {
      default: '',
      type: String
    },

    width: {
      default: () => '100%',
      type: String
    }
  },

  data (): Data {
    return {
      errors: {
        project: []
      },
      target_project: null
    }
  },
  methods: {

    save () {
      // fsdfds
      console.log('fdsfsd')
      if (!this.target_project) {
        this.errors.project = [this.$tc('This field should not be blank.')]
      }

      if (typeof this.onCreate === 'function') {
        const scope: SCreateAutoDialerParamScopeInterface = {
          target_project: this.target_project?.id
        }

        this.onCreate(scope)
      }
    },

    cancel () {
      if (typeof this.onCancel === 'function') {
        this.onCancel()
      }
    }
  }
})
</script>
