<template>
  <v-card
    tile
    flat
    elevation="10"
  >
    <v-card-title>
      {{ $tc('Transferring contacts') }}
    </v-card-title>
    <v-card-subtitle>
      {{ $tc('contact_selected', contactsSelected.length) }}
    </v-card-subtitle>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-text>
        <app-project-autocomplete
          ref="projectId"
          v-model="projectId"
          :label="$tc('В проект')"
        />
      </v-card-text>
      <v-card-text>
        <app-user-autocomplete
          v-model="userIds"
          :label="$tc('Users')"
          :rules="[(v) => !!v && Array.isArray(v) && v.length > 0 || $tc('Required field.')]"
          multiple
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
        {{ $tc('Transfer contacts') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import AppUserAutocomplete from '@/components/AppUserAutocomplete/AppUserAutocomplete.vue'
import AppProjectAutocomplete from '@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'AppContactTransferDialog',
  components: { AppProjectAutocomplete, AppUserAutocomplete },
  data () {
    return {
      newDate: '',
      userIds: null as unknown as number[],
      projectId: 0
    }
  },
  computed: {
    ...mapGetters({
      contactsSelected: 'contacts/selected'
    })
  },

  methods: {
    onBtnConfirm () {
      if (!this.$refs.form.validate(true)) { return }

      this.$emit('confirm', {
        new_date: this.newDate,
        contact_ids: this.contactsSelected,
        user_ids: this.userIds,
        project_id: this.projectId
      })
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "Required field.": "Обязательное поле.",
    "Transferring contacts": "Передача контактов",
    "Date the contact was created": "Дата создания контакта",
    "Leave this field blank if you do not want to change the previous value.": "Оставьте поле пустым, если вы не хотите изменять предыдущее значение.",
    "Transfer contacts": "Передать контакты",
    "contact_selected": "Контакты не выбраны | Выбран {n} контакт | Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>
