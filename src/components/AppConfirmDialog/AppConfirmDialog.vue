<template>
  <div>
    <slot
      name="activator"
      :on="{ click: activatorOnClick }"
    />
    <template v-if="dialogComponent">
      <v-dialog
        v-model="dialogVisible"
        max-width="400"
      >
        <component
          :is="dialogComponent"
          :text="text"
          @click:cancel="clickCancel"
          @click:confirm="clickConfirm"
        />
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop } from 'vue-property-decorator'

@Component
export default class AppConfirmDialog extends Vue {
  dialogComponent = null
  dialogVisible = false

  @Prop({ default: () => '', type: String }) text!: string

  @Emit('click:cancel')
  clickCancel () {
    this.dialogVisible = false
    return undefined
  }

  @Emit('click:confirm')
  clickConfirm () {
    this.dialogVisible = false
    return undefined
  }

  private activatorOnClick () {
    this.dialogComponent = () => new Promise((resolve) => {
      return import(/* webpackChunkName: "app-confirm-dialog-template" */ './AppConfirmDialogTemplate.vue')
        .then(resolve)
        .finally(() => (this.dialogVisible = true))
    })
  }
}
</script>
