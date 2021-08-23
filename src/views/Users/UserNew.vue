<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Create a new user' ) }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :loading="targetUserSaveProcessLoading"
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
    <v-form
      ref="userNewForm"
      lazy-validation
    >
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="newUser.first_name"
            :label="$tc('First name')"
            :rules="[rules.required, rules.lengthMax(100)]"
            autofocus
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="newUser.last_name"
            :label="$tc('Last name')"
            :rules="[rules.required, rules.lengthMax(100)]"
            autofocus
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="newUser.middle_name"
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
            v-model="newUser.login"
            :label="$tc('Login')"
            :rules="[rules.required, rules.isValidLoginName, rules.lengthMax(100)]"
            autofocus
          />
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="newUser.password1"
            :label="$tc('Password')"
            :type="passwordShow ? '' : 'password'"
            autocomplete="new-password"
            autofocus
          >
            <template #append>
              <v-btn
                v-if="newUser.password1.length > 0 && newUser.password1 === newUser.password2"
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
            v-model="newUser.password2"
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
            v-model="newUser.group_id"
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
          <app-role-autocomplete
            v-model="newUser.role_id"
            :label="$tc('Role')"
            :rules="[rules.notBlank]"
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
            v-model="newUser.country_id"
            :items="availableCountries"
            :label="$tc('Country')"
            item-text="name"
            item-value="id"
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
            v-model="newUser.phone"
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
            v-model="newUser.email"
            :label="$tc('E-Mail')"
            type="phone"
            autofocus
          />
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { Database } from '@/api/Database'
import Users from '@/api/Users'
import rules from '@/mixins/rules'
import statusActions from '@/mixins/statusActions'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import { generatePassword } from '@/utils/utils'
import VInterface from '@/VInterface'
import Clipboard from 'v-clipboard'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'
import AppRoleAutocomplete from '@/components/AppRoleAutocomplete/AppRoleAutocomplete.vue'

Vue.use(Clipboard)

interface Refs {
  [key: string]: any;
}

interface Data {
  passwordShow: boolean;
  targetUserSaveProcessLoading: boolean;
  newUser: any;
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $refs: Refs;
  $data: Data;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppRoleAutocomplete, AppUserGroupAutocomplete },

  metaInfo () {
    return {
      title: this.$tc('Create a new user')
    }
  },

  mixins: [rules, vueScrollOptions, statusActions],

  data (): Data {
    return {
      availableCountries: [],
      passwordShow: false,
      targetUserSaveProcessLoading: false,
      newUser: {
        country_id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        password1: '',
        password2: '',
        group_id: 0,
        phone: '',
        email: '',
        role_id: 0
      }
    }
  },

  computed: {
    userId (): number {
      return +this.$route.params.user_id
    }
  },

  mounted () {
    this.fetchCountries()
  },

  methods: {

    /**
     * Происходит, когда нажали на кнопку "Копировать пароль"
     */
    onBtnCopyPasswordClick () {
      this.$clipboard(this.newUser.password1)
      this.$toast.info(this.$tc('Password copied to clipboard'))
    },

    /**
     * Происходит, когда нажали на кнопку "Сгенерировать пароль"
     */
    onBtnGeneratePasswordClick () {
      const password = generatePassword(10)

      this.newUser.password1 = password
      this.newUser.password2 = password
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
      if (!this.$refs.userNewForm.validate()) {
        return
      }

      this.targetUserSaveProcessLoading = true

      const request: Record<string, string | number> = {
        first_name: this.newUser.first_name,
        last_name: this.newUser.last_name,
        middle_name: this.newUser.middle_name,
        login: this.newUser.login,
        password: this.newUser.password1,
        role_id: this.newUser.role_id
      }

      if (this.newUser.country_id) {
        request.country_id = this.newUser.country_id
      }

      if (this.newUser.group_id) {
        request.group_id = this.newUser.group_id
      }

      new Users()
        .create(request)
        .then((id: number) => {
          this.$toast.success(this.$tc('The user has been successfully created.'))
          this.$router.push({
            name: 'users_edit_main',
            params: {
              owner_id: id
            } as any
          })
        }).catch((e) => {
          this.$toast.error(e.message)
        }).finally(() => (this.targetUserSaveProcessLoading = false))
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
