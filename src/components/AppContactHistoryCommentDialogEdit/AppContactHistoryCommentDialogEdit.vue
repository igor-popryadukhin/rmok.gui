<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="450"
  >
    <v-card
      tile
      flat
    >
      <v-card-title>
        {{ $tc('Edit comment') }}
      </v-card-title>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-card-text>
          <v-textarea
            v-model="text"
            outlined
          />
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          small
          tile
          text
          @click="$emit('btn:cancel')"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="saveAvailable"
          small
          tile
          text
          @click="onBtnSaveClick"
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
  name: 'AppContactHistoryCommentDialogEdit',

  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: String,
      default: () => null
    }
  },

  data () {
    return {
      oldText: this.value,
      text: this.value,
      dialogVisible: this.visible
    }
  },

  computed: {
    saveAvailable () {
      return !!this.$data.oldText && this.$data.oldText === this.$data.text
    }
  },

  watch: {
    value (val: string) {
      this.statusValue = val
    },
    text (val: string) {
      this.$emit('update', val)
    },
    dialogVisible (val: boolean) {
      this.$emit('update:visible', val)
    }
  },

  methods: {
    onBtnSaveClick () {
      this.$emit('btn:save')
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {}
}
</i18n>
