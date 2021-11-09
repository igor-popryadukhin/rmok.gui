<template>
  <v-card>
    <v-card-title>
      {{ $tc('ice_server', 1) }}
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="dUrls"
        :label="$tc('URLS')"
        :rules="[ruleNotBlank, ruleMaxLength]"
        :messages="$tc('Possible options, separated by commas: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302')"
        placeholder="stun:stun.l.google.com:19302"
        prepend-inner-icon="mdi-server"
      />

      <v-text-field
        v-model="dUsername"
        :label="$tc('User name')"
        prepend-inner-icon="mdi-account"
        autocomplete="off"
      />

      <v-text-field
        v-model="dPassword"
        :label="$tc('Password')"
        prepend-inner-icon="mdi-form-textbox-password"
        type="password"
        autocomplete="new-password"
      />
    </v-card-text>

    <v-card-text class="py-0">
      <v-divider />
    </v-card-text>

    <v-card-actions class="py-4 px-4">
      <v-spacer />
      <v-btn
        text
        tile
        small
        @click="onBtnCancelClick"
      >
        {{ $tc('Cancel') }}
      </v-btn>

      <v-btn
        text
        tile
        small
        @click="onBtnSaveClick"
      >
        {{ $tc('Save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppICEServerEditor',

  props: {

    urls: {
      default: '',
      type: String
    },

    username: {
      default: '',
      type: String
    },

    password: {
      default: '',
      type: String
    },

    handler: Function
  },

  data () {
    return {
      dUrls: '',
      dUsername: '',
      dPassword: ''
    }
  },

  computed: {
    ruleNotBlank () {
      return (value: string) => !!value || this.$tc('This field should not be blank.')
    },
    ruleMaxLength () {
      return (value: string) => (value?.length || 0) < 255 || this.$tc('rule_max_dynamic_length', value.length)
    }
  },

  watch: {},

  mounted () {
    this.$data.dUrls = this.$props.urls
    this.$data.dUsername = this.$props.username
    this.$data.dPassword = this.$props.password
  },

  methods: {

    onBtnCancelClick () {
      if (typeof this.handler !== 'function') {
        return
      }

      this.handler('cancel')
    },

    onBtnSaveClick () {
      if (typeof this.handler !== 'function') {
        return
      }

      this.handler('save', {
        urls: this.dUrls,
        username: this.dUsername,
        password: this.dPassword
      })
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

<i18n>
{
  "ru" : {
    "Possible options, separated by commas: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302": "Возможные варианты через запятую: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302"
  }
}
</i18n>
