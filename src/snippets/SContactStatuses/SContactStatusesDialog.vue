<template>
  <v-dialog
    v-model="dialogVisible"
    persistent
    max-width="80%"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
        <v-spacer />
        <v-btn
          v-if="btnCancelVisible"
          text
          class="mr-4"
          outlined
          @click="$emit('change', false)"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          class="primary"
          text
          @click="onSave"
        >
          {{ $t('Save') }}
        </v-btn>
      </v-card-title>
      <v-card-text>

        <!-- Statuses -->
        <v-row>
          <v-col>
            <v-tabs
              v-model="tabStatus"
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

            <v-radio-group
              column
            >
              <v-tabs-items
              v-model="tabStatus"
            >
              <v-tab-item>
                <v-container fluid>
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
                          @change="onRadioChange(item)"
                        >
                          <template v-slot:label>
                            <span :style="{ color: status.color }">{{ item.name }}</span>
                          </template>
                        </v-radio>
                      </v-col>
                    </v-row>
                </v-container>
              </v-tab-item>
              <v-tab-item
                v-for="(tabItem, tabIndex) in $store.getters['project/statuses']"
                :key="`tab-item-status-${tabIndex}`"
              >
                <v-container fluid>
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
                        @change="onRadioChange(status)"
                      ></v-radio>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
            </v-radio-group>
          </v-col>
        </v-row>

        <!-- Comment -->
        <v-row>
          <v-col>
            <v-textarea
              v-model="comment.text"
              :disabled="comment.disabled"
              rows="4"
              outlined
              :placeholder="$t('Comment')"
              value=""
            >
              <template v-slot:prepend-inner>
                <v-icon>
                  mdi-comment
                </v-icon>
              </template>
              <template v-slot:append>
                <v-btn
                  icon
                  text
                  disabled
                >
                  <v-icon>
                    mdi-microphone
                  </v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'

export default Vue.extend({

  created () {
    // Default value
    this.dialogVisible = this.value
  },

  data () {
    return {
      comment: {
        buttonSave: {
          loading: false
        },
        disabled: false,
        text: ''
      },
      currentStatus: null as any,
      dialogVisible: false,
      tabStatus: 0
    }
  },

  methods: {

    onChange (value: boolean) {
      this.dialogVisible = value
    },

    onLoadHistory (id: number) {
      new Contacts()
        .getHistoryById(id)
        .then((data) => {
          this.comment.text = data.comment
        })
    },

    onRadioChange (status: any) {
      this.currentStatus = status
    },

    onSave () {
      /* eslint-disable */

      if (!this.currentStatus) {
        return this.$toast.warning(this.$tc('Choose a status first!'))
      }

      if (this.historyId <= 0) {
        return this.$toast.error(this.$tc('Что-то пошло не так!'))
      }

      new Contacts()
        .updateHistory(this.historyId, {
          status_id: this.currentStatus.id,
          comment: this.comment.text
        }).then(() => {
          this.$root.$emit('root-contact-history-change')
        })

      this.$emit('change', false)
      /* eslint-enable */
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  mounted () {
    this.$on('change', this.onChange)
  },

  props: {
    btnCancelVisible: {
      default: false,
      type: Boolean
    },
    historyId: {
      default: -1,
      type: Number
    },
    title: {
      default: '',
      type: String
    },
    value: {
      default: false,
      type: Boolean
    }
  },

  watch: {
    dialogVisible (value: boolean) {
      if (value && this.historyId > 0) {
        this.onLoadHistory(this.historyId)
      }
    },

    value (value: boolean) {
      this.dialogVisible = value
    }
  }
})
</script>

<style scoped>

</style>
