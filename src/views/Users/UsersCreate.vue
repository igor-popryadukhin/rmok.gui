<template>
  <v-container
    class="mt-5"
    style="max-width: 500px"
  >
    <div class="mb-5">
      <v-text-field
        v-model="form.first_name"
        :label="$tc('First name')"
        :error-messages="validatorErrors('first_name', true)"
        :success-messages="validatorSuccess('first_name')"
        dense
        outlined
        flat
      />

      <v-text-field
        v-model="form.last_name"
        :label="$tc('Last name')"
        :error-messages="validatorErrors('last_name', true)"
        :success-messages="validatorSuccess('last_name')"
        dense
        outlined
        flat
      />

      <v-text-field
        v-model="form.middle_name"
        :label="$tc('Middle name')"
        :error-messages="validatorErrors('middle_name')"
        :success-messages="validatorSuccess('middle_name')"
        dense
        outlined
        flat
      />
    </div>

    <div class="mb-5">
      <v-text-field
        v-model="form.login"
        :label="$tc('Login')"
        :error-messages="validatorErrors('login', true)"
        :success-messages="validatorSuccess('login')"
        dense
        outlined
        flat
      />

      <v-text-field
        v-model="form.password"
        :label="$tc('Password')"
        :error-messages="validatorErrors('password', true)"
        :success-messages="validatorSuccess('password')"
        :type="passwordVisible ? 'text' : 'password'"
        prepend-inner-icon="mdi-form-textbox-password"
        autocomplete="new-password"
        dense
        outlined
        flat
      >
        <template #append>
          <v-btn
            icon
            small
            @click="generatePassword"
          >
            <v-icon small>
              mdi-auto-fix
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="passwordVisible = !passwordVisible"
          >
            <v-icon
              v-if="passwordVisible"
              small
            >
              mdi-eye-outline
            </v-icon>
            <v-icon
              v-else
              small
            >
              mdi-eye-off-outline
            </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="mb-5">
      <smart-autocomplete
        v-model="form.group_ids"
        :label="$tc('Group')"
        :api-query="(q) => { return { q } }"
        :error-messages="validatorErrors('group_ids')"
        :success-messages="validatorSuccess('group_ids')"
        api-end-point="/groups"
        item-text="name"
        item-value="id"
        response-property="data"
        store-module-name="groups"
        multiple
        clearable
      />

      <v-select
        v-model="form.role"
        :label="$tc('Role')"
        :items="roles"
        item-text="title"
        item-value="value"
        dense
        outlined
        flat
      />

      <smart-autocomplete
        v-model="form.country_id"
        :label="$tc('Country')"
        :error-messages="validatorErrors('country_id')"
        :success-messages="validatorSuccess('country_id')"
        api-end-point="/database/countries"
        item-text="name"
        item-value="id"
        store-module-name="countries"
        clearable
      />
    </div>

    <v-divider class="mb-2" />

    <div class="mb-5">
      <v-btn
        :loading="conservationProcess"
        :disabled="validatorIsInvalid"
        tile
        text
        outlined
        @click="userCreate"
      >
        {{ $tc('Create') }}
      </v-btn>
    </div>

    <div class="mb-16" />
  </v-container>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import AppBase from '@/AppBase'
import { loadLanguageAsync } from '@/plugins/i18n'
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import debounce from '@/utils/debounce'
import { generatePassword } from '@/utils/utils'
import { AxiosResponse } from 'axios'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

// eslint-disable-next-line no-use-before-define
@Component<UsersCreate>({
  components: {
    SmartAutocomplete
  },
  beforeRouteEnter (to, from, next) {
    // TODO: Language optional
    loadLanguageAsync('ru', 'messages')
      .finally(() => {
        next()
      })
  }
})
export default class UsersCreate extends AppBase {
  conservationProcess = false
  validator = []
  passwordVisible = false
  form = {
    first_name: null,
    last_name: null,
    middle_name: null,
    login: null,
    password: null,
    role: null,
    group_ids: null,
    country_id: null
  }

  get validatorIsInvalid () {
    return this.validator.length === 0 || this.validator.findIndex((e) => e.status === 'failure') > -1
  }

  // Справочники
  get roles () {
    return [
      {
        title: 'Администратор',
        value: 'ROLE_ADMIN'
      },
      {
        title: 'Руководитель колл-центра',
        value: 'ROLE_CCM'
      },
      {
        title: 'Руководитель группы',
        value: 'ROLE_TEAM_LEADER'
      },
      {
        title: 'Оператор',
        value: 'ROLE_OPERATOR'
      }
    ]
  }

  @Watch('form', { deep: true })
  formWatchHandler () {
    this.onChangeFields()
  }

  public created () {
    this.onChangeFields = debounce(this.onChangeFields, 350)
  }

  private onChangeFields () {
    this.$axios
      .post('/users/create-validations',
        { ...this.form }
      )
      .then((response: AxiosResponse) => {
        this.validator = response.data || []
      })
  }

  private validatorErrors (property: string, require = false) {
    const index = this.validator.findIndex((e) => e.property_name === `[${property}]` && e.status === 'failure')
    if (index > -1) {
      if (require) {
        return this.validator[index].message
      }
      return this.validator[index].value ? this.validator[index].message : ''
    }
    return ''
  }

  private validatorSuccess (property: string) {
    const index = this.validator.findIndex((e) => e.property_name === `[${property}]` && e.status === 'success')
    if (index > -1 && this.validator[index].value) {
      return this.validator[index].message
    }
    return ''
  }

  private userCreate () {
    this.conservationProcess = true

    this.$axios.post('/users', {
      first_name: this.form.first_name.trim(),
      last_name: this.form.last_name.trim(),
      ...(typeof this.form.middle_name === 'string' ? { middle_name: this.form.middle_name.trim() } : {}),
      login: this.form.login,
      password: this.form.password.trim(),
      role: this.form.role,
      ...(Array.isArray(this.form.group_ids) ? { group_ids: this.form.group_ids } : {})
    })
      .then((response: AxiosResponse) => {
        if (response.status !== 201) {
          throw new APIError(response.data)
        }

        this.$router.replace({
          name: 'users_view',
          params: {
            id: String(response.data.id)
          }
        })

        this.$toast.success('User created')
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      }).finally(() => (this.conservationProcess = false))
  }

  private generatePassword () {
    this.passwordVisible = true
    this.form.password = generatePassword(8)
  }
}
</script>

<style lang="scss" scoped>

.child-mr:not(:first-child):not(:last-child) {
  margin-right: 10px;
}

</style>
