<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    offset-x
    nudge-width="280"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
    </template>

    <v-card>
      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          small
          tile
          @click="clickBtnOk"
        >
          {{ btnConfirmTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop } from 'vue-property-decorator'

@Component
export default class AppPopupMenu extends Vue {
  @Prop({ type: String, default: () => 'Ok' }) readonly btnConfirmTitle!: string

  menuVisible = false

  @Emit('click:btn:ok')
  clickBtnOk () {
    this.menuVisible = false
    return
  }
}
</script>

<style scoped>

</style>
