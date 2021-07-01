<template>
  <v-sheet>
    <v-text-field
      v-model="projectName"
      :label="$tc('Project name')"
      :rules="[rules.notBlank]"
      persistent-hint
      required
    />

    <h3 class="grey--text mb-1">
      {{ $tc('Scenario') }}
    </h3>
    <app-wysiwyg
      v-model="scenario"
      ref="wysiwyg"
    />
  </v-sheet>
</template>

<script lang="ts">
import AppWysiwyg from '@/components/AppWysiwyg/AppWysiwyg.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'

export default Vue.extend({
  name: 'VProjectMain',
  components: { AppWysiwyg },
  mixins: [rules],

  data () {
    return {
      projectName: '',
      scenario: ''
    }
  }
})
</script>

<style scoped>

</style>
