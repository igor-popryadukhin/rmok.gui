<template>
  <v-card
    flat
    tile
  >
    <v-card-title>
      {{ $tc('Working time') }}
    </v-card-title>
    <v-card-text>
      <s-users
        v-model="user"
        :label="$tc('Manager')"
        :params="{ role_use: 'for_calls' }"
        :disabled="save_process"
        ref="sUsers"
        style="width: 752px"
        clearable
        outlined
        dense
      />
      <app-schedule-week
        v-model="schedule"
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
        :loading="save_process"
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
import Users, { UserInterface } from '@/api/Users'
import AppScheduleWeek from '@/components/AppScheduleWeek/AppScheduleWeek.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue from 'vue'
import { Route } from 'vue-router/types/router'

export default Vue.extend({
  components: { AppScheduleWeek, SUsers },

  beforeRouteEnter (to: Route, from: Route, next: any) {
    new Users()
      .getSchedule(+to.params.user_id)
      .then((response: any) => {
        next((vm: any) => {
          vm.schedule = response
          vm.$watch('user', (val?: UserInterface) => {
            if (val) {
              if (val.id !== +to.params.user_id) {
                vm.$router.push({
                  name: 'administrator_users_schedule',
                  params: {
                    user_id: val.id
                  }
                })
              }
            }
          })

          vm.$refs.sUsers.setDefault(+to.params.user_id)
        })
      })
  },

  beforeRouteUpdate (to: Route, from: Route, next: any) {
    console.log('beforeRouteUpdate')
    if ('user_id' in to.params) {
      if (+to.params.user_id !== +from.params.user_id) {
        this.fetchSchedule(+to.params.user_id)
      }
    }
    next()
  },

  data: () => ({
    from: null,
    save_process: false,
    user: null as any,
    schedule: []
  }),

  methods: {
    onSaveClick () {
      if (this.user?.id) {
        this.saveSchedule(this.user.id, this.schedule)
      }
    },

    onClearClick () {
      this.schedule = []
    },

    saveSchedule (user_id: number, data: any) {
      this.save_process = true
      new Users()
        .setSchedule(user_id, data)
        .then(() => {
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
          this.schedule = response
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
