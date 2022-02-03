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
          ref=""
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
          ref=""
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
          ref="SProjectsAutocomplete"
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
          ref=""
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
          ref="Half"
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
          ref=""
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
          ref="Cross"
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
          ref=""
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
          ref="HalfCross"
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
          ref=""
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
      </v-col>
    </v-row>

    <div class="pa-16"/>
  </v-form>
</template>

<script lang="ts">
import ProjectIntegrationSettings, {
  OrganizationInterface,
  ProfileInterface, ProjectInterface
} from '@/api/ProjectIntegrationSettings'
import rules from '@/mixins/rules'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { NavigationGuardNext } from 'vue-router/types/router'
import APIError from '@/api/classes/APIError'

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
    SProjectsAutocomplete
  },

  mixins: [rules],
  beforeRouteEnter (to, from, next: NavigationGuardNext<any>) {
    new ProjectIntegrationSettings()
      .getById(+to.params.id)
      .then(async (response: ProfileInterface) => {
        next((vm) => {
          vm.profile.name = response.name
          vm.profile.external_project_id = response.external_project_id
          vm.profile.main_tag = response.main_tag
          vm.profile.cross_tag = response.cross_tag
          vm.profile.half_cross_tag = response.half_cross_tag
          vm.profile.half_tag = response.half_tag

          if (vm.assertObjectHasAttribute(vm.$refs, 'SProjectsAutocomplete')) {
            if (vm.assertObjectHasAttribute(response.main_project, 'id')) {
              vm.$refs.SProjectsAutocomplete.setDefault(response.main_project?.id)
            }
          }
          if (vm.assertObjectHasAttribute(vm.$refs, 'Cross')) {
            if (vm.assertObjectHasAttribute(response.cross_project, 'id')) {
              vm.$refs.Cross.setDefault(response.cross_project?.id)
            }
          }
          if (vm.assertObjectHasAttribute(vm.$refs, 'Half')) {
            if (vm.assertObjectHasAttribute(response.half_project, 'id')) {
              vm.$refs.Half.setDefault(response.half_project?.id)
            }
          }
          if (vm.assertObjectHasAttribute(vm.$refs, 'HalfCross')) {
            if (vm.assertObjectHasAttribute(response.half_cross_project, 'id')) {
              vm.$refs.HalfCross.setDefault(response.half_cross_project?.id)
            }
          }
        })
      }).catch(() => {
        next({
          name: 'not_found'
        })
      })
  },

  data () {
    return {
      buttonDelete: {
        disabled: false,
        loading: false
      },
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

    onBtnDeleteClick () {
      this.$dialog.confirm({
        actions: {
          false: {
            color: 'black',
            text: this.$tc('No')
          },
          true: {
            color: 'red',
            handler: () => {
              new ProjectIntegrationSettings()
                .delete(+this.$route.params.id)
                .then(() => {
                  this.$toast.success(this.$tc('profile_delete_successfully'))
                  this.$router.back()
                }).catch((e: APIError) => {
                  this.$toast.error(e.message)
                })
            },
            text: this.$tc('Yes')
          }
        },
        text: this.$tc('All information  will be deleted permanently.'),
        title: this.$tc('Confirmation request')
      })
    },

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
        .update(+this.$route.params.id, request)
        .then(() => {
          this.$toast.success(this.$tc('Profile updated successfully.'))
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
    }
  }
})
</script>

<style scoped>

</style>
