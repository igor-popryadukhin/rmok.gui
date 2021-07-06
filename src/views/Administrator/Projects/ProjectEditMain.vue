<template>
  <v-sheet>
    <v-text-field
      v-model="projectName"
      :label="$tc('Project name')"
      :rules="[rules.notBlank, rules.lengthMin(1), rules.lengthMax(255)]"
      required
      @change="onProjectNameChange"
    />

    <h3 class="grey--text mb-1">
      {{ $tc('Scenario') }}
    </h3>
    <app-wysiwyg
      v-model="projectScenario"
      ref="wysiwyg"
      @change="onProjectScenarioChange"
    />
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import AppWysiwyg from '@/components/AppWysiwyg/AppWysiwyg.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'

export default Vue.extend({
  name: 'ProjectEditMain',

  components: { AppWysiwyg },

  mixins: [rules],

  data () {
    return {
      projectName: '',
      projectScenario: ''
    }
  },

  computed: {
    /** Идентификатор редактируемого проекта */
    projectId (): number {
      return +this.$route.params.project_id
    }
  },

  mounted () {
    new Projects()
      .getById(this.projectId)
      .then((response) => {
        this.projectName = response.name
        this.projectScenario = response?.scenario || ''
      })

    this.$parent.$on('save', this.onSave)
  },

  methods: {
    onSave () {
      console.log('on save')
    },

    onProjectNameChange () {
      new Projects()
        .update(this.projectId, {
          name: this.projectName
        }).then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        })
    },
    onProjectScenarioChange () {
      new Projects()
        .update(this.projectId, {
          scenario: this.projectScenario
        }).then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        })
    }
  }
})
</script>

<style scoped>

</style>
