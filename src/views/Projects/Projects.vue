<template>
  <v-sheet :height="getThisPageHeight">
    <v-sheet height="35">
      <projects-tools />
    </v-sheet>
    <v-divider />
    <v-sheet
      class="overflow-auto"
      style="height: 100%"
    >
      <projects-items @item:actions:click:edit="onProjectEditClick" />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import Project from '@/api/interfaces/Project'
import AppBase from '@/AppBase'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<Projects>({
  components: { ProjectsTools, ProjectsItems },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.projects.length === 0) { vm.$store.dispatch('projects/list/fetch') }
    })
  }
})
export default class Projects extends AppBase {
  get getThisPageHeight () { return this.screenHeight - 110 }
  get projects (): Project[] { return this.$store.getters['projects/list/items'] }

  private onProjectEditClick (id: number) {
    // TODO: Project edit handler
  }
}
</script>

<style scoped>

</style>
