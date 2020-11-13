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
            <s-autocomplete-users
              v-model="userSelected"
              :label="$tc('team_leader')"
              :selected-id="group.team_leader ? group.team_leader.id : 0"
              roles="r_leader_group"
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
      userSelected: null as any,
      group: {
        id: 0,
        name: '',
        organization: undefined,
        team_leader: undefined
      } as GroupInterface
      /* eslint-enable */
    }
  },

  created () {
    new Groups()
      .getById(+this.$route.params.id)
      .then((group: GroupInterface) => {
        this.group = group
        this.userSelected = group.team_leader
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
          this.$toast.success(this.$t('group_update_successfully'))
        }).catch((e: any) => {
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
