<template>
  <v-sheet
    class="mt-5"
  >
    <div class="mb-5">
      <app-schedule-week
        v-model="schedule"
        :element-color="$vuetify.theme.currentTheme.primary"
      />
    </div>

    <div class="mb-5">
      <app-schedule-week
        v-model="schedule"
        :element-color="$vuetify.theme.currentTheme.primary"
      />
    </div>

    <v-divider class="mb-2" />

    <div class="mb-5">
      <v-btn
        :loading="conservationProcess"
        :disabled="!isChanged"
        tile
        text
        outlined
        @click="onBtnSaveChangeClick"
      >
        {{ $tc('Save change') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError';
import UserSchedule from '@/api/interfaces/UserSchedule';
import AppBase from '@/AppBase';
import AppScheduleWeek from '@/components/AppScheduleWeek/AppScheduleWeek.vue';
import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import Component from 'vue-class-component';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppTable from '@/components/AppTable/AppTable.vue';

// eslint-disable-next-line no-use-before-define
@Component<UsersViewSchedule>({
  components: { AppScheduleWeek, AppTable, AppLoading }
})
export default class UsersViewSchedule extends AppBase {
  conservationProcess = false
  oldFormState = null

  get schedule (): UserSchedule[] {
    return this.$store.getters['users/view/user_schedule'];
  }

  set schedule (val: UserSchedule[]) {
    this.$store.commit('users/view/user_schedule', val);
  }

  get isChanged () {
    return this.oldFormState !== JSON.stringify(this.schedule);
  }

  public mounted () {
    this.oldFormState = JSON.stringify(this.schedule);
  }

  private onBtnSaveChangeClick () {
    this.conservationProcess = true;
    $axios.patch(`/users/${this.$route.params.id}`, {
      schedule: this.schedule
    }).then((response: AxiosResponse) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data);
      }

      this.oldFormState = JSON.stringify(this.schedule);
      this.$toast.success('Changes accepted');
    }).catch((reason) => {
      if (reason instanceof APIError) {
        reason.errors.forEach((e) => {
          this.$toast.error(e.message);
        });
      } else {
        this.$toast.error(reason.message);
      }
    }).finally(() => (this.conservationProcess = false));
  }
}
</script>

<style scoped>

</style>
