<template>
  <div class="d-flex">
    <div
      class="align-self-center"
      style="font-size: 14px; margin-right: 10px"
    >
      <slot
        name="display"
        :count="count"
        :offset="offset"
      >
        <div
          class="mr-2"
          style="padding: 4px; font-size: 13px; user-select: none"
        >
          <app-count-up :end-val="offsetStart" /> — <app-count-up :end-val="offsetEnd" /> {{ $tc('From').toLowerCase() }} <app-count-up :end-val="count" />
        </div>
      </slot>
    </div>
    <v-btn
      :disabled="isBtnLeftDisabled"
      icon
      small
      @click="page--"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      :disabled="isBtnRightDisabled"
      icon
      small
      @click="page++"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  name: 'AppPagination',
  components: { AppCountUp },
  model: {
    event: 'change',
    prop: 'value'
  },

  props: {

    disabled: {
      default: false,
      type: Boolean
    },

    count: {
      required: true,
      type: Number
    },

    perPage: {
      type: Number,
      required: true
    },

    value: {
      default: () => 0,
      required: false,
      type: Number
    }
  },

  data () {
    return {
      page: 1
    }
  },

  computed: {
    pages () {
      return Math.ceil(this.count / this.perPage)
    },

    offset () {
      return Math.ceil(this.$data.page * this.perPage) - +this.perPage
    },

    offsetStart () {
      return this.offset + 1
    },

    offsetEnd () {
      const offsetEnd = this.offset + this.perPage
      return offsetEnd >= this.count ? this.count : offsetEnd
    },

    isBtnRightDisabled () {
      return this.offset >= (this.count - this.perPage)
    },

    isBtnLeftDisabled () {
      return this.page <= 1
    }
  },

  watch: {
    count () {
      this.calculate()
    }
  },

  mounted () {
    this.calculate()
    this.$watch('offset', debounce((val: number) => {
      this.$emit('change', val)
    }, 500))
  },

  methods: {
    calculate () {
      this.page = (this.pages - Math.ceil((this.count - this.value) / this.perPage)) + 1
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "From": "Из"
  }
}
</i18n>
