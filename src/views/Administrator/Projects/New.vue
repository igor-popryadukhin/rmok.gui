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
              v-model="projectName"
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
              display-organization
              select-on-clear
              multiple
            />
          </v-col>
        </v-row>

        <!-- Statuses -->
        <v-row>
          <v-col
            cols="12"
          >
            <h3 class="mb-3">Статусы звонков</h3>
            <project-status />
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
import SAutocompleteUsers from '@/snippets/Autocomplete/SAutocompleteUsers.vue'
import SAutocompleteOrganizations from '@/snippets/Autocomplete/SAutocompleteOrganizations.vue'
import { UserInterface } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import { Projects } from '@/api/Projects'
import ProjectStatus from '@/components/ProjectStatus/ProjectStatus.vue'

export default Vue.extend({
  components: {
    SAutocompleteUsers,
    SAutocompleteOrganizations,
    ProjectStatus
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
      projectName: '',
      organizationSelected: {} as OrganizationInterface,
      userSelected: [] as UserInterface[],
      /* eslint-enable */
    }
  },

  methods: {

    resetForm () {
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true
      new Projects()
        .add({
          /* eslint-disable */
          name: this.projectName.trim(),
          organization_id: this.organizationSelected.id,
          users: this.userSelected.map((e: UserInterface) => e.id)
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('Project added successfully!'))
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
