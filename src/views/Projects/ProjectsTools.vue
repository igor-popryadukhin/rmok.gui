<template>
  <v-sheet height="100%">
    <v-btn
      small
      tile
      text
      @click="btnClickAdd"
    >
      {{ $tc('Add') }}
    </v-btn>
    <v-btn
      v-if="!projectListItemsFetching"
      min-width="100"
      small
      tile
      text
      @click="btnRefreshClick"
    >
      <span>
        {{ $tc('Refresh') }}
      </span>
    </v-btn>
    <v-btn
      v-else
      color="red"
      min-width="100"
      small
      tile
      text
      @click="btnRefreshCancelClick"
    >
      <span>
        {{ $tc('Cancel') }}
      </span>
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component
export default class ProjectsTools extends Vue {
  get projectListItemsFetching (): boolean { return this.$store.getters['projects/list/items_fetching']; }

  @Emit('click:add')
  btnClickAdd () {
    return undefined;
  }

  btnRefreshClick (): void {
    this.$store.dispatch('projects/list/fetch');
  }

  btnRefreshCancelClick (): void {
    this.$store.dispatch('projects/list/fetch_cancel');
  }
}
</script>

<style scoped>

</style>
