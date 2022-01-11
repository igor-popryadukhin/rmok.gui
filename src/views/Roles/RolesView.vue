<template>
  <v-sheet class="roles-view-page">
    <div
      v-if="fetching"
      class="d-flex align-center justify-center fill-height"
    >
      <app-loading />
    </div>
    <v-sheet v-else>
      <v-container
        style="max-width: 768px"
      >
        <div class="mt-10 mb-3">
          <v-text-field
            v-model="roleName"
            :error-messages="roleNameErrors"
            label="Название роли"
            dense
            outlined
            @input="$v.roleName.$touch()"
            @blur="$v.roleName.$touch()"
          />
        </div>

        <v-sheet
          height="400"
          class="mb-3 overflow-auto px-2"
          outlined
        >
          <template v-for="(item, key) in permissionsEdit">
            <v-checkbox
              :key="'v-checkbox-' + key"
              v-model="item.granted"
              :label="item.name"
              hide-details
              dense
            />
          </template>
        </v-sheet>

        <v-divider class="my-3" />

        <div class="mb-3">
          <v-btn
            :loading="saveProcess"
            :disabled="$v.$invalid"
            tile
            text
            outlined
            @click="onBtnSaveClick"
          >
            {{ $tc('Save change') }}
          </v-btn>
        </div>

        <div class="mb-16" />
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Role from '@/api/interfaces/Role'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import rules from '@/mixins/rules'
import { loadLanguageAsync } from '@/plugins/i18n'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import Vue from 'vue'
import Vuelidate, { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
Vue.use(Vuelidate)

@Component({
  components: { AppLoading },
  mixins: [rules, validationMixin],
  beforeRouteEnter (to, from, next) {
    next(vm => {
      loadLanguageAsync('ru', 'messages')
      vm.$store.dispatch('roles/edit/fetch')
        .catch((reason: Error) => {
          vm.$toast.error(reason.message)
        })
    })
  },
  validations: {
    roleName: { required, maxLength: maxLength(255) }
  }
})
export default class RolesView extends AppBase {
  saveProcess = false
  permissionsEdit = []

  get thisPageHeight () { return this.screenHeight - 80 }
  get fetching (): boolean { return this.$store.getters['roles/edit/fetching'] }

  get roleName () { return this.$store.getters['roles/edit/role_name'] }
  set roleName (value: string) { this.$store.commit('roles/edit/role_name', value) }

  get rolePermissions () { return this.$store.getters['roles/edit/role_permissions'] }
  set rolePermissions (value: Role[]) {
    this.$store.commit('roles/edit/role_permissions', value)
  }

  // Validate
  get roleNameErrors () {
    const errors = []
    if (!this.$v.roleName.$dirty) return errors
    !this.$v.roleName.maxLength && errors.push('Role name must be at most 255 characters long')
    !this.$v.roleName.required && errors.push('Role name is required.')
    return errors.map((e) => this.$tc(e))
  }

  @Watch('rolePermissions')
  permissionsWatchHandler (value: Array<Record<string, unknown>>) {
    this.permissionsEdit = value.map((value) => { return { ...value } })
  }

  private onBtnSaveClick () {
    this.$v.$touch()

    this.rolePermissions = this.permissionsEdit
    this.saveProcess = true
    this.$store.dispatch('roles/edit/save')
      .then(() => (this.$toast.success('Changes accepted')))
      .catch((reason: Error | APIError) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
      .finally(() => (this.saveProcess = false))
  }
}
</script>

<style lang="scss" scoped>
.roles-view-page {
  height: 100%;
}
</style>

<i18n>
{
  "ru": {
    "role_title": "Изменение параметров роли \"{name}\""
  }
}
</i18n>
