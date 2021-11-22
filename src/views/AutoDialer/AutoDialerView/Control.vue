<template>
  <v-sheet>
    <v-btn
      v-if="autodialerStatus === 'ready'"
      outlined
    >
      Start
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'

@Component
export default class Journal extends Base {}
</script>

<style scoped>

</style>
