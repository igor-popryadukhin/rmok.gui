<template>
  <v-sheet height="100%">
    <template v-if="items.length === 0 && itemsFetching">
      <div class="d-flex justify-center align-center fill-height">
        <div class="grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="items.length === 0 && itemsFetching === false">
      <div class="d-flex align-center justify-center fill-height">
        <div class="grey--text">
          {{ $tc('Projects list is empty') }}
        </div>
      </div>
    </template>
    <template v-else>
      <v-list dense>
        <template v-for="(item, itemKey) in items">
          <v-list-item :key="`v-list-item-${itemKey}`">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu
                min-width="250"
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    tile
                    ripple
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item :to="{ name: 'projects_view', params: { id: item.id } }">
                    <v-list-item-title>{{ $tc('Project settings') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`v-divider-${itemKey}`" />
        </template>
      </v-list>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Project from '@/api/interfaces/Project'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

@Component({
  components: { AppLoading }
})
export default class ProjectsItems extends AppBase {
  get items (): Project[] { return this.$store.getters['projects/list/items'] }
  get itemsFetching (): boolean { return this.$store.getters['projects/list/items_fetching'] }

  @Emit('item:actions:click:edit')
  itemActionsClickEdit (id: number) {
    return id
  }
}
</script>

<style scoped>

</style>
