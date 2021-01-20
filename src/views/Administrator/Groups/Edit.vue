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
          disabled
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
        />
      </v-col>
    </v-row>

    <v-row class="mb-16">
      <v-col
        cols="12"
        md="6"
        lg="6"
        class="text-right"
      >
        <v-btn
          v-bind="buttonDelete"
          color="red"
          class="mr-2"
          outlined
          tile
          @click="onBtnDeleteClick"
        >
          {{ $tc('Delete') }}
        </v-btn>
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
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import Groups, { GroupInterface } from '@/api/Groups'
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
      buttonDelete: {
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

  beforeRouteEnter (to, from, next) {
    new Groups()
      .getById(+to.params.id)
      .then(async (response: GroupInterface) => {
        next(vm => {
          vm.groupId = response.id
          vm.groupName = response.name
          vm.organizationSelected = response.organization
          vm.userSelected = response.team_leader

          // vm.$watch('organizationName', vm.onChanged)

          // Устанавливаю текущие данные в компонент
          vm.$refs.sOrganizations.pushData(response.organization)
          vm.$refs.sOrganizations.setSelected(response.organization)

          vm.$refs.sUsers.pushData(response.team_leader)
          vm.$refs.sUsers.setSelected(response.team_leader)
        })
      }).catch(() => {
        next({
          name: 'not_found'
        })
      })
  },

  // watch: {
  //   organizationSelected (val: OrganizationInterface) {
  //     if (val && this.firstLoad) {
  //       this.$refs.sUsers.focus()
  //       this.$refs.sUsers.fetchData({ organization_id: val.id })
  //     }
  //   }
  // },

  methods: {

    onBtnDeleteClick () {
      // todo: Реализовать удаление
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true

      const putData = {
        name: this.groupName.trim(),
        team_leader_id: this.userSelected ? this.userSelected.id : 0
      }

      new Groups()
        .update(+this.$route.params.id, putData)
        .then(() => {
          this.$toast.success(this.$tc('Group updated successfully.'))
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
