<template>
  <v-container class="pa-0">
    <v-list>
      <template
        v-for="(item, itemIndex) in projects"
      >
        <v-list-item
          :key="`project-${itemIndex}`"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.comment }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`divider-${itemIndex}`" />
      </template>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectInterface, ProjectResponseItemsInterface, Projects } from '@/api/Projects'

export default Vue.extend({
  data () {
    return {
      projects: [] as ProjectInterface[]
    }
  },

  created () {
    new Projects()
      .find()
      .then((response: ProjectResponseItemsInterface) => {
        this.projects = response.items
      })
  }
})
</script>

<style scoped>

</style>
