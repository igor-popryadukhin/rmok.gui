<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <v-col>
        <v-list>
          <template v-for="(item, key) in projects">
            <v-list-item
              :key="key"
              ripple
              link
              @click.stop="onProjectItemClick(item)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="current_project_id === item.id">
                  {{ $tc('Текущий проект') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider
              v-if="key !== (projects.length -1)"
              :key="`v-divider-${key}`"
            />
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Projects, { ProjectInterface } from '@/api/Projects'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  data () {
    return {
      projects: [] as ProjectInterface[]
    }
  },

  mounted () {
    this.fetchProjects()
  },

  computed: {
    ...mapGetters({
      current_project_id: 'project/id'
    })
  },

  methods: {
    async fetchProjects () {
      new Projects()
        .find()
        .then(response => {
          this.$data.projects = response.data
        })
    },

    /**
     * Происходит, когда пользователь нажимает на элемент списка проектов.
     * @param item
     */
    onProjectItemClick (item: ProjectInterface) {
      new Projects()
        .active(item.id)
        .then(() => {
          this.$toast.success(this.$t('Project {name} activated', { name: item.name }))
          this.$store.dispatch('project/load')
        })
    }
  }
})
</script>

<style scoped>

</style>
