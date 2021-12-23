<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Main information') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :loading="processApply"
          tile
          outlined
          small
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
        <v-btn
          :loading="processDelete"
          tile
          outlined
          small
          @click="onBtnDeleteClick"
        >
          {{ $tc('Delete') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider />

    <template v-if="processLoading">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-text-field
        v-model="scenarioName"
        :label="$tc('Scenario name')"
        :rules="[rules.notBlank, rules.lengthMax(255), rules.lengthMin(1)]"
        required
      />

      <h3 class="grey--text mb-1">
        {{ $tc('Scenario') }}
      </h3>
      <app-wysiwyg
        ref="wysiwyg"
        v-model="scenarioText"
      />
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import Vue from 'vue'
import AppWysiwyg from '@/components/AppWysiwyg/AppWysiwyg.vue'
import rules from '@/mixins/rules'

@Component({
  components: { AppLoading, AppWysiwyg },
  mixins: [rules]
})
export default class ScenariosEdit extends Vue {
  processApply = false;
  processDelete = false;
  processLoading = true;

  get scenarioName (): string { return this.$store.state.scenarios.view.name }
  set scenarioName (val: string) { this.$store.commit('scenarios/view/name', val) }

  get scenarioText (): string { return this.$store.state.scenarios.view.scenario }
  set scenarioText (val: string) { this.$store.commit('scenarios/view/scenario', val) }

  mounted () {
    this.$store
      .dispatch('scenarios/view/fetch', this.$route.params.id)
      .finally(() => (this.processLoading = false))
  }

  /**
   * Редактируем сценарий
   */
  onBtnSaveClick () {
    this.processApply = true
    this.$store.dispatch('scenarios/view/apply')
      .then(() => {
        this.$toast.success('Changes accepted')
        this.$router.back()
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      }).finally(() => (this.processApply = false))
  }

  /**
   * Удаляем сценарий
   */
  onBtnDeleteClick () {
    this.processDelete = true
    this.$store.dispatch('scenarios/view/delete')
      .then(() => {
        this.$toast.success('Scenario deleted')
        this.$router.back()
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      }).finally(() => (this.processDelete = false))
  }
}
</script>

<style scoped>

</style>
