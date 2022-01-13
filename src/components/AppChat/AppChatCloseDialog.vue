<template>
  <v-card
    tile
    flat
    elevation="10"
  >
    <v-card-title>
      {{ $tc('Завершение диалога') }}
    </v-card-title>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-text>
        <app-user-autocomplete
          v-model="userIds"
          :label="$tc('Выберите статус')"
        />
      </v-card-text>
    </v-form>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="red"
        small
        tile
        text
        @click="$emit('cancel')"
      >
        {{ $tc('Cancel') }}
      </v-btn>
      <v-btn
        small
        tile
        text
        @click="onBtnConfirm"
      >
        {{ $tc('Завершить диалог') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AppChatCloseDialog extends Vue {
  public onBtnConfirm () {
    // Some code
  }
}
</script>

<style scoped>

</style>
