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
        />
      </v-card-text>
      <!-- Поиск тегов -->
      <v-card-text
        class="px-0 py-1"
        style="max-height: 300px; overflow-y: auto"
      >
        <template v-if="filtered.length > 0">
          <v-list dense>
            <v-list-item-group
              v-model="tagsSelected"
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
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </template>
        <template v-else>
          <div class="text-center">
            {{ $tc('Empty') }}
          </div>
        </template>
      </v-card-text>

      <v-card-text class="px-0 py-0">
        <v-divider />
      </v-card-text>

      <!-- Действия -->
      <v-card-text class="px-0 py-0">
        <v-list dense>
          <template v-if="tagsSelected.length === 0">
            <v-list-item
              :disabled="process || processOfCreation || !textSearch"
              dense
              link
              @click="onCreateTagClick(textSearch)"
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
              :disabled="process"
              dense
              link
              @click="onApplyTagClick"
            >
              <v-list-item-title>{{ $tc('Apply') }}</v-list-item-title>
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
import Vue from 'vue'
import { mapGetters } from 'vuex'
import debounce from '@/utils/debounce'
import ContactTag from '@/api/interfaces/ContactTag'
import { Contacts } from '@/api/Contacts'
import { randomColor } from '@/utils/utils'

export default Vue.extend({
  name: 'AppMenuTags',

  data () {
    return {
      processOfCreation: false,
      process: false,
      menuVisible: false,
      textSearch: null,
      filtered: [],
      tagsSelected: []
    }
  },

  computed: {
    ...mapGetters({
      tags: 'filter/contact_tags'
    })
  },

  watch: {
    textSearch (val?: string) {
      this.search(val || '')
    }
  },

  created () {
    this.searchTags = debounce(this.searchTags, 350)
  },

  mounted () {
    this.filtered = this.tags
  },

  methods: {
    onCreateTagClick (name: string) {
      this.processOfCreation = true
      new Contacts()
        .addTag({
          name,
          color: randomColor()
        }).finally(() => {
          this.processOfCreation = false
          this.searchTags(name)
        })
    },

    onApplyTagClick () {
      this.menuVisible = false
      this.$emit('update:apply', this.tagsSelected)
      this.tagsSelected = []
    },

    /**
     * Поиск тегов в удалённом хранилище.
     */
    searchTags (q: string) {
      this.process = true
      this.$store.dispatch('filter/contact_tags', { q })
        .then(() => {
          this.filtered = this.tags
        }).finally(() => (this.process = false))
    },

    /**
     * Поиск тегов.
     * Сначала выполняется поиск в локальном хранилище, а после в удалённом.
     * @param q
     */
    search (q: string) {
      const found = this.tags.filter((e: ContactTag) => e.name.toLowerCase().indexOf(q.toLowerCase()) > -1)

      if (found.length === 0) {
        this.searchTags(q)
      } else {
        this.filtered = found
      }
    }
  }
})
</script>

<style scoped>

</style>
