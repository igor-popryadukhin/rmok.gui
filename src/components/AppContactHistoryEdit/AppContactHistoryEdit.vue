<template>
  <v-card
    tile
    flat
  >
    <v-card-title>Edit</v-card-title>
    <div class="px-4">
      <v-select
        v-model="innerStatusId"
        :items="statuses"
        item-value="id"
        item-text="name"
        item-color="color"
        outlined
        dense
      />
    </div>
    <div class="px-4">
      <v-textarea
        v-model="innerComment"
        outlined
        dense
      />
    </div>
    <v-divider class="mx-4" />
    <div class="d-flex pa-4">
      <v-spacer />
      <v-btn
        class="mr-2"
        text
        tile
        small
        @click="clickBtnCancel"
      >
        {{ $tc('Cancel') }}
      </v-btn>
      <v-btn
        text
        tile
        small
        @click="clickBtnSave"
      >
        {{ $tc('Save') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop } from 'vue-property-decorator'

@Component
export default class AppContactHistoryEdit extends Vue {
  @Prop({ default: () => [] }) readonly statuses!: Array<Record<string, unknown>>
  @Prop({ default: () => 0 }) readonly statusId!: number
  @Prop({ default: () => '' }) readonly comment!: string

  innerStatusId = 0
  innerComment = null

  @Emit('click:btn:save')
  clickBtnSave () {
    return {
      status_id: this.innerStatusId,
      comment: this.innerComment
    }
  }

  @Emit('click:btn:cancel')
  clickBtnCancel () {
    return undefined
  }

  mounted () {
    this.innerStatusId = this.statusId
    this.innerComment = this.comment
  }
}
</script>

<style lang="scss" scoped>

</style>
