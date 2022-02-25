<template>
  <v-menu
    v-model="menuVisible"
    :close-on-click="false"
    :close-on-content-click="false"
    offset-y
    tile
    @keydown.esc="menuVisible = false"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
      />
    </template>
    <v-card
      min-width="350"
      tile
      flat
    >
      <v-card-text class="px-2">
        <v-text-field
          v-model="textSearch"
          :label="$tc('Search')"
          :loading="process"
          prepend-inner-icon="mdi-magnify"
          dense
          clearable
          hide-details
          outlined
        />
      </v-card-text>

      <v-card-text
        class="px-0 py-1"
        style="height: 350px; overflow-y: auto"
      >
        <template v-if="filtered.length > 0">
          <v-list dense>
            <v-list-item-group
              v-model="autodialerId"
            >
              <v-list-item
                v-for="(item, key) in filtered"
                :key="key"
                :input-value="item.id"
                :value="item.id"
                dense
                link
                selectable
              >
                <template #default="{ active }">
                  <v-list-item-action class="ma-0 mr-3">
                    <v-checkbox
                      :input-value="active"
                      class="pa-0"
                      dense
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-html="highlight(item.name, textSearchWords)" />
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </template>
        <template v-else>
          <div class="d-flex align-center justify-center fill-height">
            <div v-if="process">
              <app-loading />
            </div>
            <div v-else>
              {{ $tc('No data') }}
            </div>
          </div>
        </template>
      </v-card-text>

      <v-card-text class="px-2 py-0">
        <v-divider />
      </v-card-text>

      <!-- Действия -->
      <v-card-text class="px-2 py-0">
        <v-list dense>
          <v-list-item
            :disabled="addingProcess || !autodialerId"
            dense
            link
            @click="onAddClick"
          >
            <v-list-item-title>{{ $tc('add', contactsListSelectedCount) }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :disabled="process"
            dense
            link
            @click="menuVisible = false"
          >
            <v-list-item-title>{{ $tc('Cancel') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <!-- Действия -->
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import ContactTag from '@/api/interfaces/ContactTag'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import debounce from '@/utils/debounce'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

@Component({
  components: { AppLoading }
})
export default class ContactsListMenuAddToAutodialer extends AppBase {
  first = true
  addingProcess = false
  process = false
  menuVisible = false
  textSearch = null
  autodials = []
  filtered = []
  autodialerId = 0

  get textSearchWords (): string[] {
    return (this.textSearch || '')
      .split(/\s+/s)
      .filter((value) => !!value)
  }

  get contactsListSelectedAll (): boolean { return this.$store.getters['contacts/list/selected_all'] }
  get contactsListSelectedCount () { return this.$store.getters['contacts/list/selected_count'] }
  get contactsListItemsSelected () { return this.$store.getters['contacts/list/items_selected'] }
  get contactFilter () {
    const params: Record<string, unknown> = this.$store.getters['contacts/list/filter/all']

    if ('offset' in params) { delete params.offset }
    if ('count' in params) { delete params.count }
    if ('order_by' in params) { delete params.order_by }
    if ('order_direction' in params) { delete params.order_direction }

    return params
  }

  @Watch('textSearch')
  textSearchWatchHandler (val: string|null) {
    this.searchAutodialsInLocal(val || '')
  }

  @Watch('menuVisible')
  menuVisibleWatchHandler (val: boolean) {
    if (val) {
      this.searchAutodialsInLocal()
    }
  }

  created () {
    this.searchAutodialsInServer = debounce(this.searchAutodialsInServer, 350)
    this.searchAutodialsInLocal = debounce(this.searchAutodialsInLocal, 350)
  }

  private onAddClick () {
    this.addingProcess = true
    this.$axios.post(`/auto-dialers/${this.autodialerId}/add-contacts`, {
      contact_ids: (this.contactsListItemsSelected || []).map((e) => e.id)
    }).then((response: AxiosResponse) => {
      if (![200, 202].includes(response.status)) {
        throw new APIError(response?.data)
      }

      this.$store.dispatch('contacts/list/unselect_all')
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    }).finally(() => {
      this.addingProcess = false
      this.menuVisible = false
    })
  }

  /**
   * Поиск автодозвонов на сервере.
   *
   * @param q
   * @private
   */
  private searchAutodialsInServer (q: string) {
    this.process = true
    this.$axios.get('/auto-dialers', { params: { q, count: 10 } })
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response?.data || response.statusText)
        }

        (response.data?.data || []).forEach((value) => {
          if (this.autodials.findIndex((e) => e.id === value.id) === -1) {
            this.autodials.push(value)
          }
        })

        this.filtered = response.data?.data || []
      }).finally(() => (this.process = false))
  }

  /**
   * Поиск автодозвонов
   *
   * Сначала выполняется поиск в локальном хранилище, а после в удалённом.
   * @param q
   */
  private searchAutodialsInLocal (q = '') {
    const found = this.autodials.filter((e: ContactTag) => e.name.toLowerCase().indexOf(q.toLowerCase()) > -1)

    if (found.length === 0) {
      this.searchAutodialsInServer(q)
    } else {
      this.filtered = found
    }
  }

  /**
   *
   * @param text
   * @param words
   * @param tag
   * @private
   */
  private highlight (text: string, words: string[], tag = 'span') {
    let i
    const len = words.length
    let re
    for (i = 0; i < len; i++) {
      re = new RegExp(words[i], 'gis')
      if (re.test(text)) {
        text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>')
      }
    }
    return text
  }
}
</script>

<style lang="scss">
.highlight {
  background-color: #ffeb3b;
}
</style>

<i18n>
{
  "ru": {
    "add": "Нет контактов|Добавить {n} контакт|Добавить {n} контакта|Добавить {n} контактов"
  }
}
</i18n>
