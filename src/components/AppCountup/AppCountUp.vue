<template>
  <div>
    <slot name="before" />
    <span ref="countUpSpan" />
    <slot name="after" />
  </div>
</template>

<script lang="ts">
import { CountUp } from 'countup.js';
import { CountUpOptions } from 'countup.js/src/countUp';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Ref, Watch } from 'vue-property-decorator';
// See: https://github.com/inorganik/CountUp.js

@Component
export default class AppCountUp extends Vue {
  @Prop({ default: () => 1 }) readonly delay!: number
  @Prop({
    default: () => 1,
    required: true
  }) readonly endVal!: number
  @Prop({
    default: (): CountUpOptions => {
      return {
        useEasing: true,
        useGrouping: true,
        separator: ' ',
        decimal: '.',
        prefix: '',
        suffix: '',
        duration: 1
      };
    }
  }) readonly options!: CountUpOptions
  @Ref('countUpSpan') readonly countUpSpan: HTMLSpanElement

  instance = null as null | CountUp

  @Watch('endVal')
  endValWatch (value: number) {
    if (this.instance && typeof this.instance.update === 'function') {
      this.instance.update(value);
    }
  }

  public mounted () {
    this.create();
  }

  public beforeDestroy () {
    this.destroy();
  }

  private create () {
    if (this.instance) {
      return;
    }
    const instance = new CountUp(
      this.countUpSpan,
      this.endVal,
      this.options
    );
    if (instance.error) {
      // error
      return;
    }

    this.instance = instance;
    if (this.delay < 0) {
      this.$emit('ready', instance, CountUp);
      return;
    }
    setTimeout(() => instance.start(() => this.$emit('ready', instance, CountUp)), this.delay);
  }

  private destroy () {
    this.instance = null;
  }

  private start (callback?: (args?: any) => any) {
    if (this.instance && typeof this.instance.start === 'function') {
      return this.instance.start(callback);
    }
  }

  private pauseResume () {
    if (this.instance && typeof this.instance.pauseResume === 'function') {
      return this.instance.pauseResume();
    }
  }

  private reset () {
    if (this.instance && typeof this.instance.reset === 'function') {
      return this.instance.reset();
    }
  }

  private update (newEndVal: string | number) {
    if (this.instance && typeof this.instance.update === 'function') {
      return this.instance.update(newEndVal);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
