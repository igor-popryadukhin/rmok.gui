<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div>
        <v-tabs
          v-model="tabStatus"
          height="35"
        >
          <v-tab>
            Все
          </v-tab>
          <v-tab
            v-for="(group, groupIndex) in statuses"
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
                  v-for="(status, statusIndex) in statuses"
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
                      :id="`v-radio-${item.id}`"
                      :key="`v-radio-${statusIndex}`"
                      :color="status.color"
                      @change="onRadioChange(item)"
                    >
                      <template #label>
                        <span :style="{ color: status.color }">{{ item.name }}</span>
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-container>
          </v-tab-item>
          <v-tab-item
            v-for="(tabItem, tabIndex) in statuses"
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
                    :id="`v-radio-${status.id}`"
                    :label="status.name"
                    :color="tabItem.color"
                    @change="onRadioChange(status)"
                  />
                </v-col>
              </v-row>
            </v-radio-group>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <v-textarea
        v-model="dComment"
        label="Comment"
        outlined
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="onSave">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

  name: 'VContactStatusDialog',

  props: {
    cancelTitle: {
      default: 'Cancel',
      type: String
    },
    comment: {
      default: '',
      type: String
    },
    onCancel: {
      default: null,
      type: Function
    },
    saveTitle: {
      default: 'Save',
      type: String
    },
    statuses: {
      type: Array
    },
    text: {
      default: '',
      type: String
    },
    title: {
      default: 'Title',
      type: String
    },
    width: {
      default: () => '100%',
      type: String
    }
  },
  data () {
    return {
      dComment: '',
      selected: undefined,
      tab: null,
      tabStatus: 0
    }
  },
  created () {
    console.log(this);
    (this as any).dComment = (this as any).comment
  },

  methods: {
    onRadioChange (status: any) {
      (this as any).selected = status
    },

    onSave () {
      console.log('on save')
      this.$emit('on-save')
    }
  }

})
</script>

<style lang="scss">
</style>
