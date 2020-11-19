<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
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

    title: {
      type: String,
      default: 'Title'
    },

    subTitle: {
      type: String,
      default: 'Sub title'
    },

    onHangup: {
      type: Function,
      default: () => undefined
    },

    onAnswer: {
      type: Function,
      default: () => undefined
    }
  },

  data () {
    return {}
  },

  computed: {},

  methods: {
    _onHangup () {
      this.onHangup()
    },

    _onAnswer () {
      this.onAnswer()
    }
  }

})
</script>

<style lang="scss">
</style>
