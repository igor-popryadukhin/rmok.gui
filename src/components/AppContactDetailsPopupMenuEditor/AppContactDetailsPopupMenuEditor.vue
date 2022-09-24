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
      <v-card-text class="pb-0">
        <v-text-field
          v-model="form.label"
          dense
          outlined
        />
      </v-card-text>

      <v-card-text class="pb-0">
        <v-text-field
          v-model="form.value"
          dense
          outlined
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="isEditable"
          color="primary"
          text
          small
          tile
          @click="clickBtnSave"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop, Watch } from 'vue-property-decorator'

@Component
export default class AppContactDetailsPopupMenuEditor extends Vue {
  @Prop({ type: Number, required: true }) readonly id!: number
  @Prop({ type: String, required: true }) readonly type!: string|null
  @Prop({ type: String, required: true }) readonly label!: string|null
  @Prop({ type: String, required: true }) readonly value!: string|null

  menuVisible = false
  oldForm = ''
  form = {
    id: 0,
    label: '',
    value: ''
  }

  get newFrom () {
    return JSON.stringify(this.form)
  }

  get isEditable() {
    return this.oldForm === this.newFrom
  }

  @Watch('menuVisible')
  private menuVisibleWatch(value: boolean) {
    if (value) {
      this.readProps()
    }
  }

  @Emit('click:btn:save')
  private clickBtnSave () {
    this.menuVisible = false
    return { ...this.form }
  }

  public created () {
    this.readProps()
  }

  private readProps () {
    this.form.id = this.id
    this.form.label = this.label
    this.form.value = this.value

    this.oldForm = JSON.stringify(this.form)
  }
}
</script>

<style scoped>

</style>
