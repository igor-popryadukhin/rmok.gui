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
import Projects, { ProjectInterface } from '@/api/Projects'

export default Vue.extend({
  data () {
    return {
      projects: [] as unknown as ProjectInterface[]
    }
  },

  created () {
    new Projects()
      .find<{count: number}, ProjectInterface[]>()
      .then((response) => {
        this.projects = response.data
      })
  }
})
</script>

<style scoped>

</style>
