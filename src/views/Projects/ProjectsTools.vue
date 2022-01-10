<template>
  <v-sheet height="100%">
    <v-btn
      small
      tile
      text
    >
      {{ $tc('Add') }}
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component
export default class ProjectsTools extends AppBase {
}
</script>

<style scoped>

</style>
