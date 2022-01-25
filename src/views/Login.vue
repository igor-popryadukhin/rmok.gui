<template>
  <v-container>
    <v-row
      v-if="processAuthorization"
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <div
          class="d-flex align-center justify-center"
          style="min-height: 100px"
        >
          {{ processMessage }}
        </div>
      </v-col>
    </v-row>
    <v-row
      v-else
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card
          tile
          flat
        >
          <v-toolbar
            flat
          >
            <v-toolbar-title>{{ $t('login_to_the_system') }}</v-toolbar-title>
            <v-spacer />
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
              />

              <v-text-field
                v-model="authorization.password"
                :label="$t('password')"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                @keyup.enter="login(authorization.login, authorization.password)"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              tile
              text
            >
              {{ $t('Restore access') }}
            </v-btn>
            <v-btn
              id="v-btn-sig-in"
              color="black"
              :loading="authorization.loading"
              tile
              text
              @click="login(authorization.login, authorization.password)"
            >
              {{ $t('sign_in') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios, { AxiosResponse } from 'axios'
import AppBase from '@/AppBase'
import Component from 'vue-class-component'

// See https://github.com/lancedikson/bowser
import * as Bowser from 'bowser'
import { Route } from 'vue-router/types/router'

@Component({
  beforeRouteEnter (to: Route, from: Route, next) {
    next(vm => {
      // Если перешли на страницу авторизации.
      // Следует отключиться от телефонии.
      if (vm.$dialer.isConnected()) {
        vm.$dialer.disconnect()
      }
    })
  }
})
export default class Login extends AppBase {
  authorization = {
    loading: false,
    login: '',
    password: ''
  };

  isError = false;
  processAuthorization = false;
  processMessage = '';

  login (login: string, password: string) {
    const browser = Bowser.parse(window.navigator.userAgent)

    this.processAuthorization = true
    this.isError = false
    this.authorization.loading = true
    this.processMessage = this.$tc('Authentication...')
    axios.post(`${process.env.VUE_APP_API}/account/authorization`, {
      login,
      password,
      meta: {
        ...browser
      }
    }).then(async (response: AxiosResponse) => {
      if (response.status === 200) {
        /* eslint-disable */
        // @ts-ignore
        this.$cookie.set('access_token', response.data.access_token, { path: '/', 'max-age': 86400 });

        // TODO: SSE JWT
        this.$cookie.set('mercureAuthorization', 'eyJhbGciOiJIUzUxMiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyIqIl19fQ.DJkY462v8sDVWMdAlmpIjvac_NfXjLoh8nfLfdT6wb-4CN6Vth1qL0HY36U2QFowXsj6JzDQ58r0fOI-J-JSsA', {
          path: '/',
          'max-age': 86400
        });
        // @ts-ignore
        this.$cookie.set('refresh_token', response.data.refresh_token, { 'max-age': 31536000, 'path': '/' });

        this.processMessage = this.$tc('Loading profile data...');
        await this.$store.dispatch('profile/fetch');

        setTimeout(() => {
          this.$router.replace('/leads');
        }, 1000);

        this.processMessage = this.$tc('Login successful!');
        /* eslint-enable */
      } else {
        this.processMessage = this.$tc('Authentication Error!')
      }
    }).catch(() => {
      this.processMessage = this.$tc('Authentication Error!')
    }).finally(() => {
      setTimeout(() => {
        this.authorization.loading = false
        this.processAuthorization = false
      }, 3000)
    })
  }

  browser () {
    //
  }
}
</script>
