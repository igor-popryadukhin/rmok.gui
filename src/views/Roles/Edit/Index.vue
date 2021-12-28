<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3>{{ $tc('Editing role parameters') }}</h3>
      </template>
      <template #right>
        <v-btn
          :loading="saveProcess"
          small
          tile
          text
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider class="mb-4" />

    <v-sheet>
      <div class="mb-1">
        <v-text-field
          v-model="roleName"
          label="Название роли"
          dense
          outlined
          style="max-width: 450px"
        />
      </div>
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
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

@Component
export default class Index extends AppBase {
  saveProcess = false
  permissionsEdit = []

  get roleName () {
    return this.$store.getters['roles/edit/name']
  }

  set roleName (value: string) {
    this.$store.commit('roles/edit/name', value)
  }

  get permissions () {
    return this.$store.getters['roles/edit/permissions']
  }

  set permissions (value: Array<Record<string, any>>) {
    this.$store.commit('roles/edit/permissions', value)
  }

  @Watch('permissions')
  permissionsWatchHandler (value: Array<Record<string, any>>) {
    this.permissionsEdit = value.map((value) => { return { ...value } })
  }

  mounted () {
    this.$store
      .dispatch('roles/edit/fetch')
  }

  private onBtnSaveClick () {
    this.permissions = this.permissionsEdit
    this.saveProcess = true
    this.$store.dispatch('roles/edit/save')
      .then(() => (this.$toast.success('Changes accepted')))
      .catch((reason: Error) => (this.$toast.error(reason.message)))
      .finally(() => (this.saveProcess = false))
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "role_title": "Изменение параметров роли \"{name}\""
  }
}
</i18n>
