<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="dates"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :label="label"
        :hide-details="!messages"
        :messages="messages"
        :value="dateRangeText"
        multiple
        dense
        outlined
        prepend-inner-icon="mdi-calendar"
        readonly
        clearable
        v-bind="attrs"
        v-on="on"
        @click:clear="onTextFieldDateRangeClearClick"
      />
    </template>
    <v-date-picker
      v-model="dates"
      :range="range"
      no-title
      show-current
    >
      <v-switch
        v-model="range"
        :ripple="false"
        :label="t('Range')"
        @change="onSwitchRangeChange(range)"
      />
      <v-spacer />
      <v-btn
        text
        color="primary"
        small
        @click="menu = false"
      >
        {{ t('Cancel') }}
      </v-btn>
      <v-btn
        text
        color="primary"
        small
        @click="onBtnOkClick(dates)"
      >
        {{ t('Ok') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppMenuDatePicker',

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
      type: [Array, String],
      default: () => null
    },
    messages: {
      type: [Array, String],
      default: () => null
    },
    t: {
      type: Function,
      default: (name: string) => name
    }
  },

  data () {
    return {
      range: false,
      dates: null,
      menu: false
    }
  },

  computed: {
    dateRangeText () {
      if (Array.isArray(this.$data.dates)) {
        return this.$data.dates.join(' ~ ')
      }
      return this.$data.dates
    }
  },

  mounted () {
    if (this.value) {
      if (Array.isArray(this.value)) {
        this.$data.range = true
      }

      this.$data.dates = this.value
    }
  },

  methods: {
    onBtnOkClick (value: string | string[]) {
      this.$emit('change', value)
      return this.$refs.menu?.save(value)
    },
    onTextFieldDateRangeClearClick () {
      this.$emit('change', null)
      return this.$refs.menu?.save(null)
    },

    onSwitchRangeChange (value: boolean) {
      if (!value) {
        this.$data.dates = this.$data.dates.shift()
      }
    }
  }
})
</script>

<style scoped>

</style>
