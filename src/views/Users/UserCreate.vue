<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Create a new user') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :loading="processCreate && !validateProcess"
          :disabled="!processCreate && validateProcess"
          color="primary"
          outlined
          text
          tile
          small
          @click="onBtnCreateClick"
        >
          {{ $tc('Create') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider class="mb-5" />
    <v-form
      ref="form"
      v-model="formIsValid"
      lazy-validation
    >
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="first_name"
            v-bind="firstNameField"
            :label="$tc('First name')"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="last_name"
            v-bind="lastNameField"
            :label="$tc('Last name')"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="middle_name"
            v-bind="middleNameField"
            :label="$tc('Surname')"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
      </v-row>
      <!-- Логин, пароль -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="login"
            v-bind="loginField"
            :label="$tc('Login')"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="password"
            v-bind="passwordField"
            :label="$tc('Password')"
            :type="passwordShow ? '' : 'password'"
            autocomplete="new-password"
            autofocus
            @input="onFieldsChange"
          >
            <template #append>
              <v-btn
                v-if="password.length > 0 && password === password2"
                class="mr-2"
                icon
                small
                @click="onBtnCopyPasswordClick"
              >
                <v-icon small>
                  mdi-content-copy
                </v-icon>
              </v-btn>
              <v-btn
                class="mr-2"
                icon
                small
                @click="onBtnGeneratePasswordClick"
              >
                <v-icon small>
                  mdi-auto-fix
                </v-icon>
              </v-btn>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon small>
                  mdi-eye
                </v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon small>
                  mdi-eye-off
                </v-icon>
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
            v-model="password2"
            v-bind="passwordField"
            :label="$tc('Password')"
            :type="passwordShow ? '' : 'password'"
            autocomplete="new-password"
            autofocus
            @input="onFieldsChange"
          >
            <template #append>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon small>
                  mdi-eye
                </v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon small>
                  mdi-eye-off
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
        >
          <app-user-group-autocomplete
            v-model="group_id"
            :label="$tc('User group')"
          />
        </v-col>
      </v-row>

      <!-- Роль -->
      <v-row class="mb-5">
        <v-col
          cols="12"
          lg="4"
          md="6"
        >
          <v-autocomplete
            v-model="role_id"
            v-bind="roleField"
            :items="role.options"
            :search-input.sync="role.q"
            :label="$tc('Role')"
            item-value="id"
            item-text="name"
            clearable
            hide-selected
            @input="onFieldsChange"
          />
        </v-col>
      </v-row>

      <!-- Контактная информация -->
      <app-tools>
        <template #left>
          <h3 class="grey--text">
            {{ $tc('Контактная информация') }}
          </h3>
        </template>
      </app-tools>
      <v-divider class="mb-5" />
      <!-- Страна -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
        >
          <v-select
            v-model="country_id"
            :items="availableCountries"
            :label="$tc('Country')"
            item-text="name"
            item-value="id"
            @input="onFieldsChange"
          />
        </v-col>
      </v-row>

      <!-- Телефон -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
        >
          <v-text-field
            v-model="phone"
            v-bind="phoneField"
            :label="$tc('Phone number')"
            type="phone"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="6"
        >
          <v-text-field
            v-model="email"
            :label="$tc('E-Mail')"
            v-bind="emailField"
            autofocus
            @input="onFieldsChange"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { Database } from '@/api/Database'
import { generatePassword } from '@/utils/utils'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'
import Roles from '@/api/Roles'
import { AxiosResponse } from 'axios'
import ValidationState from '@/api/interfaces/ValidationState'

export default Vue.extend({
  components: { AppUserGroupAutocomplete },

  metaInfo () {
    return {
      title: this.$tc('Create a new user')
    }
  },

  data () {
    return {
      validateProcess: false,
      validatePropertiesTimeoutId: null,
      errors: [] as ValidationState[],
      formIsValid: false,
      defaultValid: {
        error: false,
        success: false,
        errorMessages: [],
        successMessages: []
      },
      role: {
        q: '',
        options: []
      },
      availableCountries: [],
      passwordShow: false,
      processCreate: false,
      password2: ''
    }
  },

  computed: {
    // Поля
    first_name: {
      get () {
        return this.$store.getters['users/create/first_name']
      },
      set (val: string) {
        return this.$store.commit('users/create/first_name', val)
      }
    },
    last_name: {
      get () {
        return this.$store.getters['users/create/last_name']
      },
      set (val: string) {
        return this.$store.commit('users/create/last_name', val)
      }
    },
    middle_name: {
      get () {
        return this.$store.getters['users/create/middle_name']
      },
      set (val: string) {
        return this.$store.commit('users/create/middle_name', val)
      }
    },
    login: {
      get () {
        return this.$store.getters['users/create/login']
      },
      set (val: string) {
        return this.$store.commit('users/create/login', val)
      }
    },
    password: {
      get () {
        return this.$store.getters['users/create/password']
      },
      set (val: string) {
        return this.$store.commit('users/create/password', val)
      }
    },
    email: {
      get () {
        return this.$store.getters['users/create/email']
      },
      set (val: string) {
        return this.$store.commit('users/create/email', val)
      }
    },
    phone: {
      get () {
        return this.$store.getters['users/create/phone']
      },
      set (val: string) {
        return this.$store.commit('users/create/phone', val)
      }
    },
    country_id: {
      get () {
        return this.$store.getters['users/create/country_id']
      },
      set (val: string) {
        return this.$store.commit('users/create/country_id', val)
      }
    },
    group_id: {
      get () {
        return this.$store.getters['users/create/group_id']
      },
      set (val: string) {
        return this.$store.commit('users/create/group_id', val)
      }
    },
    role_id: {
      get () {
        return this.$store.getters['users/create/role_id']
      },
      set (val: string) {
        return this.$store.commit('users/create/role_id', val)
      }
    },
    // Поля

    // Управление состоянием полей ввода информации
    firstNameField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[first_name]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    lastNameField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[last_name]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    middleNameField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[middle_name]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    loginField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[login]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    emailField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[email]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    phoneField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[phone]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }
      return this.defaultValid
    },
    passwordField (): Record<string, unknown> {
      if (this.password !== this.password2) {
        return {
          error: true,
          errorMessages: [this.$tc('Password mismatch')]
        }
      }

      const index = this.$data.errors.findIndex((e) => e.property_name === '[password]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }

      return this.defaultValid
    },
    roleField (): Record<string, unknown> {
      const index = this.$data.errors.findIndex((e) => e.property_name === '[role_id]')
      if (index > -1) {
        return this.fieldComputeState(this.$data.errors[index])
      }

      return this.defaultValid
    },
    // Управление состоянием полей ввода информации

    // Состояние валидности формы
    isValid (): boolean {
      return !(this.$data.errors.findIndex((e) => e.status === 'failure') > -1)
    }
  },

  watch: {
    login () {
      this.validateAll()
    },
    password () {
      this.validateAll()
    }
  },

  mounted () {
    this.fetchCountries()
    this.fetchRoles()
  },

  methods: {

    /**
     * Происходит, когда нажали на кнопку "Копировать пароль"
     */
    onBtnCopyPasswordClick () {
      this.$clipboard(this.password)
      this.$toast.info(this.$tc('Password copied to clipboard'))
    },

    /**
     * Происходит, когда нажали на кнопку "Сгенерировать пароль"
     */
    onBtnGeneratePasswordClick () {
      const password = generatePassword(10)

      this.password = password
      this.password2 = password
    },

    /**
     * Локально загружает страны
     */
    fetchCountries () {
      new Database()
        .getCountries()
        .then((response) => {
          this.$data.availableCountries = response
        })
    },

    /**
     * Локально загружает роли
     */
    fetchRoles () {
      new Roles()
        .find()
        .then((response) => {
          this.$data.role.options = response.data
        })
    },

    /**
     * Происходит, когда нажали на кнопку "Сохранить"
     */
    async onBtnCreateClick () {
      if (this.validatePropertiesTimeoutId) {
        return
      }

      await this.validateAll()

      if (!this.$refs.form.validate() || !this.isValid) {
        this.$toast.warning(this.$tc('Some fields are not filled correctly!'))
        return
      }

      this.processCreate = true
      this.$store
        .dispatch('users/create/create')
        .then((id: number) => {
          this.$toast.success(this.$tc('The user has been successfully created.'))
          this.$router.push({
            name: 'users_edit_main',
            params: {
              user_id: String(id)
            }
          })
        }).catch((e) => {
          this.$toast.error(e.message)
        }).finally(() => (this.processCreate = false))
    },

    /**
     * Срабатывает всякий раз когда изменяется значение в каком либо поле формы.
     */
    onFieldsChange () {
      this.validateAll()
    },

    /**
     * Выполняет валидацию полей.
     * Записывает результат проверки в массив.
     *
     * @param data
     * @return Promise<boolean>
     */
    async validateProperties (data: Record<string, unknown>): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        clearTimeout(this.validatePropertiesTimeoutId)
        this.validateProcess = true
        this.validatePropertiesTimeoutId = setTimeout(() => {
          return this.$axios
            .post('/users/create-validations', data)
            .then((response: AxiosResponse) => {
              if (response.status === 200 && Array.isArray(response.data)) {
                this.errors = (response.data as ValidationState[])
                if (this.isValid) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              } else {
                resolve(false)
                this.errors = []
              }
            }).finally(() => {
              this.validatePropertiesTimeoutId = null
              this.validateProcess = false
            })
        }, 1000)
      })
    },

    /**
     * Запускает процесс валидации заданных полей.
     */
    validateAll () {
      const validateData: Record<string, unknown> = {
        first_name: this.first_name,
        last_name: this.last_name,
        login: this.login,
        password: this.password,
        role_id: this.role_id
      }

      // Если поля пустые, проверку не выполнять!
      // Что бы не получить ложные результаты.

      if (this.middle_name) {
        validateData.middle_name = this.middle_name
      }

      if (this.phone) {
        validateData.phone = this.phone
      }

      if (this.email) {
        validateData.email = this.email
      }

      return this.validateProperties(validateData)
    },

    /**
     * Формирует объект состояния поля на основе входящих данных.
     *
     * @param item
     */
    fieldComputeState (item: Record<string, unknown>) {
      if (item.status === 'failure') {
        return {
          errorMessages: [item.message],
          successMessages: [],
          success: false,
          error: true
        }
      } else if (item.status === 'success') {
        return {
          errorMessages: [],
          successMessages: [item.message],
          success: true,
          error: false
        }
      }
    }
  }
})

</script>

<style lang="scss" scoped>
.v-tabs-items__border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}

.profile-background {
  background-image: linear-gradient(to bottom, #3A70D4, #3A70D4, #3A70D4, #3A70D4);
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 2px;
}
</style>
