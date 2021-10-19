<template>
  <v-row
    class="fill-height"
    align-content="center"
    justify="center"
  >
    <v-col
      class="text-subtitle-1 text-center"
      cols="12"
    >
      {{ $tc('Loading content...') }}
    </v-col>
    <v-col cols="6">
      <v-progress-linear
        :color="$vuetify.theme.currentTheme.primary"
        indeterminate
        rounded
        height="6"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppLoading'
})
</script>

<style scoped>

</style>
