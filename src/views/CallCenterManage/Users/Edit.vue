<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
      class="mr-4"
    >
      <div class="text-h6">{{ $tc('Profile') }}</div>
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
              v-model="user.first_name"
              :label="$tc('first_name')"
              persistent-hint
              required
              :rules="[rules.required]"
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
              :rules="[rules.required]"
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
              :rules="[rules.required]"
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
              v-model="user.login"
              :label="$tc('Login')"
              :rules="[rules.required]"
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
              v-model="password.value1"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[]"
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
              v-model="password.value2"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[]"
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

        <!--  -->
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="6"
          >
            <v-text-field
              v-model="user.email"
              :label="$tc('email')"
              :rules="[rules.required]"
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
              :rules="[rules.required]"
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
            md="6"
            lg="6"
          >
            <s-role-combo-box
              v-model="user.role"
              :label="$tc('Role')"
              visible-icon
              :value="user.role"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            lg="6"
          >
            <s-autocomplete-groups
              v-model="user.group"
              :label="$tc('Group')"
              visible-icon
              :selected-id="user.group ? user.group.id : 0"
              :visible-organization-name="false"
            />
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
              v-model="user.pbx_config.display_name"
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
              v-model="user.pbx_config.server"
              :label="$tc('Server address')"
              :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru')"
              persistent-hint
              :rules="[rules.notBlank]"
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
              v-model="user.pbx_config.port"
              :label="$tc('Port')"
              type="number"
              persistent-hint
              required
              single-line
              :rules="[rules.positive]"
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
              v-model="user.pbx_config.login"
              :label="$tc('Login')"
              :hint="$tc('Login to access your PBX. For example: 003452')"
              persistent-hint
              :rules="[rules.notBlank]"
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
              v-model="user.pbx_config.password"
              :label="$tc('Password')"
              :hint="$tc('PBX access password')"
              :type="pbxPasswordVisible ? '' : 'password'"
              persistent-hint
              :rules="[rules.notBlank]"
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
import { UserInterface, Users } from '@/api/Users'
import SRoleComboBox from '@/snippets/SRoleComboBox/SRoleComboBox.vue'
import SAutocompleteGroups from '@/snippets/Autocomplete/SAutocompleteGroups.vue'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'

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
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',
        role: null,
        pbx_config: {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        },
        group: {} as GroupInterface,
        organization: null
      } as UserInterface
    }
  },

  created () {
    this.user.id = 1
    new Users()
      .getById(+this.$route.params.id)
      .then((user: UserInterface) => {
        this.user.id = user.id
        this.user.first_name = user.first_name
        this.user.last_name = user.last_name
        this.user.middle_name = user.middle_name
        this.user.email = user.email
        this.user.login = user.login
        this.user.group = user.group ?? {
          id: 0,
          name: '',
          team_leader: null
        } as GroupInterface
        this.user.phone = user.phone
        this.user.role = user.role
        this.user.organization = user.organization
        this.user.pbx_config = user.pbx_config ?? {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        } as PBXInterface
      })
  },

  methods: {
    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true
      new Users()
        .update(+this.$route.params.id, {
          /* eslint-disable */
          first_name: this.user.first_name.trim(),
          last_name: this.user.last_name.trim(),
          middle_name: this.user.middle_name.trim(),
          login: this.user.login.trim(),
          password: this.password.value1.trim(),
          phone: this.user.phone.trim(),
          email: this.user.email,
          role: this.user.role ? this.user.role.id : null,
          group_id: this.user.group ? this.user.group.id : null,
          pbx_config: this.user.pbx_config
          /* eslint-enable */
        }).then(() => {
          this.$toast.success(this.$tc('User updated successfully!'))
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
