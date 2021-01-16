<template>
  <v-form
    ref="form"
    v-model="form.valid"
    lazy-validation
  >
    <div class="text-h6 grey--text">{{ $tc('Profile') }}</div>
    <div class="mb-10">
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <!-- eslint-disable -->
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
                class="mr-4"
                style="background-color: #8d3eb1; color: white"
              >
                AV
              </v-avatar>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <!-- eslint-disable -->
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
          <!-- eslint-disable -->
          <v-text-field
            v-model="user.middle_name"
            :label="$tc('middle_name')"
            persistent-hint
            required
            :rules="[rules.notBlank]"
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
            :label="$tc('password')"
            :type="password.visible ? '' : 'password'"
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
            :label="$tc('password')"
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
          lg="6"
          md="6"
        >
          <v-text-field
            v-model="user.email"
            :label="$tc('email')"
            :rules="[rules.notBlank, rules.email]"
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
          lg="6"
          md="6"
        >
          <v-text-field
            v-model="user.phone"
            :label="$tc('phone')"
            type="tel"
            :rules="[rules.notBlank, rules.phone_number]"
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

      <!-- Role -->
      <v-row>
        <v-col
          cols="12"
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

      <v-row>
        <v-col
          cols="12"
        >
          <s-organizations-autocomplete
            ref="sOrganizations"
            v-model="user.organization"
            :label="$tc('organization')"
            :rules="[]"
            disabled
            visible-icon
          />
        </v-col>
      </v-row>

      <!-- Group -->
      <v-row>
        <v-col
          cols="12"
        >
          <s-groups
            ref="sGroups"
            v-model="user.group"
            :label="$tc('Group')"
            visible-icon
            :disabled="user.organization === null"
          >
          </s-groups>
        </v-col>
      </v-row>
    </div>

    <div class="text-h6 grey--text">{{ $tc('Project') }}</div>
    <div class="mb-10">
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="6"
        >
          <s-projects-autocomplete
            ref="sProjectsAutocomplete"
            v-model="user.project"
            :label="$tc('User current project')"
            :params="{
              organization_id: user.organization ? user.organization.id : 0
            }"
            visible-icon
          />
        </v-col>
      </v-row>
    </div>

    <div class="text-h6 grey--text">{{ $tc('Telephony') }}</div>
    <div class="mb-10">
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="user.pbxConfig.display_name"
            :label="$tc('SIP phone number')"
            :hint="$tc('The phone number that is displayed when calling from your PBX')"
            persistent-hint
            :rules="[assertLength({ max: 20 })]"
            counter
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-account-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
        >
          <v-text-field
            v-model="user.pbxConfig.server"
            :label="$tc('Server address')"
            :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru')"
            persistent-hint
            :rules="[]"
            required
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-domain</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="2"
        >
          <v-text-field
            v-model="user.pbxConfig.port"
            :label="$tc('Port')"
            type="number"
            persistent-hint
            required
            single-line
            :rules="[]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="user.pbxConfig.login"
            :label="$tc('Login')"
            :hint="$tc('Login to access your PBX. For example: 003452')"
            persistent-hint
            :rules="[]"
            required
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-account-key</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="user.pbxConfig.password"
            :label="$tc('Password')"
            :hint="$tc('PBX access password')"
            :type="pbxPasswordVisible ? '' : 'password'"
            persistent-hint
            :rules="[]"
            required
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-form-textbox-password</v-icon>
            </template>
            <template v-slot:append>
              <v-btn
                v-if="pbxPasswordVisible"
                icon
                @click="pbxPasswordVisible = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                @click="pbxPasswordVisible = true"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <v-row class="mb-16">
      <v-col
        cols="12"
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
import countryCodes from '@/mixins/countryCodes'
import { UserInterface, Users } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'
import SRoles from '@/snippets/SRoles/SRoles.vue'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'

interface DataPasswordInterface {
  visible: boolean;
  isValid: boolean;
  value1: string;
  value2: string;
  isEmpty: () => boolean;
}

export default Vue.extend({
  mixins: [rules, countryCodes],

  components: {
    SProjectsAutocomplete,
    SOrganizationsAutocomplete,
    SGroups,
    SRoles
  },

  data () {
    return {
      password: {
        visible: false,
        isValid: true,
        value1: '',
        value2: '',
        isEmpty (): boolean {
          return Boolean(!this.value1 && !this.value2)
        }
      } as DataPasswordInterface,
      pbxPasswordVisible: false,
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
      organizationSelected: {} as OrganizationInterface,
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',
        role: null,
        group: null,
        organization: null,
        project: null,

        // Конфигурация подключения к АТС
        pbxConfig: {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        }
      } as any
    }
  },

  beforeRouteEnter (to, from, next) {
    new Users()
      .getById(+to.params.id)
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
          vm.user.pbx_config = user.pbx_config ?? {
            display_name: '',
            login: '',
            password: '',
            port: 0,
            server: ''
          } as PBXInterface

          if (user.project) {
            vm.$refs.sProjectsAutocomplete.setDefault(user.project.id)
          }

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

      const putData: any = {
        first_name: this.user.first_name.trim(),
        last_name: this.user.last_name.trim(),
        middle_name: this.user.middle_name.trim(),
        login: this.user.login.trim(),
        phone: this.user.phone.trim(),
        email: this.user.email,
        role: this.user.role?.id
      }

      if (this.user.project) {
        putData.project_id = this.user.project.id
      }

      if (this.user.group) {
        putData.group_id = this.user.group.id
      }

      if (this.password.value1) {
        putData.password = this.password.value1
      }

      if (this.user.pbxConfig.login && this.user.pbxConfig.password && this.user.pbxConfig.server && this.user.pbxConfig.port) {
        putData.pbx_config = this.user.pbxConfig
      }

      this.buttonSave.loading = true
      new Users()
        .update(+this.$route.params.id, putData)
        .then(() => {
          this.$toast.success(this.$tc('User updated successfully'))
        }).catch((e) => {
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              for (const error of e.errors) {
                this.$toast.warning(error.message)
              }
            }
          }
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    onBtnDeleteClick () {
      // todo: Реализовать удаление
    }
  }
})
</script>

<style scoped>

</style>
