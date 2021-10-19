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
          v-model="group.name"
          :label="$tc('Group name')"
          :rules="[rules.notBlank]"
          persistent-hint
          @keydown.enter="$refs.sOrganizations.focus"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Organizations -->
    <v-row v-if="$permission.isSuperAdmin">
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-organizations-autocomplete
          ref="sOrganizationsAutocomplete"
          v-model="group.organization"
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
          v-model="group.responsible"
          :label="$tc('Responsible group')"
          :rules="[]"
        />
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
          {{ $tc('Save') }}
        </v-btn>
      </v-col>
    </v-row>

    <div class="pa-16"/>
  </v-form>
</template>

<script lang="ts">
import Groups, { GroupOrganizationInterface, GroupResponsibleInterface } from '@/api/Groups'
import rules from '@/mixins/rules'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface Ref {
  [key: string]: any;
}

interface Data {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Ref;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
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

      group: {
        name: null,
        organization: null as unknown as GroupOrganizationInterface,
        responsible: null as unknown as GroupResponsibleInterface
      }
    }
  },

  watch: {
    'group.organization' (val: GroupOrganizationInterface) {
      if (val) {
        this.$refs.sUsers.focus()
        this.$refs.sUsers.fetchData({ organization_id: val.id })
      }
    }
  },

  methods: {

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true

      const request = {
        name: this.group.name
      } as any

      if (this.assertObjectHasAttribute(this.group.organization, 'id')) {
        request.organization_id = this.group.organization.id
      }

      if (this.assertObjectHasAttribute(this.group.responsible, 'id')) {
        request.responsible_id = this.group.responsible.id
      }

      new Groups()
        .add(request)
        .then((id: number) => {
          this.$router.replace({
            name: 'groups_edit',
            params: { id }
          })
          this.$toast.success(this.$tc('Group added successfully'))
        }).catch((e) => {
          if (Array.isArray(e.errors)) {
            e.errors.map((e: any) => {
              this.$toast.warning(e.message)
            })
          }
          this.$toast.error(e.message)
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    resetForm () {
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
    }
  }
})
</script>

<style scoped>

</style>
