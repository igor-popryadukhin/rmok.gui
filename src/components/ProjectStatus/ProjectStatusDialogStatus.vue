<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="350"
  >
    <v-card>
      <v-card-text class="pt-5">
        <v-text-field
          v-model="status.name"
          :tabindex="0"
          autofocus
          :label="$tc('Status name')"
          @keyup.enter="save(status.name)"
        ></v-text-field>

        <v-combobox
          v-model="status.action"
          :items="actions"
          :label="$tc('На событие')"
        >
          <template v-slot:selection="scope">
            {{ $tc(scope.item) }}
          </template>
          <template v-slot:item="scope">
            {{ $tc(scope.item) }}
          </template>
        </v-combobox>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="red darken-1"
          text
          @click="dialogVisible = false"
        >
          {{ $tc('Cancel') }}
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="save(status)"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { StatusInterface } from './ProjectStatus.vue'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => []
    },
    value: Boolean
  },

  data () {
    return {
      dialogVisible: false,
      status: {
        name: '',
        action: ''
      } as StatusInterface
    }
  },

  watch: {
    name (val: string) {
      this.status.name = val
    },

    value (val: boolean) {
      this.dialogVisible = val
    },

    dialogVisible (val) {
      this.$emit('change', val)
    }
  },

  methods: {
    save (status: StatusInterface) {
      this.$emit('save-click', status)
      this.dialogVisible = false
      this.formReset()
    },

    formReset () {
      this.status.name = ''
      this.status.action = ''
    }
  }
})
</script>

<style lang="scss" scoped>
 .border {

   &-solid {
     border-color: #8d3eb1;
     border-style: solid;
     border-width: 1px !important;
   }

   &-dashed {
     border-color: #8d3eb1;
     border-style: dashed;
     border-width: 1px !important;
   }
 }
</style>
