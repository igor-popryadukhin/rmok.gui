<template>
  <v-sheet class="d-flex align-center justify-center fill-height">
    <div style="max-width: 500px">
      <smart-autocomplete
        v-model="projectId"
        :api-query="(q) => { return { q } }"
        api-end-point="/projects"
        item-text="name"
        item-value="id"
        response-property="data"
        store-module-name="projects"
      />

      <smart-autocomplete
        :filter="(item) => item.project.id === projectId"
        :api-query="(q) => { return {q, project_id: projectId} }"
        api-end-point="/users"
        item-text="full_name"
        item-value="id"
        response-property="data"
        store-module-name="users"
      />
    </div>
  </v-sheet>
</template>

<script lang="ts">
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import Vue from 'vue'

export default Vue.extend({
  components: { SmartAutocomplete },
  data () {
    return {
      projectId: 0
    }
  }
})
</script>
