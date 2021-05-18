<template>
  <DialogCard
    :actions="actions"
  >
    <template v-slot:title>
      <v-card-title>{{ $t('Установить текущий проект') }}</v-card-title>
    </template>

    <v-list>
      <template
        v-for="(item, key) in items"
      >
        <v-list-item
          :key="key"
        >
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
        <v-divider :key="`v-divider-${key}`" />
      </template>
    </v-list>
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppProjectDialogSelect',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: String,
      default () {
        return null
      }
    }
  },

  data () {
    return {
      option: null as string | null
    }
  },

  mounted () {
    this.option = this.value
  },

  watch: {
    value (value: any) {
      this.option = value
    }
  },

  methods: {}
})
</script>

<style scoped>

</style>
