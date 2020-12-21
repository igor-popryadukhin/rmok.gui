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
        <div class="d-flex align-center justify-center" style="min-height: 100px">
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
      processAuthorization: false,
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
      this.processAuthorization = true
      this.isError = false
      this.authorization.loading = true
      this.processMessage = this.$tc('Authorization...')
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

          this.processMessage = this.$tc('Loading profile data...')
          await this.$store.dispatch('profile/loadProfile')

          this.processMessage = this.$tc('Loading projects...')
          await this.$store.dispatch('project/load')

          // Если авторизовался оператор
          if (this.$store.getters['profile/role_is_operator']) {
            this.$router.replace({ name: 'operator_home' })
            .then(() => {
              // Загрузить проекты, что бы оператор мог выбрать из списка
              this.$root.$emit('root-loading-projects')
            })
          }

          if (this.$store.getters['profile/role_is_team_leader']) {
            this.$router.replace({ name: 'team_leader' })
          }

          if (this.$store.getters['profile/role_is_admin']) {
            this.$router.replace({ name: 'administrator' })
          }

          if (this.$store.getters['profile/role_is_leader_cc']) {
            this.$router.replace({ name: 'call_center_manager' })
          }

          this.processMessage = this.$tc('Login successful!')
          /* eslint-enable */
        }
      }).catch(() => {
        this.processAuthorization = false
        this.processMessage = this.$tc('Authorisation Error!')
      }).finally(() => {
        this.authorization.loading = false
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
