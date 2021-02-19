<template>
  <v-container fluid>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.first_name"
            :label="$tc('first_name')"
            persistent-hint
            required
            :rules="[rules.notBlank]"
          >
            <template v-slot:prepend>
              <v-avatar
                size="60"
                class="mr-4 primary white--text"
                style="font-size: 20px"
              >
                {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
              </v-avatar>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.last_name"
            :label="$tc('last_name')"
            persistent-hint
            required
            :rules="[rules.notBlank]"
          >
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.middle_name"
            :label="$tc('middle_name')"
            :rules="[]"
            persistent-hint
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            v-model="user.login"
            :label="$tc('Login')"
            :rules="[rules.notBlank]"
            autocomplete="new-login"
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-account-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            ref="password1"
            v-model="user.password"
            :label="$tc('Password')"
            :type="passwordShow ? 'text' : 'password'"
            :rules="[rules.lengthMinOrZero(6)]"
            autocomplete="new-password"
            required
          >
            <template v-slot:append>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-text-field
            ref="password2"
            v-model="user.password2"
            :label="$tc('Password')"
            :type="passwordShow ? '' : 'password'"
            :rules="[rules.lengthMinOrZero(6)]"
            autocomplete="new-password"
            required
          >
            <template v-slot:append>
              <v-btn
                v-if="passwordShow"
                icon
                small
                @click="passwordShow = false"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                icon
                @click="passwordShow = true"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="4"
        >
          <v-text-field
            v-model="user.email"
            :label="$tc('email')"
            :rules="[rules.email]"
            autocomplete="new-email"
          >
            <template
              v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
              v-slot:prepend
            >
              <v-icon class="pl-5 pr-9">mdi-email</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="4"
        >
          <v-text-field
            v-model="user.phone"
            :label="$tc('phone')"
            type="tel"
            :rules="[rules.phone_number]"
            required
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <!-- Роль -->
          <v-row>
            <v-col>
              <s-roles
                v-model="user.role"
                :label="$tc('Role')"
                visible-icon
                :value="user.role ? user.role : null"
                :rules="[rules.notBlank]"
              />
            </v-col>
          </v-row>

          <!-- Организация -->
          <v-row>
            <v-col>
              <s-organizations-autocomplete
                ref="sOrganizations"
                v-model="user.organization"
                :label="$tc('organization')"
                :disabled="assertObjectHasAttribute(user.organization, 'id')"
                visible-icon
              />
            </v-col>
          </v-row>

          <!-- Группа -->
          <v-row>
            <v-col>
              <s-groups
                ref="sGroups"
                v-model="user.group"
                :label="$tc('Group')"
                visible-icon
                :disabled="!assertObjectHasAttribute(user.organization, 'id')"
                :params="sGroupsParams"
              >
              </s-groups>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <v-row>
            <v-col>
              <s-projects-autocomplete
                :label="$tc('Available projects')"
                @select="onAvailableProjectSelect"
              />
              <v-list v-if="user.projects.length > 0">
                <template
                  v-for="(item, index) in user.projects"
                >
                  <v-list-item
                    :key="`v-list-item-${index}`"
                    link
                    dense
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        text
                        small
                        @click.stop="user.projects.splice(index, 1)"
                      >{{ $tc('Delete') }}</v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`v-divider-${index}`" />
                </template>
              </v-list>
              <div
                v-else
                class="d-flex justify-center align-center"
              >
                <div>{{ $tc('User has no projects') }}</div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Сохранить -->
      <v-row>
        <v-col
          cols="12"
          class="d-flex"
        >
          <v-spacer />
          <v-btn
            v-bind="buttonSave"
            color="primary"
            :disabled="!isChanged"
            text
            tile
            outlined
            @click="onSave"
          >
            {{ $tc('Save') }}
          </v-btn>
        </v-col>
      </v-row>

      <div class="pa-16"/>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import { UserInterface, Users } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import { GroupInterface } from '@/api/Groups'
import SRoles from '@/snippets/SRoles/SRoles.vue'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import { RoleInterface } from '@/api/Roles'
import { ProjectInterface } from '@/api/Projects'
import VInterface from '@/VInterface'
import { isEmpty } from '@/Utils'

interface IRefs {
  sGroups: any,
  sOrganizations: any,
  sProjectsAutocomplete: any,
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRefs;
}

let oldUser: any = {} // Снимок данных для сравнения объектов

export default (Vue as VueConstructor<VInnerInterface>).extend({
  mixins: [rules],

  components: {
    SProjectsAutocomplete,
    SOrganizationsAutocomplete,
    SGroups,
    SRoles
  },

  data (): IData {
    return {
      isChanged: false,
      permissions: [],
      tab: 0,
      passwordShow: false,
      buttonDelete: {
        disabled: false,
        loading: false
      },
      buttonSave: {
        disabled: false,
        loading: false
      },

      user: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        login: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        role: {} as unknown as RoleInterface,
        group: {} as unknown as GroupInterface,
        organization: {} as unknown as OrganizationInterface,
        project: {} as unknown as ProjectInterface,
        projects: [] as ProjectInterface[]
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    new Users()
      .getById(+to.params.user_id, {
        fields: 'projects,organization,role,group'
      })
      .then((response: UserInterface) => {
        next(async (vm: VInnerInterface) => {
          const promises: Promise<any>[] = []

          vm.user.id = response.id
          vm.user.first_name = response.first_name
          vm.user.last_name = response.last_name
          vm.user.middle_name = response.middle_name
          vm.user.email = response.email
          vm.user.login = response.login
          vm.user.phone = response.phone
          vm.user.role = response.role
          vm.user.projects = response.projects

          if (vm.assertObjectHasAttribute(response.group, 'id')) {
            promises.push(vm.$refs.sGroups.setDefault(response.group?.id))
          }

          if (vm.assertObjectHasAttribute(response.organization, 'id')) {
            promises.push(vm.$refs.sOrganizations.setDefault(response.organization?.id))
          }

          // Делаем снимок, данных после выполнения всех обещаний
          await Promise.all(promises).finally(() => (oldUser = JSON.stringify(vm.user)))
        })
      })
  },

  watch: {
    user: {
      handler (newData: any) {
        if (JSON.stringify(newData) === oldUser) {
          this.isChanged = false
        } else {
          this.isChanged = true
        }
      },
      deep: true
    },

    tab (val: number) {
      switch (val) {
        case 3: {
          this.$router.push({ name: 'administrator_users_edit_permissions' })
          break
        }
        default: this.$router.push({ name: 'administrator_users_edit', params: this.$route.params })
      }
    }
  },

  computed: {
    sGroupsParams () {
      const params: any = {}

      if (this.assertObjectHasAttribute(this.user.organization, 'id')) {
        params.organization_id = this.user.organization.id
      }

      return params
    },

    sProjectsParams () {
      const params: any = {}

      if (this.assertObjectHasAttribute(this.user.organization, 'id')) {
        params.organization_id = this.user.organization.id
      }

      return params
    }
  },

  methods: {
    onSave () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.buttonSave.loading = true

      // Данные запроса
      const request: any = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        middle_name: this.user.middle_name,
        login: this.user.login,
        role_id: this.user.role?.id
      }

      if (this.user.email) {
        request.email = this.user.email
      }

      if (this.user.phone) {
        request.phone = this.user.phone
      }

      if (this.assertObjectHasAttribute(this.user.project, 'id')) {
        request.project_id = this.user.project.id
      }

      if (this.assertObjectHasAttribute(this.user.organization, 'id')) {
        request.organization_id = this.user.organization.id
      }

      if (this.assertObjectHasAttribute(this.user.group, 'id')) {
        request.group_id = this.user.group.id
      }

      if (this.user.password === this.user.password2 && !isEmpty(this.user.password)) {
        request.password = this.user.password
      }

      // Проекты в которых пользователь будет учавствовать
      if (this.user.projects.length > 0) {
        request.projects = this.user.projects.map((e: ProjectInterface) => e.id)
      } else {
        request.projects = []
      }

      this.buttonSave.loading = true
      new Users()
        .update(+this.$route.params.user_id, request)
        .then(() => {
          oldUser = Object.assign({}, this.user)
          this.isChanged = false
          this.$toast.success(this.$tc('User updated successfully'))
        }).catch((e) => {
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              for (const error of e.errors) {
                this.$toast.error(error.message)
              }
            }
          }
          this.$toast.error(e.error)
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    onAvailableProjectSelect (project: ProjectInterface) {
      if (this.user.projects.findIndex((e: ProjectInterface) => e.id === project.id) === -1) {
        this.user.projects.push(project)
      }
    },

    onBtnDeleteClick () {
      // todo: Реализовать удаление
    }
  }
})
</script>

<style scoped>

</style>
