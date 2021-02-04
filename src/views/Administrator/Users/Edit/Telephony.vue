<template>
  <v-container fluid>
    <v-form ref="form" lazy-validation>
      <!-- Номер SIP телефона -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
          xl="4"
        >
          <v-text-field
            v-model="pbxConfig.display_name"
            :label="$tc('SIP phone number')"
            :hint="$tc('The phone number that is displayed when calling from your PBX')"
            persistent-hint
            :rules="[assertLength({ max: 20 })]"
            counter
            autofocus
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

      <!-- Адрес сервера и порт -->
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="4"
          xl="4"
        >
          <v-text-field
            v-model="pbxConfig.server"
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
          cols="12"
          lg="1"
          md="1"
          xl="1"
        >
          <v-text-field
            v-model="pbxConfig.port"
            :label="$tc('Port')"
            type="number"
            persistent-hint
            required
            single-line
            :rules="[rules.positive]"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Логин -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
          xl="4"
        >
          <v-text-field
            v-model="pbxConfig.login"
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

      <!-- Пароль -->
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="6"
          xl="4"
        >
          <v-text-field
            v-model="pbxConfig.password"
            :label="$tc('Password')"
            :hint="$tc('PBX access password')"
            :type="pbxPasswordVisible ? '' : 'password'"
            persistent-hint
            :rules="[rules.notBlank]"
            autocomplete="new-password"
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

      <!-- Сохранить -->
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="4"
          xl="4"
          class="d-flex"
        >
          <v-spacer />
          <v-btn
            v-bind="buttonSave"
            color="primary"
            text
            tile
            outlined
            @click="onSave"
          >
            {{ $tc('Save') }}
          </v-btn>
        </v-col>
      </v-row>

      <div class="pa-16"/>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import countryCodes from '@/mixins/countryCodes'
import VInterface from '@/VInterface'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { UserInterface, Users } from '@/api/Users'

interface IData {
  pbxConfig: PBXInterface;
  pbxPasswordVisible: boolean;
  buttonSave: any;
}

interface VInnerInterface extends VInterface {
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  mixins: [rules, countryCodes],

  data (): IData {
    return {
      pbxPasswordVisible: false,
      pbxConfig: {
        display_name: '',
        login: '',
        password: '',
        port: 0,
        server: ''
      },
      buttonSave: {
        loading: false,
        disabled: false
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    new Users()
      .getById(+to.params.user_id)
      .then((response: UserInterface) => {
        next((vm: VInnerInterface) => {
          vm.$data.pbxConfig = response.pbx_config ?? {
            display_name: '',
            login: '',
            password: '',
            port: 0,
            server: ''
          }
        })
      })
  },

  methods: {
    onSave () {
      if (!this.$refs.form.validate()) { return }

      // Данные запроса
      const requestData: any = {
        pbx_config: this.pbxConfig
      }

      this.buttonSave.loading = true
      new Users()
        .update(+this.$route.params.user_id, requestData)
        .then(() => {
          this.$toast.success(this.$tc('User updated successfully'))
        }).catch((e) => {
          this.$toast.error(e.error)
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              for (const error of e.errors) {
                this.$toast.error(error.message)
              }
            }
          }
        }).finally(() => (this.buttonSave.loading = false))
    }
  }
})
</script>

<style scoped>

</style>
