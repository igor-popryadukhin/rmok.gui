<template>
  <DialogCard
    :title="title"
    :actions="actions"
  >
    <v-textarea
      v-model="dataText"
      outlined
    />
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

  props: {
    cancelTitle: {
      default: 'Cancel',
      type: String
    },
    onCancel: {
      default: null,
      type: Function
    },
    onSave: {
      default: null,
      type: Function
    },
    saveTitle: {
      default: 'Save',
      type: String
    },
    text: {
      default: '',
      type: String
    },
    title: {
      default: 'Title',
      type: String
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
          handle: () => {
            if (this.onCancel) {
              (this.onCancel as () => void)()
            }
          },
          text: this.cancelTitle
        },

        save: {
          flat: true,
          handle: () => {
            if (typeof this.onSave === 'function') {
              this.onSave(this.dataText)
            }
          },
          text: this.saveTitle
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
