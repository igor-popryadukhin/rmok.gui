<template>
  <app-table
    :height="400"
    class="journal__table"
    outlined
    fixed-header
    dense
  >
    <template #head>
      <tr>
        <th class="text-left">
          Дата/время
        </th>
        <th class="text-left">
          Действие
        </th>
      </tr>
    </template>
    <template #body>
      <tr
        v-for="(item, key) in autodialerJournalItems"
        :key="`item-${key}-${tick}`"
        :style="itemStyle(item)"
      >
        <td>{{ $dayjs(item.created_at * 1000).format('DD.MM.YYYY HH:mm:ss') }}</td>
        <td>{{ item.text }}</td>
      </tr>
    </template>
  </app-table>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import AppTable from '@/components/AppTable/AppTable.vue'
import debounce from '@/utils/debounce'
import { mapGetters } from 'vuex'

@Component({
  components: { AppTable },
  computed: {
    ...mapGetters({
      autodialerJournalItems: 'autodialer/view/journal/items'
    })
  }
})
export default class Journal extends Base {
  tick = 0

  get paramsId (): number {
    return +this.$route.params.id
  }

  created () {
    this.onSSEJournalChange = debounce(this.onSSEJournalChange, 3000)

    // Subscribe sse events
    this.$root.$on('sse-autodialer-journal-change', this.onSSEJournalChange)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/journal/fetch', this.paramsId)

    setInterval(() => (this.tick = this.tick + 1), 5000)
  }

  beforeDestroy () {
    // Unsubscribe sse events
    this.$root.$off('sse-autodialer-journal-change', this.onSSEJournalChange)
  }

  onSSEJournalChange () {
    this.$store.dispatch('autodialer/view/journal/fetch', this.paramsId)
  }

  itemStyle (item: any) {
    const style: Record<string, any> = {}

    if (this.isAfter(item.created_at, 5)) {
      style['background-color'] = 'rgba(0,255,25,0.35)'
    } else if (this.isAfter(item.created_at, 10)) {
      style['background-color'] = 'rgba(0,255,25,0.25)'
    } else if (this.isAfter(item.created_at, 15)) {
      style['background-color'] = 'rgba(0,255,25,0.1)'
    }

    return style
  }

  isAfter (timestamp: number, val: number): boolean {
    return this.$dayjs(timestamp * 1000).isAfter(this.$dayjs().subtract(val, 'second'))
  }
}
</script>

<style lang="scss" scoped>
.journal__table {
  & table {
    table-layout: fixed; width:100%;
    & thead {
      & tr {
        & th:nth-child(1) {
          width: 1px !important;
          white-space: nowrap !important;
        }

        & th:first-child {
          border-right: 3px solid #3b71d5;
          background: #e8edff;
          color: #669;
        }

        & th:last-child {
          width: 100% !important;
          white-space: nowrap !important;
        }
      }
    }

    & tbody {
      & tr {
        & td:nth-child(1) {
          width: 1px !important;
          white-space: nowrap !important;
        }

        & td:first-child {
          border-right: 3px solid #3b71d5;
          background: #e8edff;
          color: #669;
        }

        & td:last-child {
          width: 100% !important;
          white-space: nowrap !important;
        }
      }
    }
  }
}
</style>
