<template>
  <DialogCard
    :title="title"
    :actions="actions"
  >
    <v-textarea
      v-model="dataText"
      outlined
    >
    </v-textarea>
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    text: {
      type: String,
      default: ''
    },
    saveTitle: {
      type: String,
      default: 'Save'
    },
    cancelTitle: {
      type: String,
      default: 'Cancel'
    },
    onSave: {
      type: Function,
      default: null
    },
    onCancel: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      dataText: ''
    }
  },

  computed: {
    actions () {
      return {
        cancel: {
          flat: true,
          text: this.cancelTitle,
          handle: () => {
            if (this.onCancel) {
              (this.onCancel as () => void)()
            }
          }
        },

        save: {
          flat: true,
          text: this.saveTitle,
          handle: () => {
            if (typeof this.onSave === 'function') {
              this.onSave(this.dataText)
            }
          }
        }
      }
    }
  },

  created () {
    this.dataText = this.text
  }

})
</script>

<style lang="scss">
</style>
