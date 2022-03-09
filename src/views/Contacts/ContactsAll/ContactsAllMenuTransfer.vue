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
          v-model="project"
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
          v-model="users"
          :error-messages="usersErrors"
          :label="$tc('Responsible')"
          :filter="usersQueryFilter"
          :api-query="usersQuery"
          api-end-point="/users"
          item-text="full_name"
          item-value="id"
          response-property="data"
          store-module-name="users-transfer-menu"
          clearable
          multiple
          @input="$v.users.$touch()"
          @blur="$v.users.$touch()"
        >
          <template
            #selection="{ item }"
          >
            <v-chip
              outlined
              label
              close
              small
              @click:close="userChipCloseClick(item.id)"
            >
              {{ item.full_name }}
            </v-chip>
          </template>
        </smart-autocomplete>
      </v-card-text>

      <v-divider class="my-2 mx-3" />

      <!-- Действия -->
      <v-card-text class="px-3 py-0">
        <v-list dense>
          <v-list-item
            :disabled="$v.$invalid || process"
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
    users: { required, minLength: minLength(1) }
  },
  computed: {
    usersErrors () {
      const errors = []
      if (!this.$v.users.$dirty) return errors
      !this.$v.users.required && errors.push('Users is required.')
      !this.$v.users.minLength && errors.push('Users is required.')
      return errors.map((e) => this.$tc(e))
    }
  }
})
export default class ContactsAllMenuTransfer extends AppBase {
  process = false
  menuVisible = false
  project: Record<'id', number>|null = null
  users: Array<Record<'id', number>> = []

  get contactsSelectedLength () { return (this.$store.getters['contacts/contacts_all/items_selected'] || []).length }
  get contactsSelected () { return (this.$store.getters['contacts/contacts_all/items_selected'] || []) }
  set contactsSelected (val) { this.$store.commit('contacts/contacts_all/items_selected', val) }

  /**
   * Совершает передачу контактов
   * @private
   */
  private transfer () {
    this.menuVisible = false
    this.process = true
    this.$axios.post('/contacts/transfer', {
      contact_ids: this.contactsSelected.map((e) => e.id),
      destination_user_ids: this.users.map((e) => e.id),
      ...(!!this.project ? { destination_project_id: this.project.id } : {})
    }).then((response) => {
      if (response.status !== 202) {
        throw new Error(response.statusText)
      }

      this.$toast.success('Accepted')

      this.contactsSelected = []
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    }).finally(() => (this.process = false))
  }

  private userChipCloseClick (id: number) {
    this.users = this.users.filter((e) => {
      return e.id !== id
    })
  }

  private usersQuery (q) {
    if (this.project) {
      return { q, project_id: this.project.id }
    }
    return { q }
  }

  private usersQueryFilter (item: any) {
    if (item?.project?.id) {
      return item.project.id === this.project.id
    }
    return true
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
