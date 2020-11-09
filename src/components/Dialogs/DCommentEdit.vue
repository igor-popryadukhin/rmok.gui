<template>
  <DialogCard
    :title="title"
    :actions="actions"
  >
    <v-textarea
      v-model="text"
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
    comment: {
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
      text: '' as string
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
              this.onCancel()
            }
          }
        },

        save: {
          flat: true,
          text: this.saveTitle,
          handle: () => {
            if (this.onSave) {
              this.onSave(this.text)
            }
          }
        }
      }
    }
  },

  created () {
    this.text = this.comment
  }

})
</script>

<style lang="scss">
</style>
