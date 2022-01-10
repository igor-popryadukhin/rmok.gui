<template>
  <v-sheet height="100%">
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
  </v-sheet>
</template>

<script lang="ts">
import ContactsViewBase from './ContactsViewBase'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component
export default class ContactsViewScenario extends ContactsViewBase {
  get contactScenarioContent (): string { return this.$store.getters['contacts/view/contact_scenario_content'] }
  get contactProjectScenario (): string { return this.$store.getters['contacts/view/contact_project_scenario'] }

  get scenario () {
    return this.contactScenarioContent || this.contactProjectScenario
  }
}

</script>

<style lang="scss" scoped>

</style>
