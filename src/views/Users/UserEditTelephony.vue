<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('PBX connection parameters' ) }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :color="$vuetify.theme.currentTheme.error"
          :loading="pbxDeleteConfigLoading"
          :disabled="pbxFetchConfigLoading"
          outlined
          text
          tile
          small
          @click="onBtnDeleteClick"
        >
          {{ $tc('Delete') }}
        </v-btn>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :loading="pbxSaveConfigLoading"
          :disabled="pbxFetchConfigLoading"
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
    <v-divider />
    <v-form ref="pbxConfigForm">
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="pbxConfig.display_name"
            :label="$tc('Display name/number')"
            :loading="pbxFetchConfigLoading"
            :rules="[assertLength({ max: 20 })]"
            autofocus
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="8"
        >
          <v-text-field
            v-model="pbxConfig.server"
            :label="$tc('Server address')"
            :loading="pbxFetchConfigLoading"
            :rules="[rules.notBlank, rules.ipOrDomain]"
            required
          />
        </v-col>
        <v-col
          cols="12"
          lg="2"
          md="4"
        >
          <v-text-field
            v-model="pbxConfig.port"
            :label="$tc('Port')"
            :loading="pbxFetchConfigLoading"
            :rules="[rules.positive]"
            type="number"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="pbxConfig.login"
            :label="$tc('Login')"
            :loading="pbxFetchConfigLoading"
            :rules="[rules.notBlank, rules.noSpace]"
            required
          />
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="pbxConfig.password"
            :label="$tc('Password')"
            :type="pbxPasswordVisible ? '' : 'password'"
            :loading="pbxFetchConfigLoading"
            :rules="[rules.notBlank, rules.noSpace]"
            autocomplete="new-password"
            required
          >
            <template #append>
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
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import PBXConfig from '@/api/interfaces/PBXConfig'
import { Users } from '@/api/Users'
import countryCodes from '@/mixins/countryCodes'
import rules from '@/mixins/rules'
import Vue, { VueConstructor } from 'vue'

interface Data {
  pbxConfig: PBXConfig;
  pbxPasswordVisible: boolean;
  pbxSaveConfigLoading: boolean;
  pbxDeleteConfigLoading: boolean;
  pbxFetchConfigLoading: boolean;
}

interface VueInner extends Vue {
  $data: Data
}

export default (Vue as VueConstructor<VueInner>).extend({
  mixins: [rules, countryCodes],

  data (): Data {
    return {
      pbxSaveConfigLoading: false,
      pbxFetchConfigLoading: false,
      pbxDeleteConfigLoading: false,
      pbxConfig: {
        display_name: '',
        login: '',
        password: '',
        port: 443,
        server: ''
      },
      pbxPasswordVisible: false
    }
  },

  computed: {
    userId (): number {
      return +this.$route.params.user_id
    }
  },

  mounted () {
    this.fetchPBXConfiguration(this.userId)
  },

  methods: {
    /**
     *
     */
    fetchPBXConfiguration (userId: number) {
      this.pbxFetchConfigLoading = true
      new Users()
        .getPBX(userId)
        .then((pbx) => {
          this.pbxConfig.display_name = pbx.display_name
          this.pbxConfig.server = pbx.server
          this.pbxConfig.port = pbx.port
          this.pbxConfig.login = pbx.login
          this.pbxConfig.password = pbx.password
        }).finally(() => (this.pbxFetchConfigLoading = false))
    },

    /**
     *
     */
    onBtnSaveClick () {
      if (!(this.$refs.pbxConfigForm as any).validate()) { return }

      this.pbxSaveConfigLoading = true
      new Users()
        .savePBX(this.userId, {
          display_name: this.pbxConfig.display_name,
          server: this.pbxConfig.server,
          port: this.pbxConfig.port,
          login: this.pbxConfig.login,
          password: this.pbxConfig.password
        })
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        }).catch((e) => {
          this.$toast.error(e.message)
        }).finally(() => (this.pbxSaveConfigLoading = false))
    },

    onBtnDeleteClick () {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$tc('Are you sure you want to delete the connection parameters?'),
        showClose: false,
        actions: {
          false: this.$tc('No'),
          true: this.$tc('Yes')
        }
      }).then((result: boolean) => {
        if (result) {
          this.pbxDeleteConfigLoading = true
          new Users()
            .deletePBX(this.userId)
            .then(() => {
              this.$toast.success(this.$tc('Changes accepted'))
              this.$router.go(0)
            }).catch((e) => {
              this.$toast.error(e.message)
            }).finally(() => (this.pbxDeleteConfigLoading = false))
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
