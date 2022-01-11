<template>
  <v-sheet height="100%">
    <v-btn
      small
      tile
      text
      @click="btnClickAdd"
    >
      {{ $tc('Add') }}
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

@Component
export default class ProjectsTools extends AppBase {
  @Emit('click:add')
  btnClickAdd () {
    return undefined
  }
}
</script>

<style scoped>

</style>
