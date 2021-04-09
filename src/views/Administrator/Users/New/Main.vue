<template>
  <v-container fluid>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.first_name"
            :label="$tc('first_name')"
            persistent-hint
            required
            :rules="[rules.notBlank]"
          >
            <template v-slot:prepend>
              <v-avatar
                size="60"
                class="mr-4 primary white--text"
                style="font-size: 20px"
              >
                {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
              </v-avatar>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.last_name"
            :label="$tc('last_name')"
            persistent-hint
            required
            :rules="[rules.notBlank]"
          >
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.middle_name"
            :label="$tc('middle_name')"
            :rules="[]"
            persistent-hint
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.login"
            :label="$tc('Login')"
            :rules="[rules.notBlank]"
            autocomplete="new-login"
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-account-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            ref="password1"
            v-model="user.password"
            :label="$tc('Password')"
            :type="passwordShow ? 'text' : 'password'"
            :rules="[rules.lengthMinOrZero(6)]"
            autocomplete="new-password"
            required
          >
            <template v-slot:append>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            ref="password2"
            v-model="user.password2"
            :label="$tc('Password')"
            :type="passwordShow ? '' : 'password'"
            :rules="[rules.lengthMinOrZero(6)]"
            autocomplete="new-password"
            required
          >
            <template v-slot:append>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="4"
        >
          <v-text-field
            v-model="user.email"
            :label="$tc('email')"
            :rules="[rules.email]"
            autocomplete="new-email"
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-email</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="4"
        >
          <v-text-field
            v-model="user.phone"
            :label="$tc('phone')"
            type="tel"
            :rules="[rules.phone_number]"
            required
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-phone</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Роль -->
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <s-roles
            v-model="user.role"
            :label="$tc('Role')"
            visible-icon
            :value="user.role ? user.role : null"
            :rules="[rules.notBlank]"
          />
        </v-col>
      </v-row>

      <!-- Организация -->
      <v-row v-if="$permission.isSuperAdmin">
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <s-organizations-autocomplete
            ref="sOrganizations"
            v-model="user.organization"
            :label="$tc('organization')"
            :disabled="assertObjectHasAttribute(user.organization, 'id')"
            visible-icon
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <s-projects-autocomplete
            ref="sProjectsAutocomplete"
            v-model="user.project"
            :label="$tc('User current project')"
            visible-icon
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <s-groups
            ref="sGroups"
            v-model="user.group"
            :label="$tc('Group')"
            visible-icon
            :disabled="!assertObjectHasAttribute(user.organization, 'id')"
            :params="sGroupsParams"
          >
          </s-groups>
        </v-col>
      </v-row>

      <!-- Сохранить -->
      <v-row>
        <v-col
          cols="12"
          class="d-flex"
        >
          <v-spacer />
          <v-btn
            v-bind="buttonSave"
            color="primary"
            text
            tile
            outlined
            @click="onSave"
          >
            {{ $tc('Save') }}
          </v-btn>
        </v-col>
      </v-row>

      <div class="pa-16"/>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { GroupInterface } from '@/api/Groups'
import { OrganizationInterface } from '@/api/Organizations'
import { ProjectInterface } from '@/api/Projects'
import { RoleInterface } from '@/api/Roles'
import { Users } from '@/api/Users'
import rules from '@/mixins/rules'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SRoles from '@/snippets/SRoles/SRoles.vue'
import { isEmpty } from '@/Utils'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface IRefs {
  sGroups: any,
  sOrganizations: any,
  sProjectsAutocomplete: any,
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRefs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  mixins: [rules],

  components: {
    SProjectsAutocomplete,
    SOrganizationsAutocomplete,
    SGroups,
    SRoles
  },

  data (): IData {
    return {
      permissions: [],
      tab: 0,
      passwordShow: false,
      buttonDelete: {
        disabled: false,
        loading: false
      },
      buttonSave: {
        disabled: false,
        loading: false
      },
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        role: null as unknown as RoleInterface,
        group: null as unknown as GroupInterface,
        organization: null as unknown as OrganizationInterface,
        project: null as unknown as ProjectInterface
      }
    }
  },

  watch: {
    tab (val: number) {
      switch (val) {
        case 3: {
          this.$router.push({ name: 'administrator_users_edit_permissions' })
          break
        }
        default: this.$router.push({ name: 'administrator_users_edit', params: this.$route.params })
      }
    }
  },

  computed: {
    sGroupsParams () {
      const params: any = {}

      if (this.assertObjectHasAttribute(this.user.organization, 'id')) {
        params.organization_id = this.user.organization.id
      }

      return params
    }
  },

  methods: {
    onSave () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.buttonSave.loading = true

      // Данные запроса
      const requestData: any = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        middle_name: this.user.middle_name,
        login: this.user.login,
        role_id: this.user.role?.id
      }

      if (this.user.email) {
        requestData.email = this.user.email
      }

      if (this.user.phone) {
        requestData.phone = this.user.phone
      }

      if (this.assertObjectHasAttribute(this.user.project, 'id')) {
        requestData.project_id = this.user.project.id
      }

      if (this.assertObjectHasAttribute(this.user.organization, 'id')) {
        requestData.organization_id = this.user.organization.id
      }

      if (this.assertObjectHasAttribute(this.user.group, 'id')) {
        requestData.group_id = this.user.group.id
      }

      if (this.user.password === this.user.password2 && !isEmpty(this.user.password)) {
        requestData.password = this.user.password
      }

      this.buttonSave.loading = true
      new Users()
        .add<{ id: number }>(requestData)
        .then((response) => {
          this.$toast.success(this.$tc('User added successfully'))
          this.$router.push({
            name: 'administrator_users_edit_main',
            params: {
              user_id: response.id
            }
          })
        }).catch((e) => {
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              for (const error of e.errors) {
                this.$toast.error(error.message)
              }
            }
          }
          this.$toast.error(e.error)
        }).finally(() => (this.buttonSave.loading = false))
    }
  }
})
</script>

<style scoped>

</style>
