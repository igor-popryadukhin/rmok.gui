<template>
  <div
    class="mt-5 mx-auto"
    style="max-width: 500px"
  >
    <div class="mb-5">
      <v-text-field
        v-model="firstName"
        :label="$tc('First name')"
        clearable
        dense
        outlined
        flat
        @input="onChange"
      />

      <v-text-field
        v-model="lastName"
        :label="$tc('Last name')"
        clearable
        dense
        outlined
        flat
        @input="onChange"
      />

      <v-text-field
        v-model="middleName"
        :label="$tc('Middle name')"
        clearable
        dense
        outlined
        flat
        @input="onChange"
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
        @input="onChange"
      />

      <v-text-field
        v-model="password"
        :label="$tc('Password')"
        :type="passwordVisible ? 'text' : 'password'"
        prepend-inner-icon="mdi-form-textbox-password"
        autocomplete="new-password"
        dense
        outlined
        flat
        @input="onChange"
      >
        <template #append>
          <v-btn
            v-if="form.password"
            v-clipboard="() => form.password"
            icon
            small
            @click="$toast.info('Password copied to clipboard')"
            @mousedown="passwordVisible = false"
          >
            <v-icon small>
              mdi-content-copy
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="generatePassword"
          >
            <v-icon small>
              mdi-auto-fix
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="passwordVisible = !passwordVisible"
          >
            <v-icon
              v-if="passwordVisible"
              small
            >
              mdi-eye-outline
            </v-icon>
            <v-icon
              v-else
              small
            >
              mdi-eye-off-outline
            </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="mb-5">
      <smart-autocomplete
        v-model="groups"
        :label="$tc('Groups')"
        :api-query="(q) => { return { q } }"
        :items="groups"
        api-end-point="/groups"
        item-text="name"
        item-value="id"
        response-property="data"
        store-module-name="groups"
        return-object
        multiple
        clearable
        @input="onChange"
      />

      <v-select
        v-model="role"
        :label="$tc('Role')"
        :items="roles"
        item-text="title"
        item-value="value"
        dense
        outlined
        flat
        @input="onChange"
      />

      <v-select
        v-model="projectId"
        :label="$tc('Current project')"
        :items="projects"
        item-text="name"
        item-value="id"
        dense
        outlined
        flat
        @input="onChange"
      />
    </div>

    <v-divider class="mb-2" />

    <div class="mb-5">
      <v-btn
        :loading="savingProcess"
        :disabled="!isChanged"
        tile
        text
        outlined
        @click="onBtnSaveClick"
      >
        {{ $tc('Save change') }}
      </v-btn>
    </div>

    <div class="mb-16" />
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Project from '@/api/interfaces/Project'
import UserGroup from '@/api/interfaces/UserGroup'
import AppBase from '@/AppBase'
import { $axios } from '@/plugins/axios'
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import { generatePassword } from '@/utils/utils'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<UsersViewMain>({
  components: { SmartAutocomplete }
})
export default class UsersViewMain extends AppBase {
  savingProcess = false
  isChanged = false
  passwordVisible = false

  form = {
    first_name: undefined,
    last_name: undefined,
    middle_name: undefined,
    login: undefined,
    password: undefined,
    role: undefined,
    project_id: undefined,
    group_ids: undefined
  }

  get firstName () {
    return this.$store.getters['users/view/user_first_name']
  }

  set firstName (value: string) {
    this.form.first_name = value
  }

  get lastName () {
    return this.$store.getters['users/view/user_last_name']
  }

  set lastName (value: string) {
    this.form.last_name = value
  }

  get middleName () {
    return this.$store.getters['users/view/user_middle_name']
  }

  set middleName (value: string) {
    this.form.middle_name = value
  }

  get login () {
    return this.$store.getters['users/view/user_login']
  }

  set login (value: string) {
    this.form.login = value
  }

  get password () {
    return this.form.password
  }

  set password (value: string) {
    this.form.password = value
  }

  get role () {
    return this.$store.getters['users/view/user_role']?.main_role || null
  }

  set role (value: string) {
    this.form.role = value
  }

  get projectId (): number {
    return (this.$store.getters['users/view/user_project'] as Project)?.id || 0
  }

  set projectId (value: number) {
    this.form.project_id = value
  }

  get groups (): UserGroup[] {
    return this.$store.getters['users/view/user_groups']
  }

  set groups (val: UserGroup[]) {
    this.form.group_ids = val.map((e) => e.id)
  }

  // Справочники
  get roles () {
    return [
      {
        title: 'Администратор',
        value: 'ROLE_ADMIN'
      },
      {
        title: 'Руководитель колл-центра',
        value: 'ROLE_CCM'
      },
      {
        title: 'Руководитель группы',
        value: 'ROLE_TEAM_LEADER'
      },
      {
        title: 'Оператор',
        value: 'ROLE_OPERATOR'
      }
    ]
  }

  get projects (): Project[] {
    return this.$store.getters['users/view/user_projects']
  }

  public mounted () {
    setTimeout(() => (this.isChanged = false), 1000)
  }

  private onChange () {
    this.isChanged = true
  }

  /**
   * Срабатывает при нажатии на кнопку сохранить
   * @private
   */
  private onBtnSaveClick () {
    this.savingProcess = true
    $axios.patch(`/users/${this.$route.params.id}`, {
      ...(typeof this.form.first_name === 'string' ? { first_name: this.form.first_name.trim() } : {}),
      ...(typeof this.form.last_name === 'string' ? { last_name: this.form.last_name.trim() } : {}),
      ...(typeof this.form.middle_name === 'string' ? { middle_name: this.form.middle_name.trim() } : {}),
      ...(this.form.password ? { password: this.form.password.trim() } : {}),
      ...(this.form.role ? { role: this.form.role } : {}),
      ...(this.form.project_id ? { project_id: this.form.project_id } : {}),
      ...(Array.isArray(this.form.group_ids) ? { group_ids: this.form.group_ids } : {})
    }).then((response: AxiosResponse) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data)
      }

      this.formReset()

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
    }).finally(() => (this.savingProcess = false))
  }

  private formReset () {
    this.form.first_name = undefined
    this.form.last_name = undefined
    this.form.middle_name = undefined
    this.form.login = undefined
    this.form.password = undefined
    this.form.role = undefined
    this.form.project_id = undefined
    this.form.group_ids = undefined
  }

  private generatePassword () {
    this.passwordVisible = true
    this.password = generatePassword(8)
    this.isChanged = true
  }
}
</script>

<style lang="scss" scoped>
</style>
