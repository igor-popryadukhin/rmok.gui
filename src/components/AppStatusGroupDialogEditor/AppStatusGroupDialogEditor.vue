<template>
  <v-card>
    <v-card-text class="pt-5">
      <v-text-field
        ref="textFieldName"
        v-model="dName"
        label="Название группы"
        :rules="[ruleNotBlank, ruleMaxLength]"
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
        v-for="({ attrs, on }, key) in actions"
        v-bind="attrs"
        v-on="on"
        :key="key"
        text
        tile
        @click="onBtnClick(attrs.value || attrs, $event)"
      >
        {{ attrs.text || `Button-${key+1}` }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppStatusGroupDialogEditor',

  props: {

    color: {
      default: () => getRandomColor(),
      type: String
    },

    name: {
      default: '',
      type: String
    },

    actions: [Object],
    handlers: Function
  },

  data () {
    return {
      dColor: getRandomColor(),
      dName: ''
    }
  },

  watch: {
    color (val: string) {
      this.dColor = val
    },

    name (val: string) {
      this.dName = val
    }
  },

  computed: {
    ruleNotBlank () {
      return (value: string) => !!value || this.$tc('This field should not be blank.')
    },
    ruleMaxLength () {
      return (value: string) => (value?.length || 0) < 255 || this.$tc('rule_max_dynamic_length', value.length)
    }
  },

  mounted () {
    this.dName = this.name
    this.dColor = this.color
  },

  methods: {
    formReset () {
      this.dName = ''
      this.dColor = getRandomColor()
    },

    onBtnClick (value: any, event: Event) {
      if (typeof this.handlers !== 'function' || !(this as any).$refs.textFieldName.validate(true)) {
        return
      }

      this.handlers({
        name: this.dName,
        color: this.dColor
      }, value, event)
      this.formReset()
    }
  }
})

function getRandomColor (): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
</script>

<style lang="scss" scoped>

</style>
