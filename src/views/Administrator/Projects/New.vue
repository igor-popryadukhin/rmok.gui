<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
    >
      <v-container>

        <!-- FLM -->
        <v-row>
          <v-col
            cols="12"
          >
            <!-- eslint-disable -->
            <v-text-field
              v-model="group.name"
              :label="$tc('project_name')"
              persistent-hint
              required
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Organizations -->
        <v-row>
          <v-col
              cols="12"
          >
            <s-autocomplete-organizations
                v-model="organizationSelected"
                :label="$tc('organization')"
            />
          </v-col>
        </v-row>

        <!-- Users -->
        <v-row>
          <v-col
            cols="12"
          >
            <s-autocomplete-users
              v-model="userSelected"
              :label="$tc('project_manager')"
              :disabled="!organizationSelected"
              :organization-id="organizationSelected ? organizationSelected.id : 0"
              select-on-clear
              multiple
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="text-right"
          >
            <v-btn
              text
              tile
              :loading="buttonSave.loading"
              :disabled="buttonSave.disabled"
              @click="onSave"
            >
              {{ $tc('add_project') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import { Groups } from '@/api/Groups'
import SAutocompleteUsers from '@/snippets/Autocomplete/SAutocompleteUsers.vue'
import SAutocompleteOrganizations from '@/snippets/Autocomplete/SAutocompleteOrganizations.vue'
import { UserInterface } from '@/api/Users'

interface Phone {
  code: string;
  value: string;
  label: string;
}

interface Email {
  value: string;
  label: string;
}

export default Vue.extend({
  components: {
    SAutocompleteUsers,
    SAutocompleteOrganizations
  },
  mixins: [rules],

  data () {
    return {
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      organizationSelected: null,
      userSelected: null,
      users: [] as UserInterface[],
      group: {
        name: ''
      }
      /* eslint-enable */
    }
  },

  watch: {
    userSelected (value?: UserInterface) {
      if (value) {
        this.users.push(value)
      }
    }
  },

  methods: {

    resetForm () {
      this.$refs.form.reset()
    },

    onSave () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.buttonSave.loading = true
      new Groups()
        .add({
          /* eslint-disable */
          name: this.group.name.trim(),
          team_leader_id: this.userSelected ? this.userSelected.id : 0,
          organization_id: this.organizationSelected ? this.organizationSelected.id : 0
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('group_added_successfully'))
        }).catch((e) => {
          const cause: string = e.statusText || e.error_message || e || 'undefined'
          this.$toast.error(this.$t('error_occurred_while_added_the_group', { cause }))
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
