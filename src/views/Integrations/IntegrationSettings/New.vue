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
          v-model="profile.name"
          :label="$tc('profile name')"
          :rules="[rules.notBlank]"
          persistent-hint
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="profile.external_project_id"
          :label="$tc('external_project_id')"
          persistent-hint
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row >
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="profile.main_project"
          :label="$tc('main')"
        />
      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="profile.main_tag"
          :label="$tc('main_tag')"
          persistent-hint
        >
        </v-text-field>

      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        + будет добавлена дата интеграции
      </v-col>
    </v-row>
    <v-row >
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="profile.half_project"
          :label="$tc('half')"
        />
      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="profile.half_tag"
          :label="$tc('half_tag')"
          persistent-hint
        >
        </v-text-field>

      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        + будет добавлена дата интеграции
      </v-col>
    </v-row>

    <v-row >
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="profile.cross_project"
          :label="$tc('cross')"
        />
      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="profile.cross_tag"
          :label="$tc('cross_tag')"
          persistent-hint
        >
        </v-text-field>

      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        + будет добавлена дата интеграции
      </v-col>
    </v-row>
    <v-row >
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="profile.half_cross_project"
          :label="$tc('half_cross')"
        />
      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="profile.half_cross_tag"
          :label="$tc('half_cross_tag')"
          persistent-hint
        >
        </v-text-field>

      </v-col>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        + будет добавлена дата интеграции
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
import ProjectIntegrationSettings, {
  ProfileInterface,
  ProfileFindQueryInterface,
  OrganizationInterface, ProjectInterface
} from '@/api/ProjectIntegrationSettings'
import rules from '@/mixins/rules'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SProjectsAutocomplete
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

      profile: {
        main_project: null as unknown as ProjectInterface,
        half_project: null as unknown as ProjectInterface,
        cross_project: null as unknown as ProjectInterface,
        half_cross_project: null as unknown as ProjectInterface,
        half_cross_tag: null,
        half_tag: null,
        cross_tag: null,
        main_tag: null,
        name: null,
        external_project_id: null,
        organization: null as unknown as OrganizationInterface
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
        name: this.profile.name,
        external_project_id: this.profile.external_project_id,
        main_tag: this.profile.main_tag,
        half_tag: this.profile.half_tag,
        cross_tag: this.profile.cross_tag,
        half_cross_tag: this.profile.half_cross_tag
      } as any

      if (this.assertObjectHasAttribute(this.profile.main_project, 'id')) {
        request.main_project_id = this.profile.main_project.id
      }

      if (this.assertObjectHasAttribute(this.profile.cross_project, 'id')) {
        request.cross_project_id = this.profile.cross_project.id
      }

      if (this.assertObjectHasAttribute(this.profile.half_project, 'id')) {
        request.half_project_id = this.profile.half_project.id
      }

      if (this.assertObjectHasAttribute(this.profile.half_cross_project, 'id')) {
        request.half_cross_project_id = this.profile.half_cross_project.id
      }
      new ProjectIntegrationSettings()
        .add(request)
        .then((id: number) => {
          this.$router.replace({
            name: 'itegrationset_edit',
            params: { id }
          })
          this.$toast.success(this.$tc('Profile added successfully'))
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
