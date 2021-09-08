<template>
  <v-autocomplete
    v-model="selected"
    :items="statuses"
    :multiple="multiple"
    :search-input.sync="q"
    item-value="id"
    item-text="name"
    item-color="color"
    dense
    outlined
    hide-details
    clearable
    hide-selected
    @input="(val) => $emit('change', val)"
    @keyup="onAutocompleteUpdateSearchInput(q, $event)"
  >
    <template
      v-if="multiple"
      #item="{ item, on, attrs }"
    >
      <v-list-item
        v-bind="attrs"
        :color="item.color"
        :input-value="item.id"
        v-on="on"
      >
        {{ item.name }}
      </v-list-item>
    </template>

    <template
      v-if="multiple"
      #selection="{ item }"
    >
      <v-chip
        :color="item.color"
        outlined
        label
        x-small
      >
        {{ item.name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { mapActions, mapGetters } from 'vuex'

const charCodes: string[] = [
  'KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyI', 'KeyJ', 'KeyK', 'KeyL',
  'KeyM', 'KeyN', 'KeyO', 'KeyP', 'KeyQ', 'KeyR', 'KeyS', 'KeyT', 'KeyU', 'KeyV', 'KeyW', 'KeyX',
  'KeyY', 'KeyZ', 'Space', 'Backspace', 'Backquote', 'Period', 'BracketRight', 'BracketLeft', 'NumpadAdd',
  'NumpadSubtract', 'NumpadMultiply', 'NumpadDivide', 'Delete'
]

const numberCodes: string[] = []
for (let i = 0; i < 9; i++) {
  numberCodes.push('Numpad' + i)
  numberCodes.push('Digit' + i)
}

const keyCodes: string[] = numberCodes.concat(charCodes)

const fetchStatusesDebounce = debounce(function handle (ctx: any, params = {}) {
  ctx.fetchStatuses(params)
}, 450)

export default Vue.extend({
  name: 'AppStatusSelect',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, Object, Array],
      default: null
    }
  },

  data () {
    return {
      q: null,
      qOld: null,
      selected: 0 as number | number[]
    }
  },

  computed: {
    ...mapGetters({
      statuses: 'statuses/items'
    })
  },

  watch: {
    value (val: number | number[]) {
      this.selected = val
    }
  },

  mounted () {
    this.selected = this.value

    this.$appDebug(keyCodes)

    if (this.statuses.length === 0) {
      this.fetchStatuses()
    }
  },

  methods: {
    ...mapActions({
      fetchStatuses: 'statuses/items'
    }),

    onAutocompleteUpdateSearchInput (val: string, event: KeyboardEvent) {
      if (keyCodes.includes(event.code)) {
        if (this.qOld !== this.q) {
          this.qOld = this.q
          fetchStatusesDebounce(this, {
            q: val
          })
        }
      }
    }
  }
})
</script>

<style scoped>

</style>
