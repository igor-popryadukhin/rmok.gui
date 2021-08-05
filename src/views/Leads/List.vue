<template>
  <v-sheet class="mb-16">
    <!-- Лиды и задачи -->
    <app-tools>
      <template #left>
        <div class="d-flex flex-column">
          <h3 class="grey--text">
            {{ $tc('Новые') }}
          </h3>
          <small
            class="grey--text"
            style="line-height: 3px;"
          >
            {{ $tc('Quantity') }}:
            <app-count-up :end-val="leadsCount" />
          </small>
        </div>
      </template>
      <template #right>
        <div class="align-self-end">
          <v-btn
            small
            tile
            text
            @click="onBtnRefreshClick"
          >
            {{ $tc('Refresh') }}
          </v-btn>
        </div>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <template v-if="leads.length > 0">
      <v-list>
        <template
          v-for="(item, itemIndex) in leads"
        >
          <v-divider
            v-if="itemIndex > 0"
            :key="`divider-${item.id}`"
          />

          <v-list-item
            :key="`list-item-${item.id}`"
            ripple
            selectable
            :to="{ name: 'contacts_view', params: { contact_id: item.id } }"
            style="min-height: 35px"
          >
            <v-list-item-content class="pa-0">
              <v-list-item-title>
                {{ item.contact_name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-btn
        v-if="leads.length >= leadsPerPage && loadMoreVisible"
        :loading="loadMoreProcess"
        block
        text
        tile
        @click="onBtnLoadMoreClick"
      >
        {{ $tc('Load more') }}
      </v-btn>
    </template>
    <template v-else-if="leadsLoading && leads.length === 0">
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
import APIError from '@/api/classes/APIError'
import { Contacts } from '@/api/Contacts'
import Contact from '@/api/interfaces/Contact'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { arrayObjectsUniqueConcat } from '@/utils/array'
import Vue from 'vue'

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
      leadsLoading: false,
      leads: [] as Contact[],
      leadsPerPage: 50,
      leadsCount: 0,
      loadMoreOffset: 0,
      loadMoreProcess: false,
      loadMoreVisible: false
    }
  },

  mounted () {
    this.loadLeads()
  },

  methods: {
    /**
     * Загружает список лидов
     */
    loadLeads () {
      this.leadsLoading = true

      // only_new = 1 Только новые
      new Contacts()
        .find({ only_new: 1, offset: this.loadMoreOffset, count: this.leadsPerPage })
        .then((response) => {
          this.leadsCount = response?.meta?.count || 0
          const newLeads = (response?.data || [])

          // Скрываю кнопку загрузить ещё, если нет данных.
          if (newLeads.length === 0) {
            this.loadMoreVisible = false
            return
          }

          this.loadMoreVisible = true

          if (this.loadMoreOffset > 0) {
            // Объединение двух массивов c проверкой уникальности
            this.leads = arrayObjectsUniqueConcat<Contact>(this.leads, newLeads, 'id')
          } else {
            this.leads = response?.data || []
          }
        }).catch((e) => {
          if (e instanceof APIError) {
            this.$toast.error(e.message, {
              onClick: () => {
                // Todo: implement set project
              }
            })
          } else {
            this.$toast.error(e.message)
          }
        }).finally(() => {
          this.leadsLoading = false
          this.loadMoreProcess = false
        })
    },

    /**
     * Происходит, когда кликнули на кнопку "Обновить"
     */
    onBtnRefreshClick () {
      this.loadMoreOffset = 0
      this.loadLeads()
    },

    /**
     * Происходит, когда кликнули на кнопку "Загрузить ещё"
     */
    onBtnLoadMoreClick () {
      this.loadMoreOffset = this.loadMoreOffset + this.leadsPerPage
      this.loadMoreProcess = true
      this.loadLeads()

      // var container = this.$el.querySelector('#container')
      // container.scrollTop = container.scrollHeight
    }
  }
})
</script>

<style lang="scss" scoped>
.border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}

.toolbar {
  &-subtitle {
    display: flex;
    flex-flow: column;
  }

  &-subtitle small {
    font-size: 12px;
    color: #848484;
  }
}

.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
