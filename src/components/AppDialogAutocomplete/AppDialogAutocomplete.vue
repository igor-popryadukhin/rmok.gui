<template>
  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-autocomplete
        v-model="selected"
        :search-input.sync="query"
        :items="options"
        :item-text="itemText"
        :item-value="itemValue"
        :return-object="returnObject"
        outlined
        dense
      />
    </v-card-text>
    <v-divider />
    <v-card-actions class="d-flex justify-end px-4">
      <div>
        <v-btn
          text
          tile
          @click="$emit('cancel')"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="!selected"
          text
          tile
          @click="$emit('ok', selected)"
        >
          {{ $tc(okTitle) }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

@Component
export default class AppDialogAutocomplete extends Vue {
  @Prop({ default: 'text' }) readonly itemText: string
  @Prop({ default: 'value' }) readonly itemValue: string
  @Prop({ default: false }) readonly returnObject: boolean
  @Prop({ default: '' }) readonly title: string
  @Prop({ default: 'Save' }) readonly okTitle: string
  @Prop({ type: Function, default: null }) readonly onMounted?: CallableFunction
  @Prop({ type: Function, default: null }) readonly onSearch?: CallableFunction
  @Prop({ type: Function, default: null }) readonly onSelect?: CallableFunction

  query = ''
  options = []
  selected = null

  @Watch('query', {})
  onWatchQuery (val: string) {
    if (typeof this.onSearch === 'function') {
      this.onSearch(val, (items: Array<Record<string, unknown>> | string[]) => {
        this.options = items
      })
    }
  }

  @Watch('selected', {})
  onWatchSelected (val: Array<Record<string, unknown>> | string[]) {
    if (typeof this.onSelect === 'function' && val) {
      this.onSelect(val)
    }
  }

  mounted () {
    if (typeof this.onMounted === 'function') {
      this.onMounted((items: Array<Record<string, unknown>> | string[]) => {
        this.options = items
      })
    }
  }
}
</script>

<style scoped>

</style>
