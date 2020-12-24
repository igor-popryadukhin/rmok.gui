<template>
  <div class="v-toast-container">
    <h4 class="v-toast-title">{{ title }}</h4>
    <div v-if="text">
      {{ text }}
    </div>
    <div v-if="actions.length > 0" style="margin-top: 10px">
      <v-btn
        v-for="(item, key) in actions"
        :key="key"
        x-small
        outlined
        v-bind="item.attrs"
        v-on="item.on"
        @click="$emit('click')"
      >{{ item.attrs.label }}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'VToast',
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => []
    }
  }
})
</script>

<style lang="scss" scoped>
 .v-toast-container {
   padding: 0 !important;
 }

 .v-toast-title {
   font-size: 18px;
   font-weight: 100;
 }
</style>
