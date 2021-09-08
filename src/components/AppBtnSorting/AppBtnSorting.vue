<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-btn-toggle
        dense
        tile
      >
        <v-btn
          v-bind="attrs"
          small
          tile
          v-on="on"
        >
          {{ name || label }}
        </v-btn>
        <v-btn
          :disabled="!sort.order_by"
          small
          tile
          icon
          @click="onDirectionClick(sort.order_direction = sort.order_direction === 'asc' ? 'desc' : 'asc')"
        >
          <v-icon v-if="sort.order_direction === 'asc'">
            mdi-sort-ascending
          </v-icon>
          <v-icon v-else>
            mdi-sort-descending
          </v-icon>
        </v-btn>
        <v-btn
          v-if="sort.order_by"
          small
          tile
          icon
          @click="onBtnResetClick"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
        @click="onListItemClick(item)"
      >
        <v-list-item-title>{{ item[itemText] }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface Sort {
  order_by: string;
  order_direction: 'asc' | 'desc';

  [key: string]: any;
}

export default Vue.extend({
  name: 'AppBtnSorting',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Object as PropType<Sort>,
      default: () => null
    },
    items: {
      type: Array as PropType<Sort[]>,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'name'
    },
    t: {
      type: Function,
      default: (name: string) => name
    }
  },

  data () {
    return {
      name: '',
      sort: {
        order_by: '',
        order_direction: 'asc'
      } as Sort,
      menu: false
    }
  },

  mounted () {
    if (this.value) {
      this.sort = this.value as Sort
      this.changeName()
    }
    this.$watch('value', (val: Sort) => {
      this.sort = val
    })
  },

  methods: {
    onListItemClick (item: Sort) {
      this.sort.order_by = item.order_by
      this.changeName()
      this.$emit('change', this.sort)
    },

    onDirectionClick (order_direction: 'asc' | 'desc') {
      this.sort.order_direction = order_direction
      this.changeName()
      this.$emit('change', this.sort)
    },

    onBtnResetClick () {
      this.sort.order_by = ''
      this.sort.order_direction = 'asc'
      this.changeName()
      this.$emit('change', this.sort)
    },

    changeName () {
      this.name = this.items.find((e) => e.order_by === this.sort.order_by)?.[this.itemText]
    }
  }
})
</script>

<style scoped>

</style>
