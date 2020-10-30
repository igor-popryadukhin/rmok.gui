<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
    >
      <v-container>

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

        <!-- Credentials -->
        <v-row>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="user.login"
              :label="$tc('login')"
              :rules="[rules.required]"
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
              :rules="[rules.required, ruleDynamic(password.isValid, $tc('passwords_do_not_match')).val]"
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
              :rules="[rules.required, ruleDynamic(password.isValid, $tc('passwords_do_not_match')).val]"
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
              :rules="[rules.required, rules.email]"
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
              :rules="[rules.required, rules.phone_number]"
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
              :label="$tc('role')"
              visible-icon
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>

        <!-- Organizations -->
        <v-row>
          <v-col
              cols="12"
          >
            <s-autocomplete-organizations
                v-model="organizationSelected"
                :label="$tc('organization')"
                visible-icon
                :rules="[rules.required]"
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
              :label="$tc('group')"
              visible-icon
              :value="user.group"
              :disabled="!organizationSelected"
              :organization-id="organizationSelected ? organizationSelected.id : 0"
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>

<!--        <v-row>-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            lg="6"-->
<!--            md="12"-->
<!--          >-->
<!--            <v-text-field-->
<!--              :label="$tc('sip_display_name')"-->
<!--              :hint="$tc('sip_display_name_hint')"-->
<!--              persistent-hint-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col-->
<!--            cols="10"-->
<!--          >-->
<!--            <v-text-field-->
<!--              :label="$tc('server_address')"-->
<!--              :hint="$tc('server_address_hint')"-->
<!--              persistent-hint-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--          <v-col-->
<!--            cols="2"-->
<!--          >-->
<!--            <v-text-field-->
<!--              :label="$tc('server_port')"-->
<!--              persistent-hint-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            lg="6"-->
<!--            md="12"-->
<!--          >-->
<!--            <v-text-field-->
<!--              :label="$tc('login')"-->
<!--              :hint="$tc('login_hint')"-->
<!--              persistent-hint-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            lg="6"-->
<!--            md="12"-->
<!--          >-->
<!--            <v-text-field-->
<!--              :label="$tc('password')"-->
<!--              :hint="$tc('password_hint')"-->
<!--              :type="password.visible ? '' : 'password'"-->
<!--              persistent-hint-->
<!--              required-->
<!--            >-->
<!--              <template v-slot:append>-->
<!--                <v-btn-->
<!--                  v-if="password.visible"-->
<!--                  icon-->
<!--                  @click="password.visible = false"-->
<!--                >-->
<!--                  <v-icon>mdi-eye</v-icon>-->
<!--                </v-btn>-->
<!--                <v-btn-->
<!--                  v-else-->
<!--                  icon-->
<!--                  @click="password.visible = true"-->
<!--                >-->
<!--                  <v-icon>mdi-eye-off</v-icon>-->
<!--                </v-btn>-->
<!--              </template>-->
<!--            </v-text-field>-->
<!--          </v-col>-->
<!--        </v-row>-->

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
import { Users } from '@/api/Users'
import SRoleComboBox from '@/snippets/SRoleComboBox/SRoleComboBox.vue'
import SAutocompleteGroups from '@/snippets/Autocomplete/SAutocompleteGroups.vue'
import SAutocompleteOrganizations from '@/snippets/Autocomplete/SAutocompleteOrganizations.vue'

interface Email {
  value: string;
  label: string;
}

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
        value1: null,
        value2: null
      } as DataPasswordInterface,
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      organizationSelected: null,
      /* eslint-disable */
      user: {
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        email: '',
        phone: '',
        role: undefined,
        group: undefined
      }
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
      this.$refs.form.reset()
    },

    onSave () {
      if (!this.$refs.form.validate()) {
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
          role: this.user.role.id,
          organization_id: this.organizationSelected.id,
          group_id: this.user.group.id,
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('user_added_successfully'))
        }).catch((e) => {
          const cause: string = e.statusText || e.error_message || e || 'undefined'
          this.$toast.error(this.$t('error_occurred_while_added_the_user', { cause }))
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
