<template>
  <v-form
    ref="form"
    v-model="form.valid"
    lazy-validation
  >
    <!-- FLM -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="groupName"
          :label="$tc('group_name')"
          :rules="[rules.notBlank]"
          persistent-hint
          @keydown.enter="$refs.sOrganizations.focus"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Organizations -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-organizations-autocomplete
          ref="sOrganizations"
          v-model="organizationSelected"
          :label="$tc('organization')"
          :rules="[rules.notBlank]"
        />
      </v-col>
    </v-row>

    <!-- Users -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-users
          ref="sUsers"
          v-model="userSelected"
          :label="$tc('team_leader')"
          :disabled="!organizationSelected"
          :params="{ roles: 'r_team_leader' }"
          :rules="[rules.notBlank]"
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
        </s-users>
      </v-col>
    </v-row>

    <v-row class="mr-2">
      <v-col
        cols="12"
        md="6"
        lg="6"
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

    <div class="pa-16"/>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import { Groups } from '@/api/Groups'
import { UserInterface } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'

export default Vue.extend({
  components: {
    SOrganizationsAutocomplete,
    SUsers
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
      organizationSelected: {} as unknown as OrganizationInterface,
      userSelected: {} as unknown as UserInterface,
      groupName: ''
    }
  },

  watch: {
    organizationSelected (val: OrganizationInterface) {
      if (val) {
        this.$refs.sUsers.focus()
        this.$refs.sUsers.fetchData({ organization_id: val.id })
      }
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

      const postData = {
        name: this.groupName.trim(),
        team_leader_id: this.userSelected ? this.userSelected.id : 0,
        organization_id: this.organizationSelected ? this.organizationSelected.id : 0
      }

      new Groups()
        .add(postData)
        .then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('Group added successfully'))
        }).catch((e) => {
          if (Array.isArray(e.errors)) {
            e.errors.map((e: any) => {
              this.$toast.warning(e.message)
            })
          }
          this.$toast.error(e.statusText || e.error_message || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
