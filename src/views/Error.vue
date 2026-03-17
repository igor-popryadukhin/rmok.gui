<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <div class="oops">
        Ошибка
      </div>
      <div class="not-found">
        500
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Error extends Vue {}
</script>

<style lang="scss" scoped>
 .oops {
   font-size: 32px;
 }

 .not-found {
   color: gray;
   font-size: 20px;
 }
</style>
