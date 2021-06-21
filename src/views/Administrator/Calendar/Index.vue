<template>
  <v-sheet height="400">
    <v-select
      v-model="type"
      :items="[]"
      dense
      outlined
      hide-details
      class="ma-2"
      label="type"
    ></v-select>
    <v-calendar
      ref="calendar"
      :now="today"
      :value="today"
      :events="events"
      color="primary"
      type="week"
    ></v-calendar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    today: '2021-06-21',
    events: [
      {
        name: 'Рабочий день',
        start: '2021-06-21 8:00',
        end: '2021-06-21 9:00'
      }
    ]
  }),
  mounted () {
    // this.$refs.calendar.scrollToTime('08:00')
  }
})
</script>

<style scoped>

</style>
