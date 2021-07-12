<template>
  <v-card width="600">
    <v-card-title>
      {{ $tc('Оценка качества связи') }}
    </v-card-title>
    <v-card-text class="d-flex justify-center">
      <v-rating
        v-model="rating"
        color="primary"
        length="5"
        size="35"
        hover
      ></v-rating>
    </v-card-text>
    <v-card-text>
      <v-textarea
        v-model="comment"
        :placeholder="$t('Comment')"
        rows="3"
        outlined
        hide-details
      >
      </v-textarea>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-btn
        text
        tile
        small
        @click="onBtnCancelClick"
      >
        {{ $tc('Cancel') }}
      </v-btn>
      <v-btn
        color="primary"
        text
        tile
        small
        @click="onBtnOkClick"
      >
        {{ $tc('Ок') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppCardCommunicationQualityAssessment',

  model: {
    event: 'update',
    prop: 'value'
  },

  props: {
    value: Object,
    handler: Function
  },

  data () {
    return {
      rating: 0,
      comment: ''
    }
  },

  methods: {
    onBtnCancelClick () {
      if (typeof this.handler === 'function') {
        this.handler('cancel')
      }
    },

    onBtnOkClick () {
      if (typeof this.handler === 'function') {
        this.handler('ok', {
          rating: this.rating,
          comment: this.comment
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.rating {
  border: red solid 2px;
}
</style>
