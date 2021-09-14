<template>
  <DialogCard
    :actions="actions"
  >
    <template #title>
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>
      <v-card-subtitle v-if="subTitle">
        {{ subTitle }}
      </v-card-subtitle>
    </template>
    <v-form ref="form">
      <!-- Date and Time -->
      <v-row>
        <!-- Date -->
        <v-col>
          <v-menu
            ref="menuDatePicker"
            v-model="menuDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                v-model="dataDate"
                v-bind="date"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dataDate"
              :first-day-of-week="1"
              @input="menuDatePicker = false"
              @click="$refs.menuDatePicker.save(dataDate)"
            />
          </v-menu>
        </v-col>

        <!-- Time -->
        <v-col>
          <v-menu
            ref="menuTimePicker"
            v-model="menuTimePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="dataTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                v-model="dataTime"
                readonly
                v-bind="time"
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="menuTimePicker"
              v-model="dataTime"
              format="24hr"
              @click:minute="$refs.menuTimePicker.save(dataTime)"
            />
          </v-menu>
        </v-col>
      </v-row>

      <!-- Types -->
      <v-row>
        <v-col>
          <v-combobox
            v-model="dataType"
            v-bind="types"
          />
        </v-col>
      </v-row>

      <!-- Performers -->
      <v-row>
        <v-col>
          <v-combobox
            v-model="dataPerformer"
            v-bind="performers"
          />
        </v-col>
      </v-row>

      <!-- Comment -->
      <v-row>
        <v-col>
          <v-textarea
            v-model="dataDescription"
            rows="4"
            v-bind="description"
          >
            <template #append>
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
    </v-form>
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'

interface RecordInterface {
  title: string;
  value: any;
  [key: string]: any
}

export interface DTaskInterface {
  date: string;
  time: string;
  type: RecordInterface;
  performer: RecordInterface;
  description: string;
  automaticExecution: boolean;
}

export default Vue.extend({

  props: {
    date: {
      default: () => {
        return {
          label: 'Date',
          prependInnerIcon: 'mdi-calendar',
          readonly: true,
          rules: []
        }
      },
      type: Object
    },
    description: {
      default: () => {
        return {}
      },
      type: Object
    },
    automaticExecution: {
      default: () => {
        return {}
      },
      type: Object
    },
    performers: {
      default: () => {
        return {}
      },
      type: Object
    },
    cancelTitle: {
      default: 'Cancel',
      type: String
    },
    subTitle: {
      default: '',
      type: String
    },
    onCancel: {
      default: null,
      type: Function
    },
    title: {
      type: String,
      default: 'Title'
    },
    on: {
      default: null,
      type: Object
    },
    onSave: {
      default: undefined,
      type: Function
    },
    types: {
      type: Object,
      default: () => {
        return {}
      }
    },
    saveTitle: {
      default: 'Save',
      type: String
    },

    time: {
      type: Object,
      default: () => {
        return {
          label: 'Time',
          prependInnerIcon: 'mdi-clock-time-four-outline',
          readonly: true,
          rules: []
        }
      }
    }
  },

  data () {
    return {
      dataAutomaticExecution: false,
      dataDate: undefined,
      dataDescription: undefined,
      dataPerformer: undefined,
      dataTime: undefined,
      dataType: undefined,
      menuDatePicker: false,
      menuTimePicker: false
    }
  },
  computed: {

    actions () {
      return {
        cancel: {
          flat: true,
          handle: () => {
            if (typeof (this as any).onCancel === 'function') {
              (this as any).onCancel()
            }
          },
          text: (this as any).cancelTitle
        },

        save: {
          flat: true,
          handle: () => {
            if (typeof this.onSave === 'function') {
              if (!this.$refs.form.validate()) {
                return false
              }
              (this as any).onSave({
                automaticExecution: this.dataAutomaticExecution,
                date: this.dataDate,
                description: this.dataDescription,
                performer: this.dataPerformer,
                time: this.dataTime,
                type: this.dataType
              })
            }
          },
          text: (this as any).saveTitle
        }
      }
    }
  },

  methods: {
  }

})
</script>

<style lang="scss">
</style>
