<template>
  <v-sheet
    height="100%"
  >
    <div class="d-flex align-center justify-center fill-height">
      Statuses
    </div>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ProjectsViewStatuses>({
  components: { ProjectsTools, ProjectsItems }
})
export default class ProjectsViewStatuses extends AppBase {}
</script>

<style scoped>

</style>
