<template>
  <div>
    <v-row>
      <v-col
        cols="12"
      >
        <v-textarea
          v-model="token.access_token"
          :label="$tc('Access token')"
          outlined
          readonly
          :messages="$tc('To generate a new token, click on <Create access token>')"
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
      >
        <v-btn
          class="mr-2"
          text
          @click="onGenerateAccessTokenClick"
        >
          {{ $tc('Create access token') }}
        </v-btn>
        <v-btn
          class="mr-2"
          text
          v-clipboard:copy="token.access_token"
        >
          {{ $tc('Copy') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Organizations } from '@/api/Organizations'
import AccessTokenInterface from '@/api/Schemas/AccessTokenInterface'
import VueClipboard from 'vue-clipboard2'

// See documentations https://vue-clipboard2.inndy.tw
Vue.use(VueClipboard)

export default Vue.extend({
  data () {
    return {
      processCreating: false,
      token: {
        access_token: '',
        expires_in: 0,
        token_type: ''
        /* eslint-enable */
      } as AccessTokenInterface
    }
  },

  methods: {
    onGenerateAccessTokenClick () {
      new Organizations()
        .generatePersonalAccessToken()
        .then((token) => {
          this.token = token
          this.$toast.warning(this.$tc('Do not transfer the access token to third parties!'), {
            timeout: false
          })
          this.$toast.warning(this.$tc('Make sure to copy your new personal access token now. You won’t be able to see it again!'), {
            timeout: false
          })
          this.$toast.success(this.$tc('Access token generated successfully!'))
        })
    }
  }
})
</script>

<style scoped>

</style>
