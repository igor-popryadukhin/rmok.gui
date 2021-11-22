<template>
  <app-table
    :height="250"
    class="operators-online__table"
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
          Количество онлайн
        </th>
      </tr>
    </template>
    <template #body>
      <tr
        v-for="(item, key) in autodialerStatsOnlineItems"
        :key="key"
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
import { Prop } from 'vue-property-decorator'
import AppTable from '@/components/AppTable/AppTable.vue'
import { mapGetters } from 'vuex'
import debounce from '@/utils/debounce'

@Component({
  components: { AppTable },
  computed: {
    ...mapGetters({
      autodialerStatsOnlineItems: 'autodialer/view/stats_online/items'
    })
  }
})
export default class OperatorsOnline extends Base {
  @Prop({ default: 0 }) readonly height?: number
  @Prop({ default: false }) readonly outlined: boolean

  get paramsId (): number {
    return +this.$route.params.id
  }

  created () {
    this.onSSEStatsChange = debounce(this.onSSEStatsChange, 3000)

    // Subscribe sse events
    this.$root.$on('sse-autodialer-stats-change', this.onSSEStatsChange)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/stats_online/fetch', this.paramsId)
  }

  beforeDestroy () {
    // Unsubscribe sse events
    this.$root.$off('sse-autodialer-stats-change', this.onSSEStatsChange)
  }

  onSSEStatsChange () {
    this.$store.dispatch('autodialer/view/stats_online/fetch', this.paramsId)
  }
}
</script>

<style lang="scss" scoped>
.operators-online__table {
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
