<template>
  <v-dialog
    v-model="visible"
    max-width="800"
    persistent
    hide-overlay
  >
    <v-card
      width="100%"
      tile
    >
      <template v-if="dialogTitle || dialogSubTitle">
        <v-card-title v-if="dialogTitle">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-subtitle v-if="dialogSubTitle">
          {{ dialogSubTitle }}
        </v-card-subtitle>
      </template>
      <div
        v-else
        style="height: 16px"
      />

      <v-card-text>
        <v-btn-toggle
          v-model="typeSync"
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
          :return-value="date"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="dateDisplay"
              v-bind="attrs"
              prepend-icon="mdi-calendar-month"
              style="max-width: 145px"
              readonly
              dense
              solo
              flat
              filled
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="date"
            :first-day-of-week="1"
            no-title
            @change="$refs.menuDatePicker.save(date)"
          />
        </v-menu>
        <v-text-field
          v-model="time"
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
          v-model="descriptionSync"
          prepend-icon="mdi-calendar-text-outline"
          filled
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          text
          small
          tile
          @click="cancelClickEmit"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          small
          tile
          @click="okClickEmit"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
      />
    </template>
  </v-dialog>
</template>

<script lang="ts">
import dayjs from '@/plugins/dayjs'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop, PropSync, Ref, VModel, Watch } from 'vue-property-decorator'

@Component
export default class TasksDialogEdit extends Vue {
  menuDatePickerVisible = false
  formatDateTime = 'YYYY-MM-DDTHH:mm'
  formatDate = 'YYYY-MM-DD'
  formatTime = 'HH:mm'

  date = null
  time = null

  @PropSync('type', { default: () => '' }) typeSync!: string
  @PropSync('dateTime', {
    default: () => '',
    validator (value: string): boolean {
      return dayjs(value).isValid()
    }
  }) dateTimeSync!: string

  @PropSync('description', { default: () => '' }) descriptionSync!: string

  @Prop({
    default: () => [
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
  }) readonly types!: Array<Record<string, Record<string, {text: string; value: string}>>>

  @Prop({ default: () => null }) readonly dialogTitle!: string|null
  @Prop({ default: () => null }) readonly dialogSubTitle!: string|null
  @Prop({ default: () => 'YYYY-MM-DD' }) readonly displayFormatDate!: string
  @Prop({ default: () => 'HH:mm' }) readonly displayFormatTime!: string

  @VModel({
    default: () => false,
    type: Boolean
  }) visible!: boolean

  @Ref('menuDatePicker') menuDatePicker: Element

  get dateDisplay () {
    return dayjs(this.dateTimeSync, this.formatDateTime).format(this.displayFormatDate)
  }

  get timeDisplay () {
    return dayjs(this.dateTimeSync, this.formatDateTime).format(this.displayFormatTime)
  }

  @Watch('dateTimeSync')
  dateTimeSyncWatchHandler (val: string) {
    if (val) {
      this.date = dayjs(this.dateTimeSync, this.formatDateTime).format(this.formatDate)
      this.time = dayjs(this.dateTimeSync, this.formatDateTime).format(this.formatTime)
    }
  }

  @Watch('time')
  timeWatchHandler (val: string) {
    if (val) {
      this.dateTimeSync = this.dateTimeSyncFormat(this.date, val)
    }
  }

  @Watch('date')
  dateWatchHandler (val: string) {
    if (val) {
      this.dateTimeSync = this.dateTimeSyncFormat(val, this.time)
    }
  }

  @Emit('action:ok:click')
  okClickEmit () {
    this.visible = false
    return undefined
  }

  @Emit('action:cancel:click')
  cancelClickEmit () {
    this.visible = false
    return undefined
  }

  public created () {
    this.date = dayjs(this.dateTimeSync, this.formatDateTime).format(this.formatDate)
    this.time = dayjs(this.dateTimeSync, this.formatDateTime).format(this.formatTime)
  }

  private dateTimeSyncFormat (date: string, time: string) {
    return dayjs(`${date}T${time}`, this.formatDateTime).format(this.formatDateTime)
  }
}

</script>

<style lang="scss" scoped>

</style>
