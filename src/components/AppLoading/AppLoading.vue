<template>
  <div
    class="app-loading--wrap"
  >
    <div class="message">
      {{ $tc(message) }}
    </div>
    <div style="width: 250px">
      <v-progress-linear
        :color="$vuetify.theme.currentTheme.primary"
        indeterminate
        height="6"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppLoading extends Vue {
  @Prop({ default: 'Loading content...' }) readonly message: string
}
</script>

<style lang="scss" scoped>

.app-loading--wrap {
  padding: 0px;

  align-items: center;
  flex-direction: column;
  display: flex;

  & .message {
    color: #5f6060;
    margin-bottom: 5px;
  }
}
</style>
