<template>
  <v-dialog
    v-model="visible"
    max-width="700"
  >
    <v-card
      tile
    >
      <v-card-title />
      <v-card-text>
        <v-btn-toggle
          v-model="dType"
          tile
          color="deep-purple accent-3"
          group
          dense
          mandatory
        >
          <template v-for="(item, key) in types">
            <v-btn
              :key="key"
              :value="item.value"
            >
              {{ $tc(item.text) }}
            </v-btn>
          </template>
        </v-btn-toggle>
      </v-card-text>
      <v-card-text class="d-inline-flex">
        <v-menu
          ref="menuDatePicker"
          v-model="menuDatePickerVisible"
          :close-on-content-click="false"
          :return-value.sync="dDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="dDate"
              v-bind="attrs"
              dense
              solo
              flat
              filled
              prepend-icon="mdi-clock-outline"
              style="max-width: 145px"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="dDate"
            no-title
            show-current
            @change="$refs.menuDatePicker.save(dDate)"
          />
        </v-menu>
        <v-text-field
          v-model="dTime"
          :label="$tc('Time')"
          type="time"
          dense
          solo
          flat
          filled
          style="max-width: 100px"
        />
      </v-card-text>
      <v-card-text>
        <v-textarea
          v-model="dDescription"
          prepend-icon="mdi-calendar-text-outline"
          filled
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          small
          tile
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppTaskDialogEdit',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    date: {
      type: String,
      default: () => {
        const dateTime = new Date()
        const year = String(dateTime.getFullYear())
        const month = String(dateTime.getMonth() + 1)
        const date = String(dateTime.getDate())
        return `${year}-${month.padStart(2, '00')}-${date.padStart(2, '00')}`
      }
    },
    time: {
      type: String,
      default: () => new Date().toTimeString().substring(0, 5)
    },
    type: {
      type: String,
      default: 'call'
    },
    description: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      menuDatePickerVisible: false,
      visible: false,
      dDate: '',
      dTime: '',
      dType: 'call',
      dDescription: ''
    }
  },

  computed: {
    types () {
      return [
        {
          text: 'Call',
          value: 'call'
        },
        {
          text: 'Task',
          value: 'task'
        },
        {
          text: 'Meeting',
          value: 'meeting'
        },
        {
          text: 'To send a letter',
          value: 'letter'
        },
        {
          text: 'Other',
          value: 'other'
        }
      ]
    }
  },

  watch: {
    value (val: boolean) {
      this.menuDatePickerVisible = val
    }
  },

  mounted () {
    this.visible = this.value
    this.dDescription = this.description
    this.dDate = this.date
    this.dTime = this.time
    this.dType = this.type

    this.$watch('visible', (val: boolean) => {
      this.$emit('change', val)
    })
    this.$watch('dDate', (val: string) => {
      this.$emit('update:date', val)
    })
    this.$watch('dTime', (val: string) => {
      this.$emit('update:time', val)
    })
    this.$watch('dType', (val: string) => {
      this.$emit('update:type', val)
    })
    this.$watch('dDescription', (val: string) => {
      this.$emit('update:text', val)
    })
  },

  methods: {
    onBtnSaveClick () {
      this.visible = false
      this.$emit('update', {
        date: this.dDate,
        time: this.dTime,
        type: this.dType,
        description: this.dDescription
      })
    }
  }
})

</script>

<style lang="scss" scoped>

</style>
