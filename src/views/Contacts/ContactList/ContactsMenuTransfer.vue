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
      {{ contactsSelectedLength }}

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
export default class ContactsMenuAddToAutodialer extends AppBase {
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
      .filter(value => !!value)
  }

  get contactsSelectedLength () { return (this.$store.getters['contacts/list/items_selected'] || []).length }
  get contactsSelected () { return this.$store.getters['contacts/list/items_selected'] }

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
