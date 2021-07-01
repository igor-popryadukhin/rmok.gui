<template>
  <v-sheet>
    <s-users
      multiple
      outlined
      dense
    />

    <app-tools>
      <template v-slot:left>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          tile
          outlined
        >
          {{ $tc('Add') }}
        </v-btn>
        <v-btn
          :color="$vuetify.theme.currentTheme.secondary"
          tile
          outlined
        >
          {{ $tc('Cancel') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider class="mt-5" />

    <v-list>
      <template v-for="(item, key) in users">
        <v-list-item
          :key="'v-list-item-' + key"
          link
          @mouseenter="memberHoverId = item.id | 0"
          @mouseleave="memberHoverId = 0"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.first_name }} {{ item.last_name }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action
            v-if="memberHoverId === item.id"
            style="margin: 0"
            class="d-flex d-inline-flex"
          >
            <v-btn
              small
              text
              tile
            >
              {{ $tc('Exclude') }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="'v-divider-' + key"/>
      </template>
    </v-list>

    {{ users }}
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import { UserInterface } from '@/api/Users'
import AppTools from '@/components/AppTools/AppTools.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'VProjectMembers',
  components: { AppTools, SUsers },
  props: {
    members: {
      type: Array as PropType<UserInterface[]>
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to)
    new Projects()
      .getMembers(+to.params.project_id)
      .then((response) => {
        next((vm: any) => {
          vm.users = response
        })
      })
  },
  data () {
    return {
      memberHoverId: 0,
      users: []
    }
  }
})
</script>

<style scoped>

</style>
