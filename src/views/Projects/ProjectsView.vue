<template>
  <v-sheet :height="getThisPageHeight">
    <v-sheet
      class="d-flex flex-nowrap grow"
      height="35"
    >
      <v-tabs
        height="35"
        hide-slider
        show-arrows
      >
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab
            :key="`v-tab-${tabIndex}`"
            :to="tab.to"
          >
            {{ tab.title }}
          </v-tab>
          <v-divider
            v-if="tabIndex < tabs.length -1"
            :key="`v-divider-${tabIndex}`"
            vertical
          />
        </template>
      </v-tabs>
    </v-sheet>

    <app-divider class="my-1" />

    <v-sheet
      height="100%"
      class="overflow-auto"
    >
      <template v-if="fetching">
        <div class="d-flex align-center justify-center fill-height">
          <app-loading />
        </div>
      </template>
      <template v-else>
        <keep-alive>
          <router-view />
        </keep-alive>
      </template>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ProjectsView>({
  components: { AppLoading, ProjectsTools, ProjectsItems },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('projects/view/fetch')
    })
  }
})
export default class ProjectsView extends AppBase {
  get getThisPageHeight () { return this.screenHeight - 118 }
  get fetching () { return this.$store.getters['projects/view/fetching'] }
  get tabs () {
    return [
      {
        title: 'Подробности',
        to: {
          name: 'projects_view_main'
        }
      },
      {
        title: 'Люди',
        to: {
          name: 'projects_view_people'
        }
      },
      {
        title: 'Статусы',
        to: {
          name: 'projects_view_statuses'
        }
      }
    ]
  }

  public beforeDestroy () {
    this.$store.dispatch('projects/view/flush')
  }
}
</script>

<style scoped>

</style>
