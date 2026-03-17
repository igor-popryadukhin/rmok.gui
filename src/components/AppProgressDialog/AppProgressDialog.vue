<template>
  <v-dialog
    v-model="visible"
    overlay-opacity="0.3"
    width="300"
  >
    <v-card
      color="primary"
      dark
      tile
    >
      <v-card-text>
        <div style="height: 20px">
          {{ message }}
        </div>
        <v-progress-linear
          v-model="progress"
          :indeterminate="progress === 0"
          height="16"
          color="white"
          class="mb-0"
        >
          <strong
            v-if="progress > 0"
            class="black--text"
          >{{ Math.ceil(progress) }}%</strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

@Component
export default class AppProgressDialog extends Vue {
  @Prop({ default: '' }) readonly message: string
  @Prop({ default: 0 }) readonly progress: number

  visible = true
}
</script>

<style scoped>

</style>
