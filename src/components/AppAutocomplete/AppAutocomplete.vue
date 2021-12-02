<template>
  <v-autocomplete
    v-model="selectedValue"
    :search-input.sync="query"
    :items="options"
    :item-text="itemText"
    :item-value="itemValue"
    :item-color="itemColor"
    :return-object="returnObject"
    :label="label"
    :value="value"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :loading="loading"
    :chips="chips"
    :deletable-chips="deletableChips"
    :small-chips="chips"
    color="primary"
    hide-selected
    outlined
    dense
    @focus="onFocus"
    @click:clear="onClickClear"
  >
    <template
      v-for="(_, slot) of $slots"
      :slot="slot"
    >
      <slot :name="slot" />
    </template>

    <template
      v-for="(_, slot) of $scopedSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit, Watch, ModelSync } from 'vue-property-decorator'

@Component
export default class AppAutocomplete extends Vue {
  @Prop({ default: [] }) readonly options: Record<string, any>
  @Prop({ default: 'text' }) readonly itemText: string
  @Prop({ default: 'value' }) readonly itemValue: string
  @Prop({ default: null }) readonly itemColor?: string
  @Prop({ default: null }) readonly label: string
  @Prop({ default: false }) readonly clearable: boolean
  @Prop({ default: false }) readonly multiple: boolean
  @Prop({ default: false }) readonly disabled: boolean
  @Prop({ default: false }) readonly loading: boolean
  @Prop({ default: false }) readonly returnObject: boolean
  @Prop({ default: false }) readonly chips: boolean
  @Prop({ default: false }) readonly deletableChips: boolean
  @Prop({ default: null }) readonly value: any

  @ModelSync('value', 'change') readonly selectedValue: any

  query = null

  @Watch('query', {})
  onWatchQuery (val?: string) {
    this.onSearch(val)
  }

  @Emit('search')
  onSearch (val: string) {
    return val
  }

  @Emit('focus')
  onFocus (val: string) {
    return val
  }

  @Emit('click:clear')
  onClickClear () {
    this.query = null
  }

  /**
   * @param id
   */
  removeChip (id: number) {
    if (Array.isArray(this.selectedValue)) {
      const index = this.selectedValue.findIndex((e: number) => e === id)
      if (index >= 0) this.selectedValue.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
