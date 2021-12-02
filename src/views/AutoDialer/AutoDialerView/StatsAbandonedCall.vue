<template>
  <v-sheet
    :height="400"
    class="pa-1"
    outlined
  >
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
      <app-table
        :height="250"
        class="operators-online__table"
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
            v-for="(item, key) in []"
            :key="key"
          >
            <td>{{ $dayjs(item.created_at * 1000).format('DD.MM.YYYY HH:mm:ss') }}</td>
            <td>{{ item.text }}</td>
          </tr>
        </template>
      </app-table>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import { Prop } from 'vue-property-decorator'
import AppTable from '@/components/AppTable/AppTable.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

@Component({
  components: { AppLoading, AppTable }
})
export default class StatsAbandonedCall extends Base {
  @Prop({ default: 0 }) readonly height?: number
  @Prop({ default: false }) readonly outlined: boolean

  processLoading = false
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
