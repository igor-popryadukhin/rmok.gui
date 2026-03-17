<template>
  <v-container>
    <div class="ua">
      <div class="u" />
      <div class="a" />
    </div>
    <v-row
      v-if="processAuthorization"
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
        style="height: 350px"
      >
        <div
          class="d-flex align-center justify-center fill-height"
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
        sm="6"
        md="4"
        lg="3"
        xl="2"
        class="d-flex flex-column justify-center"
        style="height: 350px"
      >
        <div
          class="text-center text-h6 mb-5"
          style="color: #00000099; font-family: Roboto, sans-serif"
        >
          {{ $t('login_to_the_system') }}
        </div>

        <div>
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
            :label="$t('Password')"
            name="password"
            prepend-icon="mdi-lock"
            type="password"
            @keyup.enter="login(authorization.login, authorization.password)"
          />
        </div>

        <div class="d-flex justify-end">
          <v-btn
            disabled
            small
            tile
            text
          >
            {{ $t('Restore access') }}
          </v-btn>
          <v-btn
            id="v-btn-sig-in"
            color="black"
            :loading="authorization.loading"
            small
            tile
            text
            @click="login(authorization.login, authorization.password)"
          >
            {{ $t('sign_in') }}
          </v-btn>
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
        class="d-flex flex-columns justify-space-around"
      >
        <div style="font-size: 13px; font-family: Roboto, sans-serif">
          <div class="text-center grey--text mb-2">
            {{ $t('version', { version: $projectVersion }) }}
          </div>
          <div class="text-center grey--text">
            © Голосовые технологии
          </div>
          <div class="text-center grey--text">
            {{ $dayjs().format('YYYY') }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import $store from '@/store';
import axios, { AxiosResponse } from 'axios';
import AppBase from '@/AppBase';
import Component from 'vue-class-component';

// See https://github.com/lancedikson/bowser
import * as Bowser from 'bowser';
import { Route } from 'vue-router/types/router';

@Component({
  beforeRouteEnter (to: Route, from: Route, next) {
    $store.commit('bootstrap_process', false);
    next((vm) => {
      // Если перешли на страницу авторизации.
      // Следует отключиться от телефонии.
      if (vm.$dialer.isConnected()) {
        vm.$dialer.disconnect();
      }
    });
  }
})
export default class Login extends AppBase {
  axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT
  })
  authorization = {
    loading: false,
    login: '',
    password: ''
  };

  isError = false;
  processAuthorization = false;
  processMessage = '';

  private login (login: string, password: string) {
    const browser = Bowser.parse(window.navigator.userAgent);

    this.processAuthorization = true;
    this.isError = false;
    this.authorization.loading = true;
    this.processMessage = this.$tc('Authentication...');
    this.axiosInstance.post(`${process.env.VUE_APP_API_ENDPOINT}/account/authorization`, {
      login,
      password,
      meta: {
        ...browser
      }
    }).then(async (response: AxiosResponse) => {
      if (response.status === 200) {
        /* eslint-disable */
        // @ts-ignore
        this.$cookie.set('access_token', response.data.access_token, { path: '/', 'Max-Age': 1800 });

        // TODO: SSE JWT
        this.$cookie.set('mercureAuthorization', this.$cookie.get('access_token'), {
          path: '/',
          'max-age': 86400
        });
        // @ts-ignore
        this.$cookie.set('refresh_token', response.data.refresh_token, { 'max-age': 31536000, 'path': '/' });

        this.processMessage = this.$tc('Loading profile data...');
        await this.$store.dispatch('profile/fetch');

        setTimeout(() => {
          this.$router.replace('/contacts-new');
        }, 1000);

        this.processMessage = this.$tc('Login successful!');
        /* eslint-enable */
      } else {
        this.processMessage = this.$tc('Authentication Error!');
      }
    }).catch(() => {
      this.processMessage = this.$tc('Authentication Error!');
    }).finally(() => {
      setTimeout(() => {
        this.authorization.loading = false;
        this.processAuthorization = false;
      }, 3000);
    });
  }

  mounted () {
    if (this.$monitoring.connected) { this.$monitoring.disconnect(); }
  }
}
</script>

<style lang="scss" scoped>
.ua {
  position: absolute;
  left: 0;
  top: 0;
  height: 2px;
  width: 2px;
  .u {
    height: 100%;
    width: 100%;
    background-color: #3a70d4;
  }
  .a {
    height: 100%;
    width: 100%;
    background-color: #e1e12b;
  }
}
</style>
