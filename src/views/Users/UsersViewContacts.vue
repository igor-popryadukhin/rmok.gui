<template>
  <v-sheet class="d-flex align-center justify-center fill-height">
    <v-icon
      class="mr-2"
      size="32"
    >
      mdi-contacts
    </v-icon>
    <span class="grey--text">В процессе реализации</span>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import AppPellEditor from '@/components/AppPellEditor/AppPellEditor.vue';
import ProjectsItems from '@/views/Projects/ProjectsItems.vue';
import ProjectsTools from '@/views/Projects/ProjectsTools.vue';
import Component from 'vue-class-component';

// eslint-disable-next-line no-use-before-define
@Component<UsersViewContacts>({
  components: { AppPellEditor, ProjectsTools, ProjectsItems }
})
export default class UsersViewContacts extends AppBase {
  conservationProcess = false

  get name () { return this.$store.getters['projects/view/project_name']; }
  set name (val: string) { this.$store.commit('projects/view/project_name', val); }
  get description () { return this.$store.getters['projects/view/project_description']; }
  set description (val: string) { this.$store.commit('projects/view/project_description', val); }
  get scenario () { return this.$store.getters['projects/view/project_scenario']; }
  set scenario (val: string) { this.$store.commit('projects/view/project_scenario', val); }
}
</script>

<style scoped>

</style>
