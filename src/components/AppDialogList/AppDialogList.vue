<template>
  <v-card
    tile
    flat
  >
    <v-card-text class="pt-5">
      <v-list>
        <template v-for="(item, key) in options">
          <v-list-item
            :key="key"
            @click="itemClick(item)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item[itemText] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider :key="`v-divider-${key}`" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppDialogList',

  props: {
    options: {
      default: () => [],
      type: Array
    },

    itemText: {
      default: 'title',
      type: String
    },

    itemValue: {
      default: 'id',
      type: String
    },

    itemColor: {
      default: '',
      type: String
    },

    onItemClick: {
      type: Function,
      default: null
    }
  },

  data () {
    return {}
  },

  mounted () {
    setTimeout(() => {
      this.$emit('close')
    }, 3000)
  },

  methods: {
    itemClick (item: any) {
      if (typeof this.onItemClick === 'function') {
        this.onItemClick(item)
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
