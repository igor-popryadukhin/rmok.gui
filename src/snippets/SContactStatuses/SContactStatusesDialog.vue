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

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    historyId: {
      type: Number,
      default: -1
    },
    btnCancelVisible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      tabStatus: 0,
      currentStatus: null as any,
      comment: {
        disabled: false,
        text: '',
        buttonSave: {
          loading: false
        }
      },
      dialogVisible: false
    }
  },

  watch: {
    value (value: boolean) {
      this.dialogVisible = value
    },

    dialogVisible (value: boolean) {
      if (value && this.historyId > 0) {
        this.onLoadHistory(this.historyId)
      }
    }
  },

  mounted () {
    this.$on('change', this.onChange)
  },

  created () {
    // Default value
    this.dialogVisible = this.value
  },

  methods: {

    onChange (value: boolean) {
      this.dialogVisible = value
    },

    onRadioChange (status: any) {
      this.currentStatus = status
    },

    onLoadHistory (id: number) {
      new Contacts()
        .getHistoryById(id)
        .then((data) => {
          this.comment.text = data.comment
        })
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
  }
})
</script>

<style scoped>

</style>
