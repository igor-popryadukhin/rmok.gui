<template>
  <v-btn-toggle
    v-model="itemValue"
    class="ma-0"
    group
    dense
  >
    <template v-for="(item, key) in items">
      <slot
        name="item"
        :item="item"
      >
        <template v-if="item.tooltip">
          <v-tooltip
            :open-delay="1000"
            :close-delay="1000"
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                :key="key"
                :value="item.value"
                class="ma-0"
                small
                v-on="on"
              >
                {{ item.title }}
              </v-btn>
            </template>
            <span v-if="item.tooltip">{{ item.tooltip }}</span>
          </v-tooltip>
        </template>
        <template v-else>
          <v-btn
            :key="key"
            :value="item.value"
            class="ma-0"
            small
          >
            {{ item.title }}
          </v-btn>
        </template>
      </slot>
    </template>
    <slot name="item-append" />
  </v-btn-toggle>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, ModelSync } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component
export default class AppBtnToggleDate extends Vue {
  @Prop({ required: true, default: () => [] }) readonly items: Array<Record<string, unknown>>

  @ModelSync('value', 'change', {
    type: [String, Number],
    required: false,
    default: null
  })
  itemValue: string | number
}
</script>

<style scoped>

</style>
