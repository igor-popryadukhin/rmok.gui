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
      <!-- Поиск тегов -->
      <v-card-text class="px-2">
        <v-text-field
          v-model="textSearch"
          :label="$tc('Search tags')"
          :loading="process"
          prepend-inner-icon="mdi-magnify"
          dense
          clearable
          hide-details
          outlined
        />
      </v-card-text>
      <!-- Поиск тегов -->
      <v-card-text
        class="px-0 py-1"
        style="height: 350px; overflow-y: auto"
      >
        <template v-if="filtered.length > 0">
          <v-list dense>
            <v-list-item-group
              v-model="selected"
              multiple
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
          <template v-if="selected.length === 0">
            <v-list-item
              :disabled="process || processOfCreation || !textSearch"
              dense
              link
              @click="createTag(textSearch)"
            >
              <v-list-item-title v-if="textSearch && filtered.length === 0">
                "{{ textSearch }}" {{ $tc('Create') }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ $tc('Create') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item
              :disabled="assignProcess"
              dense
              link
              @click="onAssignTagClick"
            >
              <v-list-item-title>{{ $tc('apply', contactsListSelectedCount) }}</v-list-item-title>
            </v-list-item>
          </template>
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
import { $axios } from '@/plugins/axios'
import debounce from '@/utils/debounce'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

@Component({
  components: { AppLoading }
})
export default class ContactsMenuAssignTags extends AppBase {
  first = true
  assignProcess = false
  processOfCreation = false
  process = false
  menuVisible = false
  textSearch = null
  tags = []
  filtered = []
  selected = []

  get textSearchWords (): string[] {
    return (this.textSearch || '')
      .split(/\s+/s)
      .filter((value) => !!value)
  }

  get contactsListSelectedCount () { return (this.$store.getters['contacts/list/selected_count'] || []) }
  get contactsListItemsSelected () { return this.$store.getters['contacts/list/items_selected'] || [] }
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
    this.searchTagsInLocal(val || '')
  }

  @Watch('menuVisible')
  menuVisibleWatchHandler (val: boolean) {
    if (val) {
      this.searchTagsInLocal()
    }
  }

  created () {
    this.searchTagsInServer = debounce(this.searchTagsInServer, 350)
    this.searchTagsInLocal = debounce(this.searchTagsInLocal, 350)
  }

  private onAssignTagClick () {
    const request: Record<string, unknown> = {}

    request.tag_ids = this.selected

    this.assignProcess = true
    this.$axios.post('/contacts/tags/set', {
      contact_ids: this.contactsListItemsSelected.map((e) => e.id),
      tag_ids: this.selected
    }).then((response: AxiosResponse) => {
      if (![200, 202].includes(response.status)) {
        throw new APIError(response?.data)
      }
      this.$toast.success('Tags assigned')
      this.$store.commit('contacts/list/items_selected', [])
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    }).finally(() => {
      this.assignProcess = false
      this.menuVisible = false
    })
  }

  /**
   * Создаёт новый тег
   *
   * @param name
   * @private
   */
  private createTag (name: string) {
    this.processOfCreation = true
    $axios.post('/contacts/tags', { name })
      .then((response: AxiosResponse) => {
        if (![200, 201].includes(response.status)) {
          throw new APIError(response?.data || response.statusText)
        }
        this.$toast.success(this.$t('tag_added', { name }))
        this.searchTagsInServer(name)
      }).catch((reason: Error) => {
        this.$toast.error(reason.message)
      }).finally(() => (this.processOfCreation = false))
  }

  private searchTagsInServer (q: string) {
    this.process = true
    this.$axios.get('/contacts/tags', { params: { q, count: 10 } })
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response?.data || response.statusText)
        } else {
          (response.data?.data || []).forEach((value: any) => {
            if (this.tags.findIndex((e: any) => e.id === value.id) === -1) {
              this.tags.push(value)
            }
          })

          this.filtered = response.data?.data || []
        }
      }).finally(() => (this.process = false))
  }

  /**
   * Поиск тегов.
   * Сначала выполняется поиск в локальном хранилище, а после в удалённом.
   * @param q
   */
  private searchTagsInLocal (q = '') {
    const found = this.tags.filter((e: ContactTag) => e.name.toLowerCase().indexOf(q.toLowerCase()) > -1)

    if (found.length === 0) {
      this.searchTagsInServer(q)
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
    "apply": "Нет контактов|Применить для {n} контакта|Применить для {n} контактов|Применить для {n} контактов",
    "tag_added": "Добавлен новый тег [{name}]"
  }
}
</i18n>
