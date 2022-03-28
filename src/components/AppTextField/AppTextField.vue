<template>
  <div class="app-text-field outline">
    <div
      v-if="prependInnerIcon"
      class="prepend-inner-icon"
    >
      <i :class="prependInnerIcon" />
    </div>
    <input
      v-model="text"
      type="text"
      :placeholder="label"
    >
    <div
      v-if="clearable && !!text"
      class="clearable"
    >
      <button @click="text = null">
        <i class="mdi mdi-close" />
      </button>
    </div>
    <div
      v-else-if="prependAppendIcon"
      class="append-inner-icon"
    >
      <i :class="prependAppendIcon" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, VModel, Watch } from 'vue-property-decorator'

@Component
export default class AppTextField extends Vue {
  text = null

  @Prop({ default: () => null }) readonly label!: string|null
  @Prop({ default: () => null }) readonly prependInnerIcon!: string|null
  @Prop({ default: () => null }) readonly prependAppendIcon!: string|null
  @Prop() readonly clearable!: boolean

  @VModel({ default: () => null }) vModel!: string|null

  @Watch('text')
  textWatch(value: string) {
    this.vModel = value
  }

}
</script>

<style lang="scss" scoped>
.app-text-field {
  display: flex;
  align-items: center;

  height: 28px;
  border: #3a70d4 solid 1px;
  padding:  0 8px 0 8px;

  input:focus {
    outline: none;
  }
}

.clearable {
  display: flex;
}

.append-append-icon {
  display: flex;
  margin-left: 5px;
}

.prepend-inner-icon {
  display: flex;
  margin-right: 5px;
}


</style>
