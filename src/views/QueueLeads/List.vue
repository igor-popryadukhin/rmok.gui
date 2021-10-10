<template>
  <v-sheet class="mb-16">
    <!-- Лиды и задачи -->
    <app-tools>
      <template #left>
        <div class="d-flex flex-column">
          <h3 class="grey--text">
            {{ $tc('Queue') }}
          </h3>
          <small
            class="grey--text"
            style="line-height: 3px;"
          >
            {{ $tc('Quantity') }}:
            <app-count-up :end-val="contactsTotal" />
          </small>
        </div>
      </template>
      <template #right>
        <div class="align-self-end">
          <v-btn
            :disabled="queueProcess.visible"
            small
            tile
            text
            outlined
            min-width="100"
            @click="onBtnRefreshClick"
          >
            <template v-if="queueProcess.visible">
              <v-progress-linear
                v-model="queueProcess.progress"
                :indeterminate="queueProcess.progress === 0"
              />
            </template>
            <template v-else>
              {{ $tc('Refresh') }}
            </template>
          </v-btn>
        </div>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <template v-if="contactsItems.length > 0">
      <v-simple-table
        class="table-contact-list"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $tc('Name') }}
              </th>

              <th class="text-left">
                {{ $tc('Result') }}
              </th>

              <th class="text-left">
                {{ $tc('Дата/Время последнего звонка') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in contactsItems"
              :key="'tr-' + item.id"
            >
              <!-- Имя контакта -->
              <td :style="{ 'border-left': `6px solid ${item.color || null}` }">
                <router-link :to="{ name: 'contacts_view', params: { contact_id: item.id } }">
                  {{ item.name }}
                </router-link>
                <v-icon
                  v-if="item.icon"
                  :color="item.color"
                  small
                >
                  {{ item.icon }}
                </v-icon>
              </td>
              <!-- Имя контакта -->

              <!-- Статус/Результат -->
              <td>
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
                {{ item.weight }}
              </td>
              <!-- Статус/Результат -->

              <td>
                <template v-if="item.last_call_at">
                  {{ $dayjs(item.last_call_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                </template>
                <template v-else>
                  —
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
    <template v-else-if="contactsProcessLoading && contactsItems.length === 0">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          {{ $tc('Empty') }}
        </div>
      </div>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { $axios } from '@/plugins/axios'
import { debounce } from 'vuetify/src/util/helpers'
import SSEMessage from '@/interfaces/SSEMessage'

interface Data {
  [key: string]: any
}

interface Methods {
  [key: string]: any
}

interface Computed {
  [key: string]: any
}

export default Vue.extend<Data, Methods, Computed>({
  components: { AppLoading, AppCountUp },

  data (): Data {
    return {
      contactsProcessLoading: false,
      contactsTotal: 0,
      contactsItems: [],

      queueProcess: {
        visible: false,
        total: 0,
        progress: 0,
        text: ''
      }
    }
  },

  async mounted () {
    // Всегда загружаем самый свежий список
    this.loadContacts()
    this.SSEContactsQueueComputeProcess = debounce(this.SSEContactsQueueComputeProcess, 1000)

    this.$root.$on('sse-queue-compute-process', this.SSEContactsQueueComputeProcess)
  },

  beforeDestroy () {
    this.$root.$off('sse-queue-compute-process', this.SSEContactsQueueComputeProcess)
  },

  methods: {
    /**
     * Запускает на сервере процесс вычисления параметров очереди.
     */
    computeQueue () {
      this.queueProcess.visible = true
      $axios.get('/contacts/queue/compute')
    },

    /**
     * Загрузит контакты с сервера.
     */
    loadContacts () {
      this.queueProcess.visible = true
      this.queueProcess.progress = 0
      new Contacts()
        .find({ queue: 1, count: 500 })
        .then((response) => {
          this.contactsTotal = response.meta?.count || 0
          this.contactsItems = response.data || []
        }).finally(() => (this.queueProcess.visible = false))
    },

    /**
     * Происходит при нажатии на кнопку "Обновить".
     */
    onBtnRefreshClick () {
      this.computeQueue()
    },

    /**
     * SSE уведомление с сервера процесса вычисления.
     *
     * @constructor
     */
    SSEContactsQueueComputeProcess (message: SSEMessage) {
      if (message.payload.status === 'progress') {
        this.queueProcess.progress = +message.payload.percent
        this.queueProcess.visible = true
      } else if (message.payload.status === 'success') {
        this.loadContacts()
      } else if (message.payload.status === 'failure') {
        this.queueProcess.visible = false
        this.queueProcess.progress = 0

        this.$toast.error(message.payload.message)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.table-contact-list {

  thead {
    th:not(:first-child) {
      white-space: nowrap;
      padding: 0 10px 0 10px!important;
    }
  }
  tbody {
    tr {
      white-space: nowrap;

      td {
        padding: 0 10px 0 10px !important;
      }

      td:not(:first-child) {
        padding: 0 5px 0 5px !important;
      }

      td:nth-child(2) {
        width: 100px;
      }

      td:last-child {
        width: 100px;
      }
    }
    //tr:nth-child(n+1) {
    //  td:first-child {
    //    border-left: 4px solid #f4355b;
    //  }
    //}
    //tr:nth-child(n+15) {
    //  td:first-child {
    //    border-left: 4px solid #f9dd74;
    //  }
    //}
    //
    //tr:nth-child(n+30) {
    //  td:first-child {
    //    border-left: 4px solid #53f989;
    //  }
    //}

  }
}

</style>
