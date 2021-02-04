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
            v-model="password.value1"
            :label="$tc('Password')"
            :type="password.visible ? 'text' : 'password'"
            :success="password.isValid"
            required
            autocomplete="new-password"
          >
            <template v-slot:append>
              <v-btn
                v-if="password.visible"
                icon
                small
                @click="password.visible = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="password.visible = true"
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
            v-model="password.value2"
            :label="$tc('Password')"
            :type="password.visible ? '' : 'password'"
            :rules="[]"
            :success="password.isValid"
            required
            autocomplete="new-password"
          >
            <template v-slot:append>
              <v-btn
                v-if="password.visible"
                icon
                small
                @click="password.visible = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="password.visible = true"
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
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <s-organizations-autocomplete
            ref="sOrganizations"
            v-model="organizationSelected"
            :label="$tc('organization')"
            :rules="[]"
            :disabled="Boolean(user.organization)"
            visible-icon
          />
        </v-col>
      </v-row>

      <!-- Группа -->
      <v-row>
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
            :disabled="!(user.organization)"
            :params="sGroupsParams"
          >
          </s-groups>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import countryCodes from '@/mixins/countryCodes'
import { UserInterface, Users } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'
import SRoles from '@/snippets/SRoles/SRoles.vue'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import { RoleInterface } from '@/api/Roles'
import { ProjectInterface } from '@/api/Projects'
import VInterface from '@/VInterface'

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

interface DataPasswordInterface {
  visible: boolean;
  isValid: boolean;
  value1: string;
  value2: string;
  isEmpty: () => boolean;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  mixins: [rules, countryCodes],

  components: {
    SOrganizationsAutocomplete,
    SGroups,
    SRoles
  },

  data (): IData {
    return {
      permissions: [],
      tab: 0,
      password: {
        visible: false,
        isValid: true,
        value1: '',
        value2: '',
        isEmpty (): boolean {
          return Boolean(!this.value1 && !this.value2)
        }
      } as DataPasswordInterface,
      buttonDelete: {
        disabled: false,
        loading: false
      },
      buttonSave: {
        disabled: false,
        loading: false
      },
      organizationSelected: {} as unknown as OrganizationInterface,
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',
        role: {} as unknown as RoleInterface,
        group: {} as unknown as GroupInterface,
        organization: {} as unknown as OrganizationInterface,
        project: {} as unknown as ProjectInterface,

        // Конфигурация подключения к АТС
        pbxConfig: {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        }
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    new Users()
      .getById(+to.params.user_id)
      .then((user: UserInterface) => {
        next((vm: any) => {
          vm.user.id = user.id
          vm.user.first_name = user.first_name
          vm.user.last_name = user.last_name
          vm.user.middle_name = user.middle_name
          vm.user.email = user.email
          vm.user.login = user.login
          vm.user.group = user.group ?? {
            id: 0,
            name: '',
            team_leader: null
          } as GroupInterface
          vm.user.phone = user.phone
          vm.user.role = user.role
          vm.user.organization = user.organization
          vm.user.pbxConfig = user.pbx_config ?? {
            display_name: '',
            login: '',
            password: '',
            port: 0,
            server: ''
          } as PBXInterface

          if (user.group) {
            vm.$refs.sGroups.pushData(user.group)
            vm.$refs.sGroups.setSelected(user.group)
          }

          if (user.organization) {
            vm.$refs.sOrganizations.pushData(user.organization)
            vm.$refs.sOrganizations.setSelected(user.organization)
          }
        })
      })
  },

  watch: {
    // Password comparison
    password: {
      handler (password: DataPasswordInterface) {
        if (password.value1 === password.value2) {
          password.isValid = true
          this.$refs.password1.resetValidation()
          this.$refs.password2.resetValidation()
          return
        }
        password.isValid = false
      },
      deep: true
    },

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
      const params: any = { organization_id: 0 }

      if (this.organizationSelected) {
        params.organization_id = this.organizationSelected.id
      } else {
        if (this.user.organization) {
          params.organization_id = this.user.organization.id
        }
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
        phone: this.user.phone,
        email: this.user.email,
        role: this.user.role?.id
      }

      if ('id' in this.user.project) {
        requestData.project_id = this.user.project.id
      }

      if ('id' in this.organizationSelected) {
        requestData.organization_id = this.organizationSelected.id
      }

      if ('id' in this.user.group) {
        requestData.group_id = this.user.group.id
      }

      if (this.password.value1) {
        requestData.password = this.password.value1
      }

      if (this.user.pbxConfig.login && this.user.pbxConfig.password && this.user.pbxConfig.server && this.user.pbxConfig.port) {
        requestData.pbx_config = this.user.pbxConfig
      }

      this.buttonSave.loading = true
      new Users()
        .update(+this.$route.params.user_id, requestData)
        .then(() => {
          this.$toast.success(this.$tc('User updated successfully'))
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
    },

    onBtnDeleteClick () {
      // todo: Реализовать удаление
    }
  }
})
</script>

<style scoped>

</style>
