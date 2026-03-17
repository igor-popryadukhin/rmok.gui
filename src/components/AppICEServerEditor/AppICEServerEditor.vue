<template>
  <v-card>
    <v-card-title>
      {{ $tc('ICE server') }}
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="urlsSync"
        :label="$tc('URLS')"
        :messages="$tc('Possible options, separated by commas: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302')"
        placeholder="stun:stun.l.google.com:19302"
        prepend-inner-icon="mdi-server"
      />

      <v-text-field
        v-model="usernameSync"
        :label="$tc('User name')"
        :error-messages="usernameSyncErrors"
        prepend-inner-icon="mdi-account"
        autocomplete="off"
        @input="$v.usernameSync.$touch()"
        @blur="$v.usernameSync.$touch()"
      />

      <v-text-field
        v-model="credentialSync"
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
        @click="clickCancel"
      >
        {{ $tc('Cancel') }}
      </v-btn>

      <v-btn
        text
        tile
        small
        @click="clickSave"
      >
        {{ $tc('Save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, PropSync } from 'vue-property-decorator';
import Vuelidate, { validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';
Vue.use(Vuelidate);

@Component({
  mixins: [validationMixin],
  validations: {
    usernameSync: { maxLength: maxLength(255) }
  },
  computed: {
    usernameSyncErrors () {
      const errors = [];
      if (!this.$v.usernameSync.$dirty) return errors;
      !this.$v.usernameSync.maxLength && errors.push('User name must be at most 255 characters long');
      return errors.map((e) => this.$tc(e));
    }
  }
})
export default class AppICEServerEditor extends Vue {
  @PropSync('urls', { default: () => '', type: String }) urlsSync!: string
  @PropSync('username', { default: () => '', type: String }) usernameSync!: string
  @PropSync('credential', { default: () => '', type: String }) credentialSync!: string

  @Emit('click:cancel')
  clickCancel () {
    return undefined;
  }

  @Emit('click:save')
  clickSave () {
    return undefined;
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n>
{
  "ru" : {
    "Possible options, separated by commas: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302": "Возможные варианты через запятую: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302",
    "ICE server": "ICE сервер",
    "ICE servers": "ICE серверы"
  }
}
</i18n>
