<template>
  <v-sheet>
    <app-tools>
      <template v-slot:left>
        <h2 class="grey--text">
          {{ $tc('Main information') }}
        </h2>
      </template>
      <template v-slot:right>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :loading="processOfSaving"
          tile
          outlined
          small
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider />

    <template v-if="processLoadingData">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-text-field
        v-model="projectName"
        :label="$tc('Project name')"
        :rules="[rules.notBlank, rules.lengthMin(1), rules.lengthMax(255)]"
        required
      />

      <h3 class="grey--text mb-1">
        {{ $tc('Scenario') }}
      </h3>
      <app-wysiwyg
        v-model="projectScenario"
        ref="wysiwyg"
      />
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import AppWysiwyg from '@/components/AppWysiwyg/AppWysiwyg.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'

export default Vue.extend({
  name: 'ProjectEditMain',

  components: { AppLoading, AppTools, AppWysiwyg },

  mixins: [rules],

  data () {
    return {
      processLoadingData: false,
      processOfSaving: false,
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
    this.processLoadingData = true
    new Projects()
      .getById(this.projectId)
      .then((response) => {
        this.projectName = response.name
        this.projectScenario = response?.scenario || ''
      }).finally(() => (this.processLoadingData = false))
  },

  methods: {
    /**
     * Событие, генерируется при нажатии на кнопку "Сохранить"
     */
    onBtnSaveClick () {
      this.$data.processOfSaving = true
      new Projects()
        .edit(this.projectId, {
          name: this.projectName,
          scenario: this.projectScenario
        }).then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        }).finally(() => (this.$data.processOfSaving = false))
    }
  }
})
</script>

<style scoped>

</style>
