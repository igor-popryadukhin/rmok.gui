<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Основные параметры профиля' ) }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :loading="targetUserSaveProcessLoading"
          :disabled="targetUserProcessLoading"
          color="primary"
          outlined
          text
          tile
          small
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider class="mb-5" />
    <template v-if="targetUserProcessLoading">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-form
        ref="userEditForm"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="targetUser.first_name"
              :label="$tc('Имя')"
              autofocus
            />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="targetUser.last_name"
              :label="$tc('Фамилия')"
              autofocus
            />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="targetUser.middle_name"
              :label="$tc('Отчество')"
              autofocus
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
              v-model="targetUser.login"
              :label="$tc('Login')"
              :rules="[isLoginUnique]"
              autofocus
            />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            md="4"
          >
            <v-text-field
              v-model="targetUser.password1"
              :label="$tc('Password')"
              :type="passwordShow ? '' : 'password'"
              autocomplete="new-password"
              autofocus
            >
              <template #append>
                <v-btn
                  v-if="passwordShow"
                  icon
                  small
                  @click="passwordShow = false"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  small
                  icon
                  @click="passwordShow = true"
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
              v-model="targetUser.password2"
              :label="$tc('Password')"
              :type="passwordShow ? '' : 'password'"
              autocomplete="new-password"
              autofocus
            >
              <template #append>
                <v-btn
                  v-if="passwordShow"
                  icon
                  small
                  @click="passwordShow = false"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  small
                  icon
                  @click="passwordShow = true"
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
            md="6"
          >
            <app-user-group-autocomplete
              v-model="targetUser.group_id"
              :label="$tc('Group')"
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
            <app-role-autocomplete
              v-model="targetUser.role_id"
              :items="availableRoles"
              :label="$tc('Role')"
              item-text="title"
              item-value="value"
            />
          </v-col>
        </v-row>

        <!-- Контактная информация -->
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('Контактная информация' ) }}
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
              v-model="targetUser.country_id"
              :items="availableCountries"
              :label="$tc('Country')"
              item-text="name"
              item-value="id"
              @focus="onCountryFocus"
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
              v-model="targetUser.phone"
              :label="$tc('Phone number')"
              type="phone"
              autofocus
            />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            md="6"
          >
            <v-text-field
              v-model="targetUser.email"
              :label="$tc('E-Mail')"
              type="phone"
              autofocus
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import { Database } from '@/api/Database'
import Users from '@/api/Users'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import rules from '@/mixins/rules'
import statusActions from '@/mixins/statusActions'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import AppRoleAutocomplete from '@/components/AppRoleAutocomplete/AppRoleAutocomplete.vue'
import { debounce } from 'vuetify/src/util/helpers'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'

interface Refs {
  [key: string]: any;
}

interface Data {
  passwordShow: boolean;
  targetUserSaveProcessLoading: boolean;
  targetUserProcessLoading: boolean;
  targetUser: any;
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $refs: Refs;
  $data: Data;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppUserGroupAutocomplete, AppRoleAutocomplete, AppLoading },

  mixins: [rules, vueScrollOptions, statusActions],

  data (): Data {
    return {
      availableCountries: [],
      passwordShow: false,
      targetUserSaveProcessLoading: false,
      targetUserProcessLoading: false,
      targetUser: {
        first_name: '',
        last_name: '',
        middle_name: '',
        group_id: 0,
        login: '',
        password1: '',
        password2: '',
        country_id: undefined,
        phone: '',
        email: '',
        role_id: 0
      },
      isLoginUnique: true,
      oldLoginName: ''
    }
  },

  computed: {
    userId (): number {
      return +this.$route.params.user_id
    }
  },

  watch: {
    'targetUser.login': {
      handler (login: number) {
        // Если старый логин не равен текущему
        if (this.oldLoginName !== this.targetUser.login) {
          this.loginCheck(login)
        }
      }
    }
  },

  created () {
    this.loginCheck = debounce(this.loginCheck, 500)
  },

  mounted () {
    this.fetchUser()
  },

  methods: {
    fetchUser () {
      this.$data.targetUserProcessLoading = true
      new Users()
        .getById(this.userId, { fields: 'project,group,country' })
        .then((response) => {
          this.$data.targetUser.first_name = response.first_name
          this.$data.targetUser.last_name = response.last_name
          this.$data.targetUser.middle_name = response.middle_name
          this.$data.targetUser.login = response.login
          this.$data.targetUser.group_id = response.group?.id || 0
          this.$data.targetUser.role_id = response.role?.id || 0
          this.$data.targetUser.country_id = response.country?.id || 0
          if (response.country) {
            this.$data.availableCountries = [response.country]
          }
          this.$data.targetUser.phone = response.phone
          this.$data.targetUser.email = response.email
          this.$data.oldLoginName = response.login
        }).finally(() => (this.$data.targetUserProcessLoading = false))
    },

    fetchCountries () {
      new Database()
        .getCountries()
        .then((response) => {
          this.$data.availableCountries = response
        })
    },

    /**
     * Происходит, когда нажали на кнопку "Сохранить"
     */
    onBtnSaveClick () {
      if (!this.$refs.userEditForm.validate()) {
        return
      }

      const request: Record<string, string | number> = {
        first_name: this.targetUser.first_name,
        last_name: this.targetUser.last_name,
        middle_name: this.targetUser.middle_name,
        login: this.targetUser.login,
        role_id: this.targetUser.role_id,
        phone: this.targetUser.phone,
        email: this.targetUser.email
      }

      if (this.targetUser.password1) {
        request.password = this.targetUser.password1
      }

      if (this.targetUser.country_id) {
        request.country_id = this.targetUser.country_id
      }

      if (this.targetUser.group_id) {
        request.group_id = this.targetUser.group_id
      }

      this.targetUserSaveProcessLoading = true
      new Users()
        .edit(this.userId, request)
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        }).catch((e) => {
          this.$toast.error(e.message)
        }).finally(() => (this.targetUserSaveProcessLoading = false))
    },

    onCountryFocus () {
      if (this.$data.availableCountries.length < 2) {
        this.fetchCountries()
      }
    },

    loginCheck (val: string) {
      new Users()
        .loginFind({
          q: val
        })
        .then(({ data }) => {
          if (data) {
            this.isLoginUnique = this.$t('К сожалению, логин занят')
          } else {
            this.isLoginUnique = true
          }
        })
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
