<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        xl="4"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="project"
          :label="$tc('User current project')"
          visible-icon
          clearable
          @select="onSelect"
          @clear="onSelect"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import VInterface from '@/VInterface'
import { UserInterface, Users } from '@/api/Users'
import { ProjectInterface } from '@/api/Projects'

interface IData {
  project: ProjectInterface;
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  mixins: [rules],

  components: {
    SProjectsAutocomplete
  },

  data (): IData {
    return {
      project: null
    }
  },

  beforeRouteEnter (to, from, next) {
    new Users()
      .getById(+to.params.user_id)
      .then((response: UserInterface) => {
        next((vm: VInnerInterface) => {
          if (response.project) {
            vm.$refs.sProjectsAutocomplete.setDefault(response.project.id)
          }

          if (response.organization) {
            vm.$refs.sProjectsAutocomplete.fetchData({
              organization_id: response.organization.id
            })
          }
        })
      })
  },

  methods: {
    onSelect (data) {
      if (data) {
        new Users()
          .update(+this.$route.params.user_id, {
            project_id: data.id
          }).then(() => {
            this.$toast.success(this.$tc('Changes accepted'))
          }).catch((e) => {
            if ('errors' in e) {
              if (Array.isArray(e.errors)) {
                for (const error of e.errors) {
                  this.$toast.error(error.message)
                }
              }
            }
            this.$toast.error(e.error)
          })
      } else {
        new Users()
          .update(+this.$route.params.user_id, {
            project_id: 0
          }).then(() => {
            this.$toast.success(this.$tc('Changes accepted'))
          }).catch((e) => {
            if ('errors' in e) {
              if (Array.isArray(e.errors)) {
                for (const error of e.errors) {
                  this.$toast.error(error.message)
                }
              }
            }
            this.$toast.error(e.error)
          })
      }
    }
  }
})
</script>

<style scoped>

</style>
