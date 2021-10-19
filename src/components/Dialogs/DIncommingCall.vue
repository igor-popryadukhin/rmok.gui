<template>
  <v-card>
    <v-card-title>{{ $title }}</v-card-title>
    <v-card-subtitle>{{ subTitle }}</v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-space-between">
        <!-- Hangup -->
        <div class="text-center">
          <v-btn
            icon
            x-large
            color="red"
            outlined
            @mouseup="_onHangup"
          >
            <v-icon>
              mdi-phone-hangup
            </v-icon>
          </v-btn>
          <div class="">
            Отклонить
          </div>
        </div>

        <!-- Answer -->
        <div class="text-center">
          <v-btn
            icon
            x-large
            color="green"
            outlined
            @mouseup="_onAnswer"
          >
            <v-icon>
              mdi-phone
            </v-icon>
          </v-btn>
          <div class="">
            Ответить
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

  props: {
    attrs: Object,

    onAnswer: {
      default: () => undefined,
      type: Function
    },

    onHangup: {
      default: () => undefined,
      type: Function
    },

    onShowing: {
      default: () => undefined,
      type: Function
    },

    subTitle: {
      default: 'Sub title',
      type: String
    },

    title: {
      default: 'Title',
      type: String
    }
  },

  data () {
    return {
      $title: ''
    }
  },
  computed: {},

  created () {
    this.$title = this.title
    if (this.onShowing) {
      this.onShowing(this)
    }
  },

  mounted () {
    this.$on('update-title', (text: string) => {
      this.$title = text
    })
  },

  methods: {
    _onAnswer () {
      this.onAnswer()
    },

    _onHangup () {
      this.onHangup()
    }
  }

})
</script>

<style lang="scss">
</style>
