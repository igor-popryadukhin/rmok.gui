<template>
  <v-card
    tile
    flat
    elevation="1"
  >
    <v-card-title>
      {{ $tc('Шаблон ответа') }}
    </v-card-title>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-text
        dense
        class="pb-0"
      >
        <app-project-autocomplete
          ref="projectId"
          :label="$tc('Проект')"
        />
      </v-card-text>

      <v-card-text>
        <v-text-field
          label="Наименование"
          dense
        />
      </v-card-text>
      <v-card-text>
        <v-textarea
          label="Текст сообщения"
        />
      </v-card-text>
      <v-card-text>
        <v-chip
          class="ma-2"
          label
        >
          Контакт
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Текущая дата
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Это Маркер автозаполнения
        </v-chip>
      </v-card-text>
      <v-card-text
        dense
        class="pb-0"
      >
        <v-btn
          :x-small="$vuetify.breakpoint.md"
          :small="!$vuetify.breakpoint.md"
          class="mr-0"
          color="primary"
          text
          outlined
          tile
        >
          {{ $tc('Сохранить') }}
        </v-btn>
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
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
// AppProjectAutocomplete
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class AppChatAddWordsDialog extends Vue {
}
</script>

<style scoped>

</style>
