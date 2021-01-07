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

        <!-- Organization -->
        <v-row>
          <v-col
            cols="12"
          >
            <v-text-field
              v-if="group.organization"
              :value="group.organization.name"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-else-if="loading & !group.organization"
              :value="$t('Loading content...')"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-else
              :value="$t('No data')"
              disabled
            >
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Users -->
        <v-row>
          <v-col
            cols="12"
          >
            <s-autocomplete-users
              v-model="userSelected"
              :disabled="!group.organization"
              :selected-id="group.team_leader ? group.team_leader.id : 0"
              :organization-id="group.organization ? group.organization.id : 0"
              :search="group.team_leader ? group.team_leader.first_name : ''"
              :label="$tc('team_leader')"
              roles="r_team_leader"
            >
              <template v-slot:no-data>
                <v-list-item
                  link
                  target="_blank"
                  :to="{ name: 'administrator_users_new' }"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      Нажмите что бы добавить нового пользователя
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </s-autocomplete-users>
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
              {{ $tc('Save') }}
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
import { GroupInterface, Groups } from '@/api/Groups'
import SAutocompleteUsers from '@/snippets/Autocomplete/SAutocompleteUsers.vue'
import { UserInterface } from '@/api/Users'

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
      userSelected: {} as UserInterface,
      loading: false,
      group: {
        id: 0,
        name: '',
        team_leader: undefined
      } as GroupInterface
      /* eslint-enable */
    }
  },

  created () {
    this.loading = true
    new Groups()
      .getById(+this.$route.params.id)
      .then((group: GroupInterface) => {
        this.group = group
        // this.userSelected.id = group.team_leader.id
      }).finally(() => {
        this.loading = false
      })
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
        .update(+this.$route.params.id, {
          /* eslint-disable */
          name: this.group.name.trim(),
          team_leader_id: this.userSelected ? this.userSelected.id : 0
          /* eslint-enable */
        }).then(() => {
          this.$toast.success(this.$tc('group_update_successfully'))
          this.$router.replace('/administrator/groups')
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
