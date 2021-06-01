<template>
  <v-card
    width="100%"
    tile
    flat
  >
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>
            Symfony profiler
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              text
              @click="$store.dispatch('symfony/call_collection_clear')"
            >
              Clear
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list :key="counter">
          <template v-for="(item, key) in symfony_call_collection">
            <v-list-item
              :key="key"
              :href="item.profiler"
              target="_blank"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.endpoint }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.profiler }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider :key="`v-divider-${key + counter}`" />
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  data () {
    return {
      counter: 0
    }
  },
  computed: {
    ...mapGetters({
      symfony_call_collection: 'symfony/call_collection'
    })
  },

  mounted () {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
})
</script>

<style lang="scss">
</style>
