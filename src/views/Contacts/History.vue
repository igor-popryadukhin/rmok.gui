<template>
  <div>
    <v-card
      flat
    >
      <v-row>
        <v-col
          cols="12"
        >
          <template
            v-for="item in history"
          >
            <v-divider
              :key="`divider-${item}`"
            />
            <v-list-item
              :key="`list-item-${item}`"
              ripple
              selectable
            >
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
              <v-spacer />
            </v-list-item>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      history: [1, 2, 3, 4, 5]
    }
  }
})
</script>

<style scoped>

</style>
