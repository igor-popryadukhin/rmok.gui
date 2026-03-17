<template>
  <v-app v-if="bootstrapProcess">
    <v-main>
      <v-container
        class="d-flex align-center fill-height justify-center"
        fluid
      >
        <div style="max-width: 450px">
          <app-loading message="Loading..." />
        </div>
      </v-container>
    </v-main>
  </v-app>
  <component
    :is="layout"
    v-else
    :key="2"
    tabindex="-1"
  />
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import Component from 'vue-class-component';

@Component({
  components: { AppLoading }
})
export default class App extends AppBase {
  get layout () {
    return this.$route.meta.layout || 'clean';
  }

  get bootstrapProcess (): boolean {
    return this.$store.getters['bootstrap_process'];
  }
}
</script>

<style lang="scss">
</style>
