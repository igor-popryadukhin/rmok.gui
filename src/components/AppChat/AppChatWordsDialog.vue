<template>
  <v-card
    tile
    flat
    elevation="1"
  >
    <v-card-title>
      {{ $tc('Шаблоны ответов') }}
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
          :label="$tc('Фразы проекта')"
        />
      </v-card-text>
      <v-card-text>
        <v-simple-table
          dense
          class="pl-0 pr-0"
        >
          <template #default>
            <tbody>
              <tr>
                <td
                  style="white-space: nowrap"
                  class="pl-0"
                >
                  <b>Какая кредитная ставка по Халве</b>
                  <p>За пользование рассрочкой кредитная ставка не предусмотрена.</p>
                </td>
                <td class="text-right">
                  <v-btn
                    icon
                    x-small
                  >
                    <v-icon>
                      mdi-square-edit-outline
                    </v-icon>
                  </v-btn>
                </td>
              </tr>

              <tr>
                <td
                  style="white-space: nowrap"
                  class="pl-0"
                >
                  <b>Запрос контактов</b>
                  <p>Здравствуйте, ###contact.name###. Уточните, пожалуйста, ваш номер телефона и email.</p>
                </td>
                <td class="text-right">
                  <v-btn
                    icon
                    x-small
                  >
                    <v-icon>
                      mdi-square-edit-outline
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
          {{ $tc('Добавить шаблон') }}
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
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class AppChatWordsDialog extends Vue {
}
</script>

<style scoped>

</style>
