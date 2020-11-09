<template>
  <div>
    {{ breadcrumbs }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'

export default Vue.extend({
  mixins: [breadcrumbs],
  data () {
    return {
      history: [1, 2, 3, 4, 5]
    }
  }
})
</script>

<style scoped>

</style>
