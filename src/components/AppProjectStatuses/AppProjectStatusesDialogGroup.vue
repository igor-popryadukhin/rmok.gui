<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="350"
  >
    <v-card>
      <v-card-text class="pt-5">
        <v-text-field
          ref="textFieldName"
          v-model="dName"
          label="Название группы"
          :rules="[ruleNotBlank]"
        ></v-text-field>
        <v-color-picker
          v-model="dColor"
          mode="rgba"
          class="ma-2"
          hide-inputs
        ></v-color-picker>
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
          @click="save(dName, dColor)"
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
  name: 'AppProjectStatusesDialogGroup',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    color: {
      default: () => '#FF0000BB',
      type: String
    },
    name: {
      default: '',
      type: String
    },
    value: Boolean
  },

  data () {
    return {
      dColor: '#FF0000BB',
      dName: '',
      dialogVisible: false
    }
  },

  watch: {
    color (val: string) {
      this.dColor = val
    },

    dialogVisible (val) {
      this.$emit('change', val)
    },

    name (val: string) {
      this.dName = val
    },

    value (val: boolean) {
      this.dialogVisible = val
    }
  },

  computed: {
    ruleNotBlank () {
      return (value: string) => !!value || this.$tc('This field should not be blank.')
    }
  },

  methods: {
    formReset () {
      this.dName = ''
    },

    save (name: string, color = '#000000') {
      if (!this.$refs.textFieldName.validate()) {
        return
      }
      this.$emit('save-click', { color, name })
      this.dialogVisible = false
      this.formReset()
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
