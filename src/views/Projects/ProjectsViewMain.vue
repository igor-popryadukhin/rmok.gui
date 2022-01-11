<template>
  <v-sheet>
    <v-container
      class="mt-5"
      style="max-width: 768px"
    >
      <div class="mb-3">
        <v-text-field
          v-model="name"
          :label="$tc('Project name')"
          dense
          outlined
          flat
        />
      </div>

      <div class="mb-3">
        <v-textarea
          v-model="description"
          :label="$tc('Description')"
          dense
          outlined
          flat
        />
      </div>

      <div class="mb-4">
        <h4 class="grey--text mb-1">
          {{ $tc('Scenario') }}
        </h4>
        <app-pell-editor
          v-model="scenario"
          :height="500"
        />
      </div>

      <div class="mb-3">
        <v-btn
          :loading="conservationProcess"
          tile
          text
          outlined
          @click="projectSave"
        >
          {{ $tc('Save change') }}
        </v-btn>
      </div>

      <div class="mb-16" />
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import AppBase from '@/AppBase'
import AppPellEditor from '@/components/AppPellEditor/AppPellEditor.vue'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ProjectsViewMain>({
  components: { AppPellEditor, ProjectsTools, ProjectsItems }
})
export default class ProjectsViewMain extends AppBase {
  conservationProcess = false

  get name () { return this.$store.getters['projects/view/project_name'] }
  set name (val: string) { this.$store.commit('projects/view/project_name', val) }
  get description () { return this.$store.getters['projects/view/project_description'] }
  set description (val: string) { this.$store.commit('projects/view/project_description', val) }
  get scenario () { return this.$store.getters['projects/view/project_scenario'] }
  set scenario (val: string) { this.$store.commit('projects/view/project_scenario', val) }

  private projectSave () {
    this.conservationProcess = true
    this.$axios.patch(`/projects/${this.$route.params.id}`, {
      name: this.name,
      description: this.description,
      scenario: this.scenario
    }).then((response) => {
      if (response.status !== 200) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason) => {
      if (reason instanceof APIError) {
        reason.errors.forEach((e) => {
          this.$toast.error(e.message)
        })
      } else {
        this.$toast.error(reason.message)
      }
    }).finally(() => (this.conservationProcess = false))
  }
}
</script>

<style scoped>

</style>
