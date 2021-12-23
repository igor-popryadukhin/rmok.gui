<template>
  <v-simple-table
    :height="height"
    class="contact-list"
    fixed-header
    dense
  >
    <template #default>
      <thead>
        <tr class="contact-list__th">
          <th class="text-left">
            {{ $tc('Contact name') }}
          </th>
          <th class="text-left">
            {{ $tc('Result') }}
          </th>
          <th class="text-left">
            {{ $tc('Progress') }}
          </th>
          <th class="text-left">
            {{ $tc('Calling') }}
          </th>
          <th class="text-left">
            {{ $tc('Attempts left') }}
          </th>
          <th class="text-left">
            {{ $tc('Last call at') }}
          </th>
          <th class="text-left">
            {{ $tc('Next call at') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="calls.length > 0">
          <tr
            v-for="(item, key) in calls"
            :key="key"
            class="contact-list__tr"
          >
            <td class="contact-list__td contact-list_contact-name">
              {{ item.contact_name }}
            </td>
            <td class="contact-list__td contact-list_contact-status">
              <template v-if="item.last_status">
                <v-chip
                  :color="item.last_status.color"
                  x-small
                  label
                  outlined
                >
                  {{ item.last_status.name }}
                </v-chip>
              </template>
              <template v-else>
                —
              </template>
            </td>
            <td class="contact-list__td contact-list_progress">
              <v-chip
                v-if="item.progress === 'init'"
                color="#ffc107"
                label
                x-small
              >
                {{ $tc('Init') }}
              </v-chip>
              <v-chip
                v-if="item.progress === 'process'"
                color="blue"
                text-color="white"
                label
                x-small
              >
                {{ $tc('In progress') }}
              </v-chip>
              <v-chip
                v-if="item.progress === 'complete'"
                color="green"
                text-color="white"
                label
                x-small
              >
                {{ $tc('Complete') }}
              </v-chip>
            </td>
            <td class="contact-list__td contact-list_calling">
              <template v-if="item.is_calling">
                <v-icon
                  class="shake"
                  size="16"
                >
                  mdi-phone-ring
                </v-icon>
              </template>
              <template v-else>
                —
              </template>
            </td>
            <td class="contact-list__td contact-list_attempts">
              {{ item.attempts_left }}
            </td>
            <td class="contact-list__td contact-list_last-call-at">
              <template v-if="item.last_call_at">
                {{ $dayjs(item.last_call_at).format('DD.MM.YYYY HH:mm') }}
              </template>
              <template v-else>
                —
              </template>
            </td>
            <td class="contact-list__td contact-list_next-call-at">
              <template v-if="item.next_call_at">
                {{ $dayjs(item.next_call_at).format('DD.MM.YYYY HH:mm') }}
              </template>
              <template v-else>
                —
              </template>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            :style="{ height: `${height - 32}px` }"
            class="text-center fill-height"
          >
            <td colspan="6">
              {{ $tc('No record found') }}
            </td>
          </tr>
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import AppBase from '@/AppBase'
import { Prop } from 'vue-property-decorator'

@Component
export default class List extends AppBase {
  @Prop({ default: 200 }) readonly height: number;

  get calls () {
    return this.$store.getters['autodialer/view/calls/items']
  }
}
</script>

<style lang="scss" scoped>
.contact-list {}
.contact-list__th {
  cursor: pointer;
  user-select: none;
  white-space: nowrap !important;
}
.contact-list__tr {
  color: #5f6060;
  cursor: pointer;
  user-select: none;
  white-space: nowrap !important;
}

.contact-list__tr:nth-child(odd) {background-color: #607d8b17;}
.contact-list__tr:nth-child(even) {background-color: inherit;}
.contact-list__td {
  font-size: 13px !important;
  cursor: pointer;
  user-select: none;
}
.contact-list_contact-name {
  text-align: left;
  text-transform: uppercase;
  width: auto;
  white-space: nowrap !important;
}
.contact-list_contact-status {
  width: 10px;
  white-space: nowrap !important;
}
.contact-list_progress {
  width: 10px;
  white-space: nowrap !important;
}
.contact-list_calling {
  text-align: center;
  width: 10px;
  white-space: nowrap !important;
}
.contact-list_attempts {
  text-align: center;
  width: 10px;
  white-space: nowrap !important;
}
.contact-list_last-call-at {
  width: 10px;
  white-space: nowrap !important;
}
.contact-list_next-call-at {
  width: 10px;
  white-space: nowrap !important;
}

.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 1s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

</style>
