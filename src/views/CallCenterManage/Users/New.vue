<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
      class="mr-4"
    >
      <div class="text-h6 grey--text">{{ $tc('Profile') }}</div>
      <div class="mb-10">
        <!-- FLM -->
        <v-row>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <!-- eslint-disable -->
            <v-text-field
              v-model="userFirstName"
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
                  <v-btn icon large min-height="60" min-width="60">
                    <v-icon color="white">mdi-camera-outline</v-icon>
                  </v-btn>
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
              v-model="userLastName"
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
              v-model="userMiddleName"
              :label="$tc('middle_name')"
              :rules="[rules.lengthMax(255)]"
              required
              counter
            ></v-text-field>
          </v-col>
        </v-row>

        <!--  -->
        <v-row>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="userLogin"
              :label="$tc('Login')"
              :rules="[rules.notBlank]"
              autocomplete="new-password"
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
              v-model="userPassword1"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[rules.notBlank]"
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
              v-model="userPassword2"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[rules.notBlank]"
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

        <!-- Телефон и EMail  -->
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="6"
          >
            <v-text-field
              v-model="userEmail"
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
            lg="6"
            md="6"
          >
            <v-text-field
              v-model="userPhoneNumber"
              :label="$tc('phone')"
              type="tel"
              :rules="[rules.phoneNumber]"
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
            md="6"
            lg="6"
          >
            <s-role-combo-box
              v-model="userRole"
              :label="$tc('Role')"
              visible-icon
              :rules="[rules.notBlank]"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            lg="6"
          >
            <s-autocomplete-groups
              v-model="userGroup"
              :label="$tc('Group')"
              visible-icon
              :visible-organization-name="false"
              auto-load
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
              v-model="userPBXConfig.display_name"
              :label="$tc('SIP phone number')"
              :hint="$tc('The phone number that is displayed when calling from your PBX')"
              persistent-hint
              :rules="[rules.lengthMax(20)]"
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
              v-model="userPBXConfig.server"
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
              v-model="userPBXConfig.port"
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
              v-model="userPBXConfig.login"
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
              v-model="userPBXConfig.password"
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
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import countryCodes from '@/mixins/countryCodes'
import { Users } from '@/api/Users'
import SRoleComboBox from '@/snippets/SRoleComboBox/SRoleComboBox.vue'
import SAutocompleteGroups from '@/snippets/Autocomplete/SAutocompleteGroups.vue'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { RoleInterface } from '@/api/Roles'

interface PostDataInterface {
  first_name: string;
  last_name: string;
  middle_name?: string;
  login: string;
  password: string;
  phone?: string;
  email?: string;
  role: string;
  group_id?: number;
  pbx_config?: PBXInterface;
}

export default Vue.extend({

  mixins: [rules, countryCodes],

  components: {
    SRoleComboBox,
    SAutocompleteGroups
  },

  data () {
    return {
      password: {
        visible: false,
        value1: '',
        value2: ''
      },
      pbxPasswordVisible: false,
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      userFirstName: '' as string,
      userLastName: '' as string,
      userMiddleName: '' as string,
      userLogin: '' as string,
      userPassword1: '' as string,
      userPassword2: '' as string,
      userEmail: '' as string,
      userPhoneNumber: '' as string,
      userPBXConfig: {
        display_name: '',
        login: '',
        password: '',
        port: 0,
        server: ''
      } as PBXInterface,
      userRole: null as unknown as RoleInterface,
      userGroup: null as unknown as GroupInterface
    }
    /* eslint-enable */
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

      const data: PostDataInterface = {
        first_name: this.userFirstName.trim(),
        last_name: this.userLastName.trim(),
        middle_name: this.userMiddleName.trim(),
        login: this.userLogin.trim(),
        password: this.userPassword1,
        role: this.userRole.id
      }

      if (this.userPBXConfig) {
        data.pbx_config = this.userPBXConfig
      }

      if (this.userEmail) {
        data.email = this.userEmail
      }

      if (this.userPhoneNumber) {
        data.phone = this.userPhoneNumber.trim()
      }

      // Группа необязательна, поэтому если есть можно указать
      if (this.userGroup) {
        data.group_id = this.userGroup?.id
      }

      new Users()
        .add(data)
        .then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('User added successfully'))
        }).catch((e) => {
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
