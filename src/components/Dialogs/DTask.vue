<template>
  <DialogCard
    :actions="actions"
  >
    <template v-slot:title>
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-subtitle v-if="subTitle">{{ subTitle }}</v-card-subtitle>
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
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dataDate"
                v-bind="date"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dataDate"
              @input="menuDatePicker = false"
              @click="$refs.menuDatePicker.save(dataDate)"
            ></v-date-picker>
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
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dataTime"
                readonly
                v-bind="time"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimePicker"
              v-model="dataTime"
              format="24hr"
              @click:minute="$refs.menuTimePicker.save(dataTime)"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Types -->
      <v-row>
        <v-col>
          <v-combobox
            v-model="dataType"
            v-bind="types"
          >
          </v-combobox>
        </v-col>
      </v-row>

      <!-- Performers -->
      <v-row>
        <v-col>
          <v-combobox
            v-model="dataPerformer"
            v-bind="performers"
          >
          </v-combobox>
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
    title: {
      type: String,
      default: 'Title'
    },
    subTitle: {
      type: String,
      default: ''
    },
    performers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    types: {
      type: Object,
      default: () => {
        return {}
      }
    },
    date: {
      type: Object,
      default: () => {
        return {
          label: 'Date',
          prependInnerIcon: 'mdi-calendar',
          readonly: true,
          rules: []
        }
      }
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
    },
    description: {
      type: Object,
      default: () => {
        return {}
      }
    },
    automaticExecution: {
      type: Object,
      default: () => {
        return {}
      }
    },
    saveTitle: {
      type: String,
      default: 'Save'
    },
    cancelTitle: {
      type: String,
      default: 'Cancel'
    },
    onSave: {
      type: Function,
      default: undefined
    },
    onCancel: {
      type: Function,
      default: null
    },

    on: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      menuDatePicker: false,
      menuTimePicker: false,
      dataDate: undefined,
      dataTime: undefined,
      dataType: undefined,
      dataPerformer: undefined,
      dataDescription: undefined,
      dataAutomaticExecution: false
    }
  },

  computed: {

    actions () {
      return {
        cancel: {
          flat: true,
          text: (this as any).cancelTitle,
          handle: () => {
            if (typeof (this as any).onCancel === 'function') {
              (this as any).onCancel()
            }
          }
        },

        save: {
          flat: true,
          text: (this as any).saveTitle,
          handle: () => {
            if (typeof this.onSave === 'function') {
              if (!this.$refs.form.validate()) {
                return false
              }
              (this as any).onSave({
                date: this.dataDate,
                time: this.dataTime,
                type: this.dataType,
                performer: this.dataPerformer,
                description: this.dataDescription,
                automaticExecution: this.dataAutomaticExecution
              })
            }
          }
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
