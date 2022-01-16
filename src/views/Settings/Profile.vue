<template>
  <v-sheet>
    <v-container
      class="mt-5"
      style="max-width: 500px"
    >
      <div class="mb-5">
        <v-text-field
          v-model="firstName"
          :label="$tc('First name')"
          dense
          outlined
          flat
          @change="onChange"
        />

        <v-text-field
          v-model="lastName"
          :label="$tc('Last name')"
          dense
          outlined
          flat
          @change="onChange"
        />

        <v-text-field
          v-model="middleName"
          :label="$tc('Middle name')"
          dense
          outlined
          flat
          @change="onChange"
        />
      </div>

      <div class="mb-5">
        <v-text-field
          v-model="login"
          :label="$tc('Login')"
          readonly
          dense
          outlined
          flat
          @change="onChange"
        />

        <v-text-field
          :label="$tc('Password')"
          readonly
          dense
          outlined
          flat
          @change="onChange"
        />
      </div>

      <v-divider class="mb-2" />

      <div class="mb-5">
        <v-btn
          :loading="conservationProcess"
          :disabled="!isChanged"
          tile
          text
          outlined
          @click="projectSave"
        >
          {{ $tc('Save change') }}
        </v-btn>
      </div>

      <div class="mb-16" />
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Project from '@/api/interfaces/Project'
import Role from '@/api/interfaces/Role'
import UserGroup from '@/api/interfaces/UserGroup'
import AppBase from '@/AppBase'
import AppPellEditor from '@/components/AppPellEditor/AppPellEditor.vue'
import { $axios } from '@/plugins/axios'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<UsersViewMain>({
  components: { AppPellEditor, ProjectsTools, ProjectsItems },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if ((vm.$store.getters['roles/items'] as Role[]).length === 0) { vm.$store.dispatch('roles/fetch') }
      if ((vm.$store.getters['groups/list/items'] as UserGroup[]).length === 0) { vm.$store.dispatch('groups/list/fetch') }
    })
  }
})
export default class UsersViewMain extends AppBase {
  conservationProcess = false
  isChanged = false

  // Forms
  get firstName () { return this.$store.getters['profile/first_name'] }
  set firstName (val: string) { this.$store.commit('profile/first_name', val) }

  get lastName () { return this.$store.getters['profile/last_name'] }
  set lastName (val: string) { this.$store.commit('profile/last_name', val) }

  get middleName () { return this.$store.getters['profile/middle_name'] }
  set middleName (val: string) { this.$store.commit('profile/middle_name', val) }

  get login () { return this.$store.getters['profile/login'] }
  set login (val: string) { this.$store.commit('profile', val) }

  get roleId (): number { return (this.$store.getters['users/view/user_role'] as Role)?.id || 0 }
  set roleId (val: number) {
    const role = this.roles.find((e) => e.id === val)
    if (role) {
      this.$store.commit('users/view/user_role', { ...role })
    }
  }

  get projectId (): number { return (this.$store.getters['users/view/user_project'] as Project)?.id || 0 }
  set projectId (val: number) {
    const obj = this.projects.find((e) => e.id === val)
    if (obj) {
      this.$store.commit('users/view/user_project', { ...obj })
    }
  }

  get groupId (): number { return (this.$store.getters['users/view/user_group'] as UserGroup)?.id || 0 }
  set groupId (val: number) {
    const obj = this.groups.find((e) => e.id === val)
    if (obj) {
      this.$store.commit('users/view/user_group', { ...obj })
    }
  }
  // Forms

  get roles (): Role[] { return this.$store.getters['roles/items'] }
  get projects (): Project[] { return this.$store.getters['users/view/user_projects'] }
  get groups (): UserGroup[] { return this.$store.getters['groups/list/items'] as UserGroup[] || [] }

  public mounted () {
    setTimeout(() => (this.isChanged = false), 1000)
  }

  private onChange () {
    this.isChanged = true
  }

  private projectSave () {
    this.conservationProcess = true

    const requestData: Record<string, unknown> = {}

    // Обязательно!
    requestData.first_name = this.firstName
    requestData.last_name = this.lastName
    requestData.middle_name = this.middleName

    // Опционально!
    if (this.roleId) { requestData.role_id = this.roleId }
    if (this.groupId) { requestData.group_id = this.groupId }
    if (this.projectId) { requestData.project_id = this.projectId }

    $axios.patch(`/users/${this.$route.params.id}`, requestData)
      .then((response: AxiosResponse) => {
        if (![200, 204].includes(response.status)) {
          throw new APIError(response.data)
        }

        this.isChanged = false
        this.$toast.success('Changes accepted')
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      }).finally(() => (this.conservationProcess = false))
  }
}
</script>

<style lang="scss" scoped>

.child-mr:not(:first-child):not(:last-child) {
  margin-right: 10px;
}

</style>
