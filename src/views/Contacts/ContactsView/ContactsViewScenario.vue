<template>
  <div
    class="fill-height overflow-auto"
    style="max-width: 850px"
  >
    <template v-if="scenario">
      <div
        v-html="scenario"
      />
    </template>
    <template v-else>
      <div class="d-flex align-center justify-center fill-height">
        <v-icon class="mr-2">
          mdi-script-text-outline
        </v-icon>
        Сценарий не установлен
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import Component from 'vue-class-component';

@Component
export default class ContactsViewScenario extends AppBase {
  get scenario (): string { return this.$store.getters['contacts/view/contact_project_scenario']; }
}

</script>

<style lang="scss" scoped>

</style>
