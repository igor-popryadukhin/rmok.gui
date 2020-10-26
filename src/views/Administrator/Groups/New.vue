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
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
          >
            <autocomplete-user
              v-model="userSelected"
              :label="$tc('team_leader')"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
          >
            <autocomplete-organization
              v-model="organizationSelected"
              :label="$tc('organization')"
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
import AutocompleteUser from '@/components/Autocomplete/AutocompleteUser.vue'
import AutocompleteOrganization from '@/components/Autocomplete/AutocompleteOrganization.vue'

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
    AutocompleteUser,
    AutocompleteOrganization
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
      group: {
        name: ''
      }
      /* eslint-enable */
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
