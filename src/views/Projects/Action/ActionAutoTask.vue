<template>
  <v-sheet>
    <div class="d-inline-flex">
      <v-select
        v-model="payload.type"
        :items="types"
        item-text="title"
        item-value="value"
        class="mr-2"
        style="max-width: 150px"
        outlined
        dense
      />
      <v-text-field
        v-model="payload.value"
        style="max-width: 150px"
        class="mr-2"
        type="number"
        outlined
        dense
      />
      <v-select
        v-model="payload.unit"
        :items="unitOptions"
        style="max-width: 150px"
        dense
        outlined
      >
        <template #selection="{ item }">
          {{ $tc(item, payload.value) }}
        </template>
        <template #item="{ item }">
          {{ $tc(item, payload.value) }}
        </template>
      </v-select>
    </div>
    <div>
      <v-textarea
        v-model="payload.description"
        rows="4"
        outlined
        dense
      />
    </div>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VModel } from 'vue-property-decorator';
import Vuelidate, { validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

Vue.use(Vuelidate);

// eslint-disable-next-line no-use-before-define
@Component<ActionAutoTask>({
  mixins: [validationMixin],
  validations: {
    fieldNameSync: { required, maxLength: maxLength(255) }
  },
  computed: {}
})
export default class ActionAutoTask extends AppBase {
  @VModel({
    required: true,
    type: Object,
    default: () => {
      return {
        type: 'call',
        unit: 'hour',
        value: 1,
        description: null
      };
    }
  }) payload: Record<string, Record<string, unknown>>

  get types () {
    return [
      {
        title: 'Позвонить',
        value: 'call'
      },
      {
        title: 'Задача',
        value: 'task'
      },
      {
        title: 'Встреча',
        value: 'meeting'
      },
      {
        title: 'Письмо',
        value: 'letter'
      }
    ];
  }

  get unitOptions () {
    return ['day', 'hour', 'minute', 'second'];
  }
}
</script>

<style scoped>

</style>
