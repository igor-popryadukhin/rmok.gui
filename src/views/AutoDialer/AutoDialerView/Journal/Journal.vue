<template>
  <div>
    <template v-if="processLoading">
      <div
        class="d-flex fill-height align-center justify-center"
      >
        <div class="grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-simple-table
        class="contact-list"
        fixed-header
        dense
      >
        <template #default>
          <thead>
            <tr class="contact-list__th">
              <th class="text-left">
                {{ $tc('Action') }}
              </th>
              <th class="text-left">
                {{ $tc('Originator') }}
              </th>
              <th class="text-left">
                {{ $tc('Date time') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="items.length > 0">
              <tr
                v-for="(item, key) in items"
                :key="key"
                class="contact-list__tr"
              >
                <td class="contact-list__td_action-text">
                  {{ item.action_text }}
                </td>
                <td class="contact-list__td_originator">
                  {{ item.originator.full_name }}
                </td>
                <td class="contact-list__td_created-at">
                  {{ $dayjs(item.created_at).format('DD.MM.YYYY HH:mm') }}
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
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from '../Base'
import AppTable from '@/components/AppTable/AppTable.vue'
import { mapGetters } from 'vuex'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

@Component({
  components: { AppLoading, AppTable },
  computed: {
    ...mapGetters({
      autodialerJournalItems: 'autodialer/view/journal/items'
    })
  }
})
export default class Journal extends Base {
  processLoading = true

  get items (): Array<Record<string, unknown>> {
    return this.$store.getters['autodialer/view/journal/items']
  }

  created () {
    this.$root.$on('sse:autodialer:journal:change', this.onSSEJournalChange)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/journal/fetch')
      .finally(() => (this.processLoading = false))
  }

  beforeDestroy () {
    this.$root.$off('sse:autodialer:journal:change', this.onSSEJournalChange)
  }

  onSSEJournalChange (data: Record<string, unknown>) {
    const items = this.items.map(e => e)
    items.unshift(data)
    items.pop()
    this.$store.commit('autodialer/view/journal/items', items)
  }

  isAfter (timestamp: number, val: number): boolean {
    return this.$dayjs(timestamp * 1000).isAfter(this.$dayjs().subtract(val, 'second'))
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
  cursor: pointer;
  user-select: none;
}

.contact-list__td_action-text {
  text-align: left;
  width: auto;
  white-space: nowrap !important;
}

.contact-list__td_originator {
  width: 10px;
  white-space: nowrap !important;
}

.contact-list__td_created-at {
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
