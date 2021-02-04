<template>
  <div>
    <v-tabs
      v-model="tab"
    >
      <v-tab :to="{ name: 'administrator_users_new_main' }">{{ $tc('Base information') }}</v-tab>
    </v-tabs>

    <router-view />

  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({ data () { return { tab: 0 } } })
</script>

<style lang="scss" scoped>

</style>
