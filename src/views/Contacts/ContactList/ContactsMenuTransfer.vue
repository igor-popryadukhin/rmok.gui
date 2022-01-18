<template>
  <v-menu
    v-model="menuVisible"
    :close-on-click="false"
    :close-on-content-click="false"
    max-width="400"
    offset-y
    tile
    @keydown.esc="menuVisible = false"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
      />
    </template>
    <v-card
      min-width="400"
      tile
      flat
    >
      <v-card-text class="px-3 pb-0">
        <smart-autocomplete
          v-model="projectId"
          :label="$tc('Project')"
          :api-query="(q) => { return { q } }"
          api-end-point="/projects"
          item-text="name"
          item-value="id"
          response-property="data"
          store-module-name="projects-transfer-menu"
          clearable
        />
      </v-card-text>

      <v-card-text class="px-3 pt-1 pb-0">
        <smart-autocomplete
          v-model="userIds"
          :error-messages="userIdsErrors"
          :label="$tc('Responsible')"
          :api-query="(q) => { return { q } }"
          api-end-point="/users"
          item-text="full_name"
          item-value="id"
          response-property="data"
          store-module-name="users-transfer-menu"
          clearable
          multiple
          @input="$v.projectId.$touch()"
          @blur="$v.projectId.$touch()"
        >
          <template
            #selection="{ item }"
          >
            <v-chip
              class="extra-small-chip"
              outlined
              label
              close
              @click:close="userChipCloseClick(item.id)"
            >
              {{ item.full_name }}
            </v-chip>
          </template>
        </smart-autocomplete>
      </v-card-text>

      <!-- Действия -->
      <v-card-text class="px-3 py-0">
        <v-list dense>
          <v-list-item
            :disabled="$v.$invalid"
            dense
            link
            @click="transfer"
          >
            <v-list-item-title>{{ $tc('transfer', contactsSelectedLength) }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :disabled="process"
            dense
            link
            @click="menuVisible = false"
          >
            <v-list-item-title>{{ $tc('Cancel') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <!-- Действия -->
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import Vuelidate, { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
Vue.use(Vuelidate)

@Component({
  mixins: [validationMixin],
  components: { SmartAutocomplete },
  validations: {
    userIds: { required, minLength: minLength(1) }
  },
  computed: {
    userIdsErrors () {
      const errors = []
      if (!this.$v.userIds.$dirty) return errors
      !this.$v.userIds.required && errors.push('Users is required.')
      !this.$v.userIds.minLength && errors.push('Users is required.')
      return errors.map((e) => this.$tc(e))
    }
  }
})
export default class ContactsMenuAddToAutodialer extends AppBase {
  menuVisible = false
  projectId = 0
  userIds = []

  get contactsSelectedLength () { return (this.$store.getters['contacts/list/items_selected'] || []).length }
  get contactsSelected () { return this.$store.getters['contacts/list/items_selected'] }
  set contactsSelected (val) { this.$store.commit('contacts/list/items_selected', val) }

  private transfer () {
    this.$v.$touch()
    this.contactsSelected = []
  }

  private userChipCloseClick (id: number) {
    this.userIds = this.userIds.filter((value) => {
      return value !== id
    })
  }
}
</script>

<style lang="scss">
.highlight {
  background-color: #ffeb3b;
}
</style>

<i18n>
{
  "ru": {
    "transfer": "Нет контактов|Передать {n} контакт|Передать {n} контакта|Передать {n} контактов"
  }
}
</i18n>
