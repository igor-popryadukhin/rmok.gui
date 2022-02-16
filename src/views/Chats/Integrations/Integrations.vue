<template>
  <v-sheet height="100%">
    <template v-if="fetching && messengers.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        <app-loading />
      </div>
    </template>
    <template v-else-if="messengers.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        {{ $tc('Empty') }}
      </div>
    </template>
    <div
      v-else
      style="max-width: 450px"
    >
      <v-list
        dense
      >
        <template v-for="(item, itemIndex) in messengers">
          <v-list-item
            :key="`v-list-item-` + itemIndex"
            :to="{ name: 'integrations_view', params: { id: item.id } }"
            link
          >
            <v-list-item-avatar>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="green">
                mdi-check-circle-outline
              </v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`v-divider-` + itemIndex" />
        </template>
      </v-list>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppLoading from "@/components/AppLoading/AppLoading.vue";

@Component({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('chats/messengers/fetch')
    })
  }
})
export default class Integrations extends Vue {
  get fetching () { return this.$store.getters['chats/messengers/fetching'] }

  // Доступные мессенджеры из справочника
  get messengers () { return this.$store.getters['chats/messengers/items'] }
}
</script>

<style scoped>

</style>
