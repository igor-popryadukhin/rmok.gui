<template>
  <v-sheet class="d-flex align-center justify-center fill-height">
    <div class="text-center" />
  </v-sheet>
</template>
<script lang="ts">
import AppBase from '@/AppBase';
import { generateUUID } from '@/utils/utils';
import { AxiosResponse } from 'axios';

import Component from 'vue-class-component';

@Component
export default class Home extends AppBase {
  private test () {
    this.$toast.info('Message');
  }
}
</script>
