<template>
  <v-sheet class="fill-height">
    <v-row no-gutters>
      <v-col>
        <h4>Рабочее время</h4>
        <app-schedule-week
          v-model="schedule"
          element-color="#3a70d4"
        />
      </v-col>
    </v-row>
    <v-divider class="my-3" />
    <v-row no-gutters>
      <v-col>
        <h4 class="mb-3">
          Время, в которое можно звонить клиенту
        </h4>
        <div class="d-flex">
          <div class="align-self-center mr-10">
            Время клиента
          </div>
          <v-text-field
            type="time"
            style="max-width: 100px;"
            dense
            outlined
            hide-details
            value="08:30"
          />
          <div class="align-self-center px-5">
            —
          </div>
          <v-text-field
            type="time"
            style="max-width: 100px"
            dense
            outlined
            hide-details
            value="19:00"
          />
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import AppBase from '@/AppBase';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppScheduleWeek from '@/components/AppScheduleWeek/AppScheduleWeek.vue';

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: { AppScheduleWeek, AppLoading }
})
export default class Index extends AppBase {
  schedule = [];

  mounted () {
    this.schedule = [
      { time: '10:00', day: 1 },
      { time: '11:00', day: 1 },
      { time: '12:00', day: 1 },
      { time: '13:00', day: 1 },
      { time: '14:00', day: 1 },
      { time: '15:00', day: 1 },
      { time: '16:00', day: 1 },
      { time: '17:00', day: 1 },
      { time: '18:00', day: 1 },
      { time: '10:00', day: 2 },
      { time: '11:00', day: 2 },
      { time: '12:00', day: 2 },
      { time: '13:00', day: 2 },
      { time: '14:00', day: 2 },
      { time: '15:00', day: 2 },
      { time: '16:00', day: 2 },
      { time: '17:00', day: 2 },
      { time: '18:00', day: 2 },
      { time: '10:00', day: 3 },
      { time: '11:00', day: 3 },
      { time: '12:00', day: 3 },
      { time: '13:00', day: 3 },
      { time: '14:00', day: 3 },
      { time: '15:00', day: 3 },
      { time: '16:00', day: 3 },
      { time: '17:00', day: 3 },
      { time: '18:00', day: 3 },
      { time: '10:00', day: 4 },
      { time: '11:00', day: 4 },
      { time: '12:00', day: 4 },
      { time: '13:00', day: 4 },
      { time: '14:00', day: 4 },
      { time: '15:00', day: 4 },
      { time: '16:00', day: 4 },
      { time: '17:00', day: 4 },
      { time: '18:00', day: 4 },
      { time: '10:00', day: 5 },
      { time: '11:00', day: 5 },
      { time: '12:00', day: 5 },
      { time: '13:00', day: 5 },
      { time: '14:00', day: 5 },
      { time: '15:00', day: 5 },
      { time: '16:00', day: 5 },
      { time: '17:00', day: 5 },
      { time: '18:00', day: 5 }
    ];
  }
}
</script>

<style lang="scss" scoped>
.controls div:not(:last-child) {
  margin-right: 10px;
}
</style>
