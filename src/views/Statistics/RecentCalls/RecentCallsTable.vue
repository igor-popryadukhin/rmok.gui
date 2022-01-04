<template>
  <v-simple-table
    :height="height"
    class="simple-table"
    fixed-header
    dense
  >
    <template #default>
      <thead>
        <tr>
          <th class="text-left">
            {{ $tc('Date time') }}
          </th>
          <th
            class="text-left"
          >
            {{ $tc('Client') }}
          </th>
          <th class="text-left">
            {{ $tc('Result') }}
          </th>
          <th
            class="text-left"
          >
            {{ $tc('Comment') }}
          </th>
          <th class="text-left">
            {{ $tc('Duration') }}
          </th>
          <th class="text-left">
            {{ $tc('Manager') }}
          </th>
          <th class="text-left" />
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, key) in items">
          <tr
            :key="key"
          >
            <td class="column-datetime text-no-wrap">
              <template v-if="item.created_at">
                {{ $dayjs(item.created_at).format('DD.MM.YYYY HH:mm') }}
              </template>
              <template v-else>
                —
              </template>
            </td>

            <!-- Имя контакта -->
            <td class="column-client text-no-wrap">
              {{ item.contact.full_name }}
            </td>
            <!-- Имя контакта -->

            <!-- Статус/Результат -->
            <td class="column-status-result text-no-wrap">
              <template v-if="item.status">
                <v-chip
                  :color="item.status.color"
                  x-small
                  label
                  outlined
                  @click.stop="$emit('click:item:status', item.status.id)"
                >
                  {{ item.status.name }}
                </v-chip>
              </template>
              <template v-else>
                —
              </template>
            </td>
            <!-- Статус/Результат -->

            <!-- Комментарий -->
            <td class="column-comment text-no-wrap">
              {{ $string.truncate(item.comment, 20) }}
            </td>
            <!-- Комментарий -->

            <!--  -->
            <td class="column-duration text-no-wrap">
              {{ item.call_duration || '--:--:--' }}
            </td>
            <!--  -->

            <!-- Менеджер -->
            <td class="column-manager text-no-wrap">
              <template v-if="item.owner">
                {{ item.owner.full_name }}
              </template>
              <template v-else>
                —
              </template>
            </td>
            <!-- Менеджер -->

            <!--  -->
            <td class="column-action text-no-wrap">
              <v-btn
                icon
                x-small
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </td>
            <!--  -->
          </tr>
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import AppBase from '@/AppBase'
import { Prop } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<RecentCallsTable>({
  components: { AppMenuDatePicker, AppAutocomplete }
})
export default class RecentCallsTable extends AppBase {
  @Prop({ default: () => 400 }) readonly height: number

  get items () { return this.$store.getters['statistics/recent_calls/history'] }
}
</script>

<style lang="scss" scoped>

.simple-table {}
.simple-table thead th {}
.simple-table tr {}
.simple-table tr td {
  height: 25px !important;
  font-size: 12px !important;
}
.column-datetime {
  width: 10px;
}
.column-client {
  width: auto;
}
.column-status-result {
  width: 10px;
}
.column-comment {
  width: 10px;
}
.column-duration {
  width: 10px;
}
.column-manager {
  width: 10px;
}
.column-action {
  width: 10px;
}
</style>
