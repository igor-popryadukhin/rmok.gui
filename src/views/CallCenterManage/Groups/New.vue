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
              :label="$tc('group_name')"
              persistent-hint
              required
              :rules="[rules.notBlank]"
            >
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
          >
            <s-autocomplete-users
              v-model="userSelected"
              :label="$tc('team_leader')"
              roles="r_team_leader"
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
              {{ $tc('add_group') }}
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
import { UserInterface } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'

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
    SAutocompleteUsers
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
      organizationSelected: {} as OrganizationInterface,
      userSelected: {} as UserInterface,
      group: {
        name: ''
      }
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
      new Groups()
        .add({
          /* eslint-disable */
          name: this.group.name.trim(),
          team_leader_id: this.userSelected.id,
          organization_id: this.organizationSelected.id
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('Group added successfully'))
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
