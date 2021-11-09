<template>
  <v-sheet>
    <template v-if="processLoading">
      <div
        class="d-flex align-center justify-center"
        style="height: 500px"
      >
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-row>
        <v-col>1</v-col>
        <v-col>2</v-col>
      </v-row>
      <v-row>
        <v-col>3</v-col>
        <v-col>4</v-col>
      </v-row>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Autodialer from '@/api/interfaces/Autodialer'
import AutodialerParams from '@/api/AutodialerParams'

export default Vue.extend({
  components: { AppLoading },
  data () {
    return {
      processLoading: true,
      params: {
        id: 0,
        name: '',
        status: 'ready',
        mode: 'progressive'
      }
    }
  },

  mounted () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.$data.processLoading = true
      new AutodialerParams()
        .getById(+this.$route.params.id)
        .then((response) => {
          this.$data.params.id = response.id
          this.$data.params.name = response.name
          this.$data.params.status = response.status
          this.$data.params.mode = response.mode
        }).finally(() => {
          this.$data.processLoading = false
        })
    },

    onBtnItemPlayOrPauseClick (item: Autodialer) {
      // TODO: Handler
    },

    onBtnAddClick () {
      // TODO: Handler
    },

    onBtnRefreshClick () {
      this.fetch()
    }
  }
})
</script>

<style scoped>

</style>
