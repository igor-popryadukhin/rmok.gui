<template>
  <v-tooltip
    :bottom="bottom"
    :activator="activator"
    open-delay="1200"
    close-delay="500"
    max-width="300"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
    </template>
    <slot />
  </v-tooltip>
</template>

<script lang="ts">
import Vue, { PropType, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class AppTooltip extends Vue {
  @Prop({ default: () => true }) readonly bottom!: boolean
  @Prop({
    default: null as unknown as PropType<string | HTMLElement | VNode | Element | null>,
    validator: (val: string | object) => {
      return ['string', 'object'].includes(typeof val);
    }
  }) readonly activator!: string | HTMLElement | VNode | Element | null
}
</script>

<style scoped>

</style>
