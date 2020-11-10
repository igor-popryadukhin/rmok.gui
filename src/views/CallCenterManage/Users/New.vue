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

        <!--  -->
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
              v-model="user.password"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[rules.required]"
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
              v-model="user.password2"
              :label="$tc('password')"
              :type="password.visible ? '' : 'password'"
              :rules="[rules.required]"
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
          >
            <s-role-combo-box
              v-model="user.role"
              :label="$tc('role')"
              visible-icon
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
              :visible-organization-name="false"
              auto-load
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
              {{ $tc('Save') }}
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
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'

interface Email {
  value: string;
  label: string;
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
        visible: false
      },
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      user: {
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        role: {} as RoleInterface,
        group: {} as GroupInterface
      }
      /* eslint-enable */
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
          password: this.user.password.trim(),
          phone: this.user.phone.trim(),
          email: this.user.email,
          role: this.user.role.id,
          group_id: this.user.group.id
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('user_added_successfully'))
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
