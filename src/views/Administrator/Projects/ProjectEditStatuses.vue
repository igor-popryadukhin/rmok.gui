<template>
  <v-sheet>

    <v-text-field
      :label="$tc('Project name')"
      :rules="[]"
      persistent-hint
      required
    />
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ProjectEditStatuses',
  computed: {
    /** Идентификатор редактируемого проекта */
    projectId (): number {
      return +this.$route.params.project_id
    }
  }
})
</script>

<style scoped>

</style>
