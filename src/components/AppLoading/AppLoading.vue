<template>
  <div
    class="app-loading--wrap"
  >
    <div style="width: 250px">
      <app-spinner-fading-circle :size="45" />
    </div>
    <div class="message">
      {{ $tc(message) }}
    </div>
  </div>
</template>

<script lang="ts">
import AppSpinnerFadingCircle from '@/components/AppSpinner/AppSpinnerFadingCircle.vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: { AppSpinnerFadingCircle }
})
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
