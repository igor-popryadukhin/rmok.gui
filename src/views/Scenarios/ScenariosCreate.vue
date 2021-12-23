<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Scenario new') }}
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
      </template>
    </app-tools>

    <v-divider />

    <template v-if="processApply">
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
import rules from '@/mixins/rules'
import Vue from 'vue'
import AppWysiwyg from '@/components/AppWysiwyg/AppWysiwyg.vue'

@Component({
  components: { AppLoading, AppWysiwyg },
  mixins: [rules]
})
export default class ScenariosCreate extends Vue {
  processApply = false;

  get scenarioName (): string { return this.$store.state.scenarios.create.name }
  set scenarioName (val: string) { this.$store.commit('scenarios/create/name', val) }

  get scenarioText (): string { return this.$store.state.scenarios.create.scenario }
  set scenarioText (val: string) { this.$store.commit('scenarios/create/scenario', val) }

  onBtnSaveClick () {
    this.processApply = true
    this.$store.dispatch('scenarios/create/apply')
      .then(() => {
        this.$toast.success('Scenario created')
        this.$router.back()
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      }).finally(() => (this.processApply = false))
  }
}
</script>

<style scoped>

</style>
