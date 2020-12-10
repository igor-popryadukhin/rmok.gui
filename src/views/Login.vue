<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <div class="d-flex align-center justify-center" style="min-height: 100px">
          {{ processMessage }}
        </div>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card tile flat>
          <v-toolbar
            flat
          >
            <v-toolbar-title>{{ $t('login_to_the_system') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="authorization.login"
                :label="$tc('Login')"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                @keyup.enter="login(authorization.login, authorization.password)"
              ></v-text-field>

              <v-text-field
                v-model="authorization.password"
                :label="$t('password')"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                @keyup.enter="login(authorization.login, authorization.password)"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              tile
              text
            >{{ $t('Restore access') }}</v-btn>
            <v-btn
              color="black"
              tile
              text
              :loading="authorization.loading"
              @click="login(authorization.login, authorization.password)"
            >{{ $t('sign_in') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosResponse } from 'axios'

export default Vue.extend({
  data () {
    return {
      isError: false,
      errorMessage: '',
      processMessage: '',
      authorization: {
        login: '',
        password: '',
        loading: false
      }
    }
  },

  created () {
    this.$cookie.delete('access_token')
    this.$cookie.delete('refresh_token')
  },

  methods: {
    login (login: string, password: string) {
      this.isError = false
      this.authorization.loading = true
      this.processMessage = 'Авторизация...'
      axios.post(`${process.env.VUE_APP_API}/account/authorization`, {
        login,
        password
      }).then(async (response: AxiosResponse) => {
        if (response.status === 200) {
          /* eslint-disable */
          // @ts-ignore
          this.$cookie.set('access_token', response.data.access_token, { path: '/', 'max-age': 600 })
          // @ts-ignore
          this.$cookie.set('refresh_token', response.data.refresh_token, { path: '/' })
          this.$toast.success(this.$tc('messages.authorisation_success'))

          this.processMessage = 'Загрузка данных профиля...'
          await this.$store.dispatch('profile/loadProfile')
          this.processMessage = 'Загрузка проектов...'
          await this.$store.dispatch('project/load')
          this.processMessage = '';
          this.$router.replace('/')
          /* eslint-enable */
        }
      }).catch(() => {
        this.$toast.error(this.$tc('messages.authorisation_error'))
      }).finally(() => {
        this.authorization.loading = false
        this.processMessage = ''
      })
    }
  }
})
</script>

<style lang="scss">
 html {
   overflow: hidden !important;
 }
</style>
