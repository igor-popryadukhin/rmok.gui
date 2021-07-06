<template>
  <v-sheet>
    <template v-if="processLoadingData">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <app-project-statuses
        v-model="statuses"
      />
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppProjectStatuses from '@/components/AppProjectStatuses/AppProjectStatuses.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'ProjectEditStatuses',
  components: { AppLoading, AppProjectStatuses },
  data () {
    return {
      processLoadingData: false,
      statuses: []
    }
  },
  computed: {
    /** Идентификатор редактируемого проекта */
    projectId (): number {
      return +this.$route.params.project_id
    }
  },

  async mounted () {
    await this.fetchProjectStatuses()
    this.$watch('statuses', (val: any) => {
      console.log(val)
    }, { deep: true })

    this.$parent.$on('save', this.onSave)
  },

  methods: {
    onSave () {
      console.log('on save')
    },

    fetchProjectStatuses () {
      this.processLoadingData = true
      return new Projects()
        .getStatuses(+this.$route.params.project_id)
        .then((response) => {
          this.$data.statuses = response
        }).finally(() => (this.processLoadingData = false))
    }
  }
})
</script>

<style scoped>

</style>
