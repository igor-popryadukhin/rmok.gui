<template>
  <div>
    <v-tabs
      v-model="tabStatus"
      height="35"
    >
      <v-tab>
        Все
      </v-tab>
      <v-tab
        v-for="(group, groupIndex) in $store.getters['project/statuses']"
        :key="groupIndex"
      >
        <span :style="{ color: group.color }">{{ group.name }}</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="tabStatus"
    >
      <v-tab-item>
        <v-container fluid>
          <v-radio-group
            column
          >
            <v-row
              v-for="(status, statusIndex) in $store.getters['project/statuses']"
              :key="`v-row-status-${statusIndex}`"
              justify="start"
            >
              <v-col
                v-for="(item, statusIndex) in status.items"
                :key="`v-col-status-${statusIndex}`"
                cols="3"
                class="mr-10 pa-0 mb-1"
              >
                <v-radio
                  :key="`v-radio-${statusIndex}`"
                  :color="status.color"
                  :id="`v-radio-${item.id}`"
                >
                  <template v-slot:label>
                    <span :style="{ color: status.color }">{{ item.name }}</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-container>
      </v-tab-item>
      <v-tab-item
        v-for="(tabItem, tabIndex) in $store.getters['project/statuses']"
        :key="`tab-item-status-${tabIndex}`"
      >
        <v-radio-group
          :key="`v-radio-group-${tabIndex}`"
          column
        >
          <v-row justify="start">
            <v-col
              v-for="(status, statusIndex) in tabItem.items"
              :key="`status-${statusIndex}`"
              cols="auto"
              class="mr-10"
            >
              <v-radio
                :label="status.name"
                :color="tabItem.color"
                :id="`v-radio-${status.id}`"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      tabStatus: 0,
      tab: null
    }
  }
})
</script>

<style scoped>

</style>
