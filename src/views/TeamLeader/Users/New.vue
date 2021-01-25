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
                class="mr-4 primary white--text"
                style="font-size: 20px"
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
            :rules="[]"
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
            :rules="[rules.notBlank, ruleDynamic(password.isValid, $tc('passwords_do_not_match')).val]"
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
            :rules="[rules.notBlank, ruleDynamic(password.isValid, $tc('passwords_do_not_match')).val]"
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
    </div>

    <div class="text-h6">{{ $tc('Telephony') }}</div>
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

    <div class="pa-16"/>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import countryCodes from '@/mixins/countryCodes'
import { OrganizationInterface } from '@/api/Organizations'
import Users from '@/api/Users'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'

interface DataPasswordInterface {
  visible: boolean;
  isValid: boolean;
  value1: string;
  value2: string;
  isEmpty: () => boolean;
}

export default Vue.extend({
  mixins: [rules, countryCodes],

  data () {
    return {
      password: {
        visible: false,
        isValid: false,
        value1: '',
        value2: ''
      } as DataPasswordInterface,
      pbxPasswordVisible: false,
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      user: {
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',

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

  watch: {
    'user.organization': {
      handler (value: OrganizationInterface) {
        if (value) {
          this.$refs.sGroups.fetchData({
            organization_id: value.id
          })
        }
      }
    },
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

  mounted () {
    this.$refs.sOrganizations.fetchData()
  },

  methods: {

    resetForm () {
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      const postData: any = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        login: this.user.login,
        password: this.password.value1,
        phone: this.user.phone,
        email: this.user.email
      }

      if (this.user.middle_name) {
        postData.middle_name = this.user.middle_name.trim()
      }

      if (this.user.pbxConfig.login && this.user.pbxConfig.password && this.user.pbxConfig.server && this.user.pbxConfig.port) {
        postData.pbx_config = this.user.pbxConfig
      }

      this.buttonSave.loading = true
      new Users()
        .add(postData)
        .then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('User added successfully'))
        }).catch((e) => {
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              for (const error of e.errors) {
                this.$toast.error(error.message)
              }
            }
          }
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
