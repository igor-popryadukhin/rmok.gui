<template>
  <div>
    <DialogCard
      ref="card"
      :title="title"
      :actions="actions"
      :handler="handlerClick"
      :title-class="titleClass"
    >
      <v-textarea
        ref="input"
        v-model="editedValue"
        :rules="rules"
        :label="text"
        v-bind="textField"
        rows="4"
        @keyup.enter.stop="onEnter"
      />
    </DialogCard>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
  layout: 'default',
  props: {
    actions: [Object],
    autofocus: {
      default: true,
      type: Boolean
    },
    rules: Array,
    textField: Object,
    title: String,
    titleClass: [String, Object],
    value: String
  },
  data () {
    return {
      editedValue: this.value
    }
  },
  mounted () {
    if (this.autofocus) {
      setTimeout(() => {
        this.$refs.input.focus()
      }, 100)
    }
  },
  methods: {
    handlerClick (res, action) {
      if (!action.key) {
        this.$emit('submit', action.key)
      }
      const valid = this.rules ? this.$refs.input.validate() : true
      if (!valid) {
        this.$refs.input.focus()
        return false
      }
      this.$emit('submit', action.key ? this.editedValue : action.key)
    },
    onEnter () {
      this.$refs.card.$refs.actions.trigger(true)
    }
  }
})
</script>
