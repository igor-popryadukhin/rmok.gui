<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="350"
  >
    <v-card>
      <v-card-text class="pt-5">
        <v-text-field
          v-model="dName"
          :tabindex="0"
          autofocus
          label="Наименование статуса"
          @keyup.enter="save(dName)"
        ></v-text-field>
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
          @click="save(dName)"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

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
    value: Boolean
  },

  data () {
    return {
      dialogVisible: false,
      dName: ''
    }
  },

  watch: {
    name (val: string) {
      this.dName = val
    },

    value (val: boolean) {
      this.dialogVisible = val
    },

    dialogVisible (val) {
      this.$emit('change', val)
    }
  },

  methods: {
    save (name: string) {
      this.$emit('save-click', name)
      this.dialogVisible = false
      this.formReset()
    },

    formReset () {
      this.dName = ''
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
