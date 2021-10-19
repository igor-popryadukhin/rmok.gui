<template>
  <v-card
    flat
    tile
  >
    <v-card-title>
      {{ $tc('Working time') }}
    </v-card-title>
    <v-card-text>
      <app-schedule-week
        v-model="new_schedule"
        :element-color="$vuetify.theme.currentTheme.primary"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="save_process"
        text
        tile
        @click="onClearClick"
      >
        {{ $tc('Clear') }}
      </v-btn>
      <v-btn
        :disabled="save_process || !isChanged"
        text
        tile
        @click="onBtnCancelClick"
      >
        {{ $tc('Cancel') }}
      </v-btn>
      <v-btn
        :disabled="save_process"
        text
        tile
        @click="onBtnDefaultClick"
      >
        {{ $tc('Default') }}
      </v-btn>
      <v-btn
        :loading="save_process"
        :disabled="!isChanged"
        text
        tile
        @click="onSaveClick"
      >
        {{ $tc('Save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Users from '@/api/Users'
import AppScheduleWeek from '@/components/AppScheduleWeek/AppScheduleWeek.vue'
import Vue from 'vue'
import { Route } from 'vue-router/types/router'

export default Vue.extend({
  components: { AppScheduleWeek },

  beforeRouteEnter (to: Route, from: Route, next: any) {
    new Users()
      .getSchedule(+to.params.user_id)
      .then((response: any) => {
        next((vm: any) => {
          vm.new_schedule = response
          vm.old_schedule = response
        })
      })
  },

  beforeRouteLeave (to: Route, from: Route, next: any) {
    if (this.isChanged) {
      if (window.confirm(this.$tc('Do you really want to leave? you have unsaved changes!'))) {
        next()
      }
    } else {
      next()
    }
  },

  data: () => ({
    save_process: false,
    old_schedule: [] as { time:string, day: number }[],
    new_schedule: [] as { time:string, day: number }[]
  }),

  computed: {
    userId () {
      return +this.$route.params.user_id
    },

    isChanged () {
      const old_array: any[] = this.old_schedule
      const new_array: any[] = this.new_schedule

      if (old_array.length !== new_array.length) {
        return true
      }

      for (let i = 0; i < old_array.length; i++) {
        if (new_array.findIndex(value => value.time === old_array[i].time && value.day === old_array[i].day) === -1) {
          return true
        }
      }

      return false
    }
  },

  watch: {
    isChanged (val: boolean) {
      if (val) {
        if (typeof window.onbeforeunload !== 'function') {
          window.onbeforeunload = (evt: any) => {
            const message = this.$tc('Do you really want to leave? you have unsaved changes!')
            if (typeof evt === 'undefined') {
              evt = window.event
            }
            if (evt) {
              evt.returnValue = message
            }
            return message
          }
        }
      } else {
        window.onbeforeunload = null
      }
    }
  },

  mounted () {
    new Users()
      .getSchedule(this.userId)
      .then((response: any) => {
        this.new_schedule = response
        this.old_schedule = response
      })
  },

  methods: {
    onSaveClick () {
      this.saveSchedule(this.userId, this.new_schedule)
    },

    onBtnCancelClick () {
      this.new_schedule = this.old_schedule
    },

    onBtnDefaultClick () {
      const days: number[] = [1, 2, 3, 4, 5]
      const times: string[] = []
      for (let i = 10; i < 19; i++) {
        times.push(String(i).padStart(2, '00') + ':00')
      }

      this.new_schedule = []
      days.forEach((day: number) => {
        times.forEach((time: string) => {
          this.new_schedule.push({
            time,
            day
          })
        })
      })
    },

    onClearClick () {
      this.new_schedule = []
    },

    saveSchedule (user_id: number, data: any) {
      this.save_process = true
      new Users()
        .setSchedule(user_id, data)
        .then(() => {
          this.old_schedule = this.new_schedule
          this.$toast.success(this.$tc('The schedule has been successfully saved!'))
        }).catch(() => {
          this.$toast.error(this.$tc('An error occurred while saving the schedule.'))
        }).finally(() => {
          setTimeout(() => {
            this.save_process = false
          }, 1000)
        })
    },

    fetchSchedule (user_id: number) {
      new Users()
        .getSchedule(user_id)
        .then((response: any) => {
          this.old_schedule = response
          this.new_schedule = response
        })
    }
  }
})
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>
