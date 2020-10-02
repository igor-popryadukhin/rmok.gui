<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height pa-0"
        fluid
      >
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
                    :label="$t('login')"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="authorization.password"
                    :label="$t('password')"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="grey"
                  tile
                  text
                >{{ $t('restore_access') }}</v-btn>
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
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosResponse } from 'axios'
import { POSITION } from 'vue-toastification'

export default Vue.extend({
  data () {
    return {
      isError: false,
      errorMessage: '',
      authorization: {
        login: '',
        password: '',
        loading: false
      }
    }
  },

  methods: {
    login (login: string, password: string) {
      this.isError = false
      this.authorization.loading = true
      axios.post(`${process.env.VUE_APP_API}/account/authorization`, {
        login,
        password
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          this.$cookie.set('access_token', response.data.access_token, { 'max-age': 3600 })
          this.$cookie.set('refresh_token', response.data.refresh_token)
          this.$toast.success(this.$tc('messages.authorisation_success'), {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: true,
            hideProgressBar: true,
            closeButton: 'button',
            icon: true,
            rtl: false,
            onClose: () => {
              this.$router.replace('/')
            }
          })
        }
      }).catch((e) => {
        this.$toast.error(this.$tc('messages.authorisation_error'), {
          position: POSITION.TOP_RIGHT,
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: true,
          closeButton: 'button',
          icon: true,
          rtl: false
        })
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
