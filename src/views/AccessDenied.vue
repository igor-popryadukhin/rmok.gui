<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <div class="oops">Доступ закрыт</div>
      <div class="not-found">403</div>
      <router-link :to="{ name: 'login' }" class="to-login" replace>Авторизоваться</router-link>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
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
