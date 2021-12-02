<template>
  <v-simple-table
    v-bind="vSimpleTableAttrs"
    class="app-table"
    fixed-header
    dense
  >
    <template #default>
      <thead>
        <slot name="head" />
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppTable extends Vue {
  @Prop({ default: 0 }) readonly height?: number
  @Prop({ default: false }) readonly outlined: boolean
  @Prop({ default: false }) readonly dense: boolean
  @Prop({ default: false }) readonly fixedHeader: boolean

  get vSheetAttrs () {
    const attrs: Record<string, string|number|boolean|object> = {
      outlined: this.outlined
    }

    if (this.height) {
      attrs.height = this.height
    }

    return attrs
  }

  get vSimpleTableAttrs () {
    const attrs: Record<string, string|number|boolean|object> = {
      dense: this.dense,
      fixedHeader: this.fixedHeader
    }

    if (this.height) {
      attrs.height = this.height - 2
    }

    return attrs
  }
}
</script>

<style lang="scss" scoped>
/* width */
.app-table {
  & table {
    &::-webkit-scrollbar {
      width: 12px !important;
      height: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #e8e7e7;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #11659d !important;
      height: 10px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #a5a5a5;
    }
  }
}

</style>
