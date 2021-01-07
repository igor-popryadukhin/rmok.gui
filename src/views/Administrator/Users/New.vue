<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
    >
      <v-container>

        <div class="text-h6">{{ $tc('Profile') }}</div>
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

          <!-- Role -->
          <v-row>
            <v-col
              cols="12"
            >
              <s-role-combo-box
                v-model="user.role"
                :label="$tc('Role')"
                visible-icon
                :rules="[rules.notBlank]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
            >
              <s-autocomplete-organizations
                v-model="organizationSelected"
                :label="$tc('organization')"
                visible-icon
                :rules="[rules.notBlank]"
              />
            </v-col>
          </v-row>

          <!-- Group -->
          <v-row>
            <v-col
              cols="12"
            >
              <s-autocomplete-groups
                v-model="user.group"
                :label="$tc('Group')"
                visible-icon
                :value="user.group"
                :disabled="!organizationSelected"
                :organization-id="organizationSelected ? organizationSelected.id : 0"
              >
                <template v-slot:no-data>
                  <v-list-item
                    link
                    target="_blank"
                    :to="{ name: 'administrator_groups_new' }"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        Нажмите что бы добавить новую группу
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </s-autocomplete-groups>
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
              {{ $tc('add') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
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
import SAutocompleteOrganizations from '@/snippets/Autocomplete/SAutocompleteOrganizations.vue'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'
import { OrganizationInterface } from '@/api/Organizations'

interface DataPasswordInterface {
  visible: boolean;
  isValid: boolean;
  value1: string;
  value2: string;
}

export default Vue.extend({
  mixins: [rules, countryCodes],
  components: {
    SRoleComboBox,
    SAutocompleteGroups,
    SAutocompleteOrganizations
  },

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
      organizationSelected: null as OrganizationInterface | any,
      /* eslint-disable */
      user: {
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',
        role: {} as RoleInterface,
        group: {} as GroupInterface,
        pbx_config: {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        }
      } as UserInterface
      /* eslint-enable */
    }
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
      new Users()
        .add({
          /* eslint-disable */
          first_name: this.user.first_name.trim(),
          last_name: this.user.last_name.trim(),
          middle_name: this.user.middle_name.trim(),
          login: this.user.login.trim(),
          password: this.password.value1.trim(),
          phone: this.user.phone.trim(),
          email: this.user.email,
          role: this.user.role?.id,
          organization_id: this.organizationSelected.id,
          group_id: this.user.group?.id,
          pbx_config: this.user.pbx_config
          /* eslint-enable */
        }).then(() => {
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
