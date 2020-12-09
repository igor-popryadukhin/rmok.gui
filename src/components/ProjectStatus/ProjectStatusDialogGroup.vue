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
          mode=""
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
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#FF0000BB'
    },
    value: Boolean
  },

  data () {
    return {
      dialogVisible: false,
      dName: '',
      dColor: '#FF0000BB'
    }
  },

  watch: {
    name (val: string) {
      this.dName = val
    },

    color (val: string) {
      this.dColor = val
    },

    value (val: boolean) {
      this.dialogVisible = val
    },

    dialogVisible (val) {
      this.$emit('change', val)
    }
  },

  computed: {
    ruleNotBlank () {
      return (value: string) => !!value || this.$tc('This field should not be blank.')
    }
  },

  methods: {
    save (name: string, color = '#000000') {
      if (!this.$refs.textFieldName.validate()) {
        return
      }
      this.$emit('save-click', { name, color })
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
