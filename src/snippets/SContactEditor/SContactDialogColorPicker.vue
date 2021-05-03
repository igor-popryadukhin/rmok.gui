<template>
  <v-card>
    <v-card-text class="px-0 pt-10">
      <v-color-picker
        v-model="color"
        swatches-max-height="300"
        width="100%"
        show-swatches
        hide-canvas
        hide-inputs
        hide-sliders
        @input="onOkClick"
      ></v-color-picker>
    </v-card-text>
    <v-card-actions class="d-flex justify-end px-4 py-4">
      <v-btn
        text
        tile
        small
        @click="onCancelClick"
      >
        {{ $tc('Cancel') }}
      </v-btn>
      <v-btn
        text
        tile
        small
        @click="onOkClick"
      >
        {{ $tc('OK') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface EventInterface {
  ok: () => void;
  cancel: () => void;
}

export default Vue.extend({
  computed: {
    locationAddress () {
      const stack = []
      if (this.location.data.region) {
        stack.push(this.location.data.region)
      }
      if (this.location.data.city) {
        stack.push(this.location.data.city)
      }
      if (this.location.data.address) {
        stack.push(this.location.data.address)
      }

      if (stack.length === 0) {
        stack.push('Местоположение не определено')
      }

      return stack.join(', ')
    }
  },

  data () {
    return {
      color: '#FF00FF'
    }
  },

  methods: {
    onCancelClick () {
      if (typeof this.on.cancel !== 'function') {
        throw new Error('The handler function is not defined!')
      }

      this.on.cancel()
    },

    onOkClick () {
      if (typeof this.on.ok !== 'function') {
        throw new Error('The handler function is not defined!')
      }
      this.on.ok(this.color)
    }
  },

  name: 'SContactDialogColorPicker',

  props: {
    on: {
      default: null,
      type: Object as PropType<EventInterface>
    },

    value: {
      default: () => null,
      type: String
    }
  }
})
</script>
