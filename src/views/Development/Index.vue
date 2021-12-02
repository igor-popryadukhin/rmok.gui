<template>
  <v-sheet>
    <v-text-field
      v-model="debugNamespace"
      clearable
      outlined
    />
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import { Watch } from 'vue-property-decorator'

@Component
export default class AutoDialerView extends Base {
  get debugNamespace () {
    return window.localStorage.getItem('debug')
  }

  set debugNamespace (val: string) {
    window.localStorage.setItem('debug', val)
  }

  @Watch('debugNamespace')
  debugNamespaceWatch (val: string) {
    if (!val) {
      window.localStorage.removeItem('debug')
    }
  }
}
</script>

<style scoped>

</style>
