<template>
  <v-autocomplete
    v-model="vModel"
    :error-messages="errorMessages"
    :search-input.sync="query"
    :items="options"
    :item-text="itemText"
    :item-value="itemValue"
    :item-color="itemColor"
    :return-object="returnObject"
    :label="label"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :loading="loading"
    :chips="chips"
    :deletable-chips="deletableChips"
    :small-chips="chips"
    :hide-details="hideDetails"
    color="primary"
    hide-selected
    outlined
    dense
    @focus="searchInServer('')"
  >
    <template
      v-for="(_, slot) of $slots"
      :slot="slot"
    >
      <slot :name="slot" />
    </template>

    <template
      v-for="(_, slot) of $scopedSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { $axios } from '@/plugins/axios'
import debounce from '@/utils/debounce'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, VModel, Watch } from 'vue-property-decorator'

@Component
export default class SmartAutocomplete extends Vue {
  @Prop({ default: 'text' }) readonly itemText!: string
  @Prop({ default: 'value' }) readonly itemValue!: string
  @Prop({ default: null }) readonly itemColor!: string
  @Prop({ default: null }) readonly label!: string
  @Prop({ default: false }) readonly clearable!: boolean
  @Prop({ default: false }) readonly multiple!: boolean
  @Prop({ default: false }) readonly returnObject!: boolean
  @Prop({ default: false }) readonly chips!: boolean
  @Prop({ default: false }) readonly deletableChips!: boolean
  @Prop({ default: false }) readonly hideDetails!: boolean
  @Prop({ default: false }) readonly disabled!: boolean
  @Prop({ default: () => [] }) readonly errorMessages!: string[]
  @Prop({
    default: () => () => { return true }
  }) readonly filter!: CallableFunction

  @Prop({ default: null, required: true }) readonly apiEndPoint!: string
  @Prop({ default: null, required: true }) readonly storeModuleName!: string
  @Prop({ default: null }) readonly responseProperty!: string|null
  @Prop({ default: {} }) readonly apiQuery!: any

  @VModel() vModel: number|object

  query = null
  storeModulePath = ''
  loading = false

  get options (): Array<Record<string, unknown>> {
    return (this.$store.getters[this.storeModulePath + '/options'] || [])
      .filter(this.filter)
  }

  set options (val) { this.$store.commit(this.storeModulePath + '/options', val) }

  @Watch('query')
  queryWatchHandler (val: string) {
    this.searchInServer(val)
  }

  public created () {
    this.searchInServer = debounce(this.searchInServer, 450)

    this.storeModulePath = 'smart-autocomplete' + this.storeModuleName

    // Локальное центральное хранилище
    if (!this.$store.hasModule(this.storeModulePath)) {
      this.$store.registerModule(this.storeModulePath, {
        namespaced: true,
        state: () => { return { options: [] } },
        getters: { options (state) { return state.options } },
        mutations: { options (state, payload) { state.options = payload } }
      })
    }
  }

  /**
   * Поиск на сервере
   * @param q
   * @private
   */
  private searchInServer (q = '') {
    if (q === '' && this.options.length) {
      return
    }

    if (this.options.findIndex((e) => String(String(e[this.itemText])?.toLocaleLowerCase()).indexOf(q.toLocaleLowerCase()) > -1) > -1) {
      // Нашли в локальном хранилище
      return
    }

    let params = {}
    if (typeof this.apiQuery === 'function') {
      params = this.apiQuery(q)
    }

    this.loading = true
    $axios
      .get(this.apiEndPoint, { params })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText)
        }

        const options = JSON.parse(JSON.stringify(this.options)) as Array<Record<string, unknown>>

        let responseItems = []
        if (this.responseProperty) {
          responseItems = response.data[this.responseProperty] || []
        } else {
          responseItems = response.data || []
        }

        responseItems
          .forEach((e1) => {
            if (options.findIndex((e2) => e2[this.itemValue] === e1[this.itemValue]) === -1) {
              options.push(e1)
            }
          })

        this.options = options
      }).finally(() => (this.loading = false))
  }
}
</script>

<style scoped>

</style>
