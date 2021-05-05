<template>
  <div class="overflow-auto">
    <v-editor />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VEditor from '@/components/VEditor/VEditor.vue'

export default Vue.extend({
  components: { 'v-editor': VEditor },
  data () {
    return {
      history: [1, 2, 3, 4, 5]
    }
  },

  methods: {
    /**
     * Метод предназначен для обновления всего компонента
     **/
    update () {
      // todo: implementation
    }
  }
})
</script>

<style scoped>

</style>
