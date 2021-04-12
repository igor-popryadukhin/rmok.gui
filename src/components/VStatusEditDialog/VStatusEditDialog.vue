<template>
  <DialogCard
    :title="$tc('Available statuses')"
    :actions="actions"
  >
    <div>
      <v-tabs
        v-model="tabStatus"
        height="35"
      >
        <v-tab>
          {{ $tc('All') }}
        </v-tab>
        <v-tab
          v-for="(group, groupIndex) in statuses"
          :key="groupIndex"
        >
          <span :style="{ color: group.color }">{{ group.name }}</span>
        </v-tab>
      </v-tabs>
      <v-divider />
      <v-tabs-items
        v-model="tabStatus"
      >
        <v-tab-item>
          <v-container class="px-5" fluid>
            <v-radio-group
              column
            >
              <v-row
                v-for="(status, statusIndex) in statuses"
                :key="`v-row-status-${statusIndex}`"
                justify="start"
                align="start"
              >
                <v-col
                  v-for="(item, statusIndex) in status.statuses"
                  :key="`v-col-status-${statusIndex}`"
                  cols="4"
                  class="pa-0 mb-1"
                >
                  <v-radio
                    :key="`v-radio-${statusIndex}`"
                    :color="status.color"
                    :id="`v-radio-${item.id}`"
                    @change="onRadioChange(item)"
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
          v-for="(tabItem, tabIndex) in statuses"
          :key="`tab-item-status-${tabIndex}`"
        >
          <v-container class="px-5" fluid>
            <v-radio-group
              :key="`v-radio-group-${tabIndex}`"
              column
            >
              <v-row>
                <v-col
                  v-for="(status, statusIndex) in tabItem.statuses"
                  :key="`status-${statusIndex}`"
                  cols="4"
                >
                  <v-radio
                    :label="status.name"
                    :color="tabItem.color"
                    :id="`v-radio-${status.id}`"
                    @change="onRadioChange(status)"
                  ></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-textarea
      v-model="dComment"
      :label="$tc('Comment')"
      outlined
    />
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'

interface SInterface {
  id: number;
  name: string;
}

export interface StatusInterface {
  status: SInterface;
  comment: string;
}

export default Vue.extend({
  props: {
    statuses: {
      type: Array
    },
    statusId: {
      type: Number,
      default: 0
    },
    comment: {
      type: String,
      default: ''
    },

    // Обратные вызовы
    onSave: {
      type: Function,
      default: null
    },
    onCancel: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      dStatusId: 0,
      dComment: '',
      tabStatus: 0,
      tab: null,
      selected: undefined
    }
  },

  mounted () {
    this.dComment = this.comment
  },

  computed: {
    actions () {
      return {
        cancel: {
          flat: true,
          text: this.$tc('Cancel'),
          color: 'red',
          disabled: true,
          handle: () => {
            if (typeof this.onCancel === 'function') {
              this.onCancel()
            }
          }
        },

        save: {
          flat: true,
          text: this.$tc('Save'),
          handle: () => {
            if (typeof this.onSave === 'function') {
              this.onSave({
                status: this.selected,
                comment: this.dComment
              })
            }
          }
        }
      }
    }
  },

  methods: {
    onRadioChange (status: any) {
      (this as any).selected = status
    }
  }

})
</script>

<style lang="scss">
</style>
