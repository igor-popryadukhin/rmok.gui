<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      class="text-center py-16"
    >
      <div class="oops">
        {{ message || 'Oops!' }}
      </div>
      <div class="not-found">
        404
      </div>
      <v-btn
        text
        @click="$router.go(-2)"
      >
        {{ $tc('Go back') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    message: {
      type: String,
      default: () => ''
    }
  }
})
</script>

<style lang="scss" scoped>
 .oops {
   font-size: 32px;
 }

 .not-found {
   color: gray;
   font-size: 20px;
 }
</style>
