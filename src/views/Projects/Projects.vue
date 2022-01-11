<template>
  <v-sheet class="projects-page">
    <v-sheet class="projects-page__tabs">
      <projects-tools @click:add="onToolsBtnClickAdd" />
    </v-sheet>
    <v-divider />
    <v-sheet class="projects-page__list">
      <projects-items />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Project from '@/api/interfaces/Project'
import StatusGroup from '@/api/interfaces/StatusGroup'
import Roles from '@/api/Roles'
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
  get projects (): Project[] { return this.$store.getters['projects/list/items'] }

  public beforeDestroy () {
    this.$store.dispatch('projects/list/flush')
  }

  private onToolsBtnClickAdd () {
    this.$dialog.prompt({
      title: this.$tc('Creating a new project'),
      text: this.$tc('Name'),
      actions: {
        false: this.$tc('Cancel'),
        true: this.$tc('Create')
      }
    }).then((value?: string) => {
      if (value) {
        this.$axios.post('/projects', {
          name: value
        }).then((response) => {
          if (response.status !== 201) {
            throw new APIError(response.data)
          }
          this.$toast.success('Project created')
          debugger
          this.$router.push({
            name: 'projects_view',
            params: {
              id: response.data.id
            }
          })
        }).catch((reason) => {
          if (reason instanceof APIError) {
            reason.errors.forEach((e) => {
              this.$toast.error(e.message)
            })
          } else {
            this.$toast.error(reason.message)
          }
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.projects-page {
  height: 100%;
}

.projects-page__tabs {
  height: 35px;
}

.projects-page__list {
  height: calc(100% - 35px);
  height: -moz-calc(100% - 35px);
  height: -webkit-calc(100% - 35px);

  overflow: auto;
}
</style>
