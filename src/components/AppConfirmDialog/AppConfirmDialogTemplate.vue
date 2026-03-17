<template>
  <v-card>
    <v-card-title>
      {{ $tc('Confirmation request') }}
    </v-card-title>

    <v-card-text class="py-2">
      {{ text }}
    </v-card-text>

    <v-card-text class="py-0">
      <v-divider />
    </v-card-text>

    <v-card-actions class="py-4 px-4">
      <v-spacer />
      <v-btn
        text
        tile
        small
        @click="clickCancel"
      >
        {{ $tc('Cancel') }}
      </v-btn>

      <v-btn
        text
        tile
        small
        @click="clickConfirm"
      >
        {{ $tc('Yes') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';

@Component
export default class AppConfirmDialogTemplate extends Vue {
  @Prop({ default: () => '', type: String }) text!: string

  @Emit('click:cancel')
  clickCancel () {
    return undefined;
  }

  @Emit('click:confirm')
  clickConfirm () {
    return undefined;
  }
}
</script>

<style lang="scss" scoped>

</style>
