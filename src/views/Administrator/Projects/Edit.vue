<template>
  <div>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col
          class="py-0"
          cols="12"
        >
          <v-card flat outlined tile>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                >
                  <v-text-field
                    v-model="projectName"
                    :label="$tc('project_name')"
                    persistent-hint
                    required
                    :rules="[rules.notBlank]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text
              v-if="$store.getters['profile/role_is_admin']"
              class="pt-0"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                >
                  <s-organizations-autocomplete
                    ref="sOrganizationsAutocomplete"
                    :label="$tc('Organization')"
                    disabled
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <!-- Users -->
    <v-row>
      <v-col class="py-0">
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
          >
            <v-card
              height="500"
              class="overflow-y-auto v-card"
              outlined
              tile
            >
              <v-card-title class="grey--text">
                {{ $tc('Available members') }}
              </v-card-title>
              <v-card-actions class="px-4">
                <v-text-field
                  v-model="availableQ"
                  :label="$tc('Search')"
                  autocomplete="off"
                  hide-details
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon>mdi-account-search</v-icon>
                  </template>
                </v-text-field>
              </v-card-actions>
              <v-card-text class="v-card__text">
                <template v-if="availableMembers.length > 0">
                  <v-list>
                    <template v-for="(item, index) in availableMembers">
                      <v-divider :key="`v-divider-${index}`"/>
                      <v-list-item
                        :key="`v-list-item-${index}`"
                        link
                      >
                        <v-list-item-avatar
                          size="30"
                          color="indigo"
                          class="headline font-weight-light white--text"
                        >
                          {{ (item.first_name || '-').charAt(0) }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            text
                            small
                            @click="memberToRight(item)"
                          >
                            {{ $tc('Add') }}
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-list>
                </template>
                <template v-else-if="availableMembersLoading && availableMembers.length === 0">
                  <div class="d-flex pa-0" style="height: 250px">
                    <v-row
                      class="fill-height"
                      align-content="center"
                      justify="center"
                      no-gutters
                    >
                      <v-col
                        class="subtitle-1 text-center"
                        cols="12"
                      >
                        {{ $tc('Getting available members') }}
                      </v-col>
                      <v-col cols="9">
                        <v-progress-linear
                          color="deep-purple accent-4"
                          indeterminate
                          rounded
                          height="6"
                        ></v-progress-linear>
                      </v-col>
                    </v-row>
                  </div>
                </template>
                <template v-else>
                  <div class="d-flex pa-0" style="height: 250px">
                    <v-row
                      class="fill-height"
                      align-content="center"
                      justify="center"
                      no-gutters
                    >
                      <v-col
                        class="subtitle-1 text-center"
                        cols="12"
                      >
                        {{ $tc('Empty') }}
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-card-text>
              <v-divider/>
              <v-footer color="white">
                <small class="grey--text">{{
                    $tc('Click the add button to add the participant to the project.')
                  }}</small>
              </v-footer>
            </v-card>
          </v-col>
          <v-col
            class="pl-md-0 pl-lg-0 pl-xl-0"
            cols="12"
            md="6"
            lg="6"
          >
            <v-card
              height="100%"
              class="overflow-y-auto v-card"
              style="min-height: 500px"
              outlined
              tile
            >
              <v-card-title class="grey--text">
                {{ $tc('Project members') }}
              </v-card-title>
              <v-card-text class="v-card__text">
                <template v-if="members.length > 0">
                  <v-list>
                    <template v-for="(item, index) in members">
                      <v-divider :key="`v-divider-${index}`"/>
                      <v-list-item
                        :key="`v-list-item-${index}`"
                      >
                        <v-list-item-avatar
                          size="30"
                          color="indigo"
                          class="headline font-weight-light white--text"
                        >
                          {{ (item.first_name || '-').charAt(0) }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            text
                            small
                            @click="memberToLeft(item)"
                          >
                            {{ $tc('Delete') }}
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-list>
                </template>
                <template v-else>
                  <div class="d-flex pa-0" style="height: 100%">
                    <v-row
                      class="fill-height"
                      align-content="center"
                      justify="center"
                      no-gutters
                    >
                      <v-col
                        class="subtitle-1 text-center"
                        cols="12"
                      >
                        {{ $tc('Empty') }}
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-card-text>
              <v-divider/>
              <v-footer color="white">
                <small class="grey--text">{{
                    $tc('Click the remove button to remove a member from the project.')
                  }}</small>
              </v-footer>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        class="py-0"
        cols="6"
      >
        <v-card
          style="min-height: 250px; max-height: 350px"
          tile
          outlined
          flat
        >
          <v-card-title class="grey--text">
            {{ $tc('Groups of users') }}
          </v-card-title>
          <v-card-actions class="px-4">
            <s-groups
              ref="sGroupsAutocomplete"
              :label="$tc('Search')"
              icon-name="mdi-magnify"
              visible-icon
              inner-icon
              dense
              v-on:selected="onGroupAutocompleteSelected"
            />
          </v-card-actions>
          <v-card-text class="v-card__text">
            <template v-if="users_groups.length > 0">
              <v-list>
                <template v-for="(item, index) in users_groups">
                  <v-divider :key="`v-divider-${index}`"/>
                  <v-list-item
                    :key="`v-list-item-${index}`"
                    dense
                    link
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        text
                        small
                        @click.stop="onUsersGroupsDeleteClick(item)"
                      >
                        {{ $tc('Delete') }}
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list>
            </template>
            <template v-else>
              <div class="d-flex pa-0">
                <v-row
                  class="fill-height"
                  align-content="center"
                  justify="center"
                  no-gutters
                >
                  <v-col
                    class="subtitle-1 text-center"
                    cols="12"
                  >
                    {{ $tc('Empty') }}
                  </v-col>
                </v-row>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        class="py-0 pl-md-0 pl-lg-0 pl-xl-0"
        cols="6"
      >
        <v-card
          height="100%"
          outlined
          flat
          tile
        >
          <v-card-title class="grey--text">
            {{ $tc('Groups of users') }}
          </v-card-title>
          <v-card-text>
            ***
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statuses -->
    <v-row>
      <v-col
        class=""
        cols="12"
      >
        <v-card tile outlined flat>
          <v-card-title class="grey--text">
            Статусы звонков
          </v-card-title>
          <v-card-text>
            <project-status v-model="statuses" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <v-card tile outlined flat>
          <v-card-text class="d-flex">
            <v-spacer/>
            <v-btn
              color="red"
              :loading="buttonDelete.loading"
              :disabled="buttonDelete.disabled"
              class="mr-2"
              tile
              outlined
              @click="onBtnDeleteClick"
            >
              {{ $tc('Delete') }}
            </v-btn>
            <v-btn
              text
              tile
              :loading="buttonSave.loading"
              :disabled="buttonSave.disabled"
              @click="onBtnSaveClick"
            >
              {{ $tc('Save') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="pa-16"/>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import Users, { UserInterface } from '@/api/Users'
import Projects, { ProjectInterface, ProjectMemberInterface } from '@/api/Projects'
import ProjectStatus from '@/components/ProjectStatus/ProjectStatus.vue'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import statusActions from '@/mixins/statusActions'
import VInterface from '@/VInterface'
import { debounce } from 'vuetify/src/util/helpers'
import APIError from '@/api/classes/APIError'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import { GroupInterface } from '@/api/Groups'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import { StatusInterface } from '@/components/ProjectStatus/Interfaces'

interface IRefs {
  [key: string]: any;
}

interface IData {
  organizationSelected: any;
  projectName: string;
  availableQ: string;
  availableMembersCount: number;
  availableMembers: UserInterface[];
  availableMembersLoading: boolean;
  members: ProjectMemberInterface[];
  users_groups: GroupInterface[];
  statuses: any[];
  buttonSave: any;
  buttonDelete: any;
}

interface VInnerInterface extends VInterface {
  $refs: IRefs;
  $data: IData;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SOrganizationsAutocomplete,
    SGroups,
    ProjectStatus
  },

  mixins: [rules, vueScrollOptions, statusActions],

  data (): IData {
    return {
      organizationSelected: null,
      availableQ: '',
      availableMembersCount: 0,
      availableMembers: [] as UserInterface[],
      availableMembersLoading: false,
      members: [],
      users_groups: [],
      statuses: [],
      buttonSave: {
        disabled: false,
        loading: false
      },
      buttonDelete: {
        disabled: false,
        loading: false
      },
      projectName: ''
    }
  },

  watch: {
    'availableQ' (q: string) {
      findAvailableUsers({ q, roles: 'r_operator' }, this)
    }
  },

  beforeRouteEnter (to, from, next) {
    new Projects()
      .getById(+to.params.project_id)
      .then((response: ProjectInterface) => {
        to.meta.route_breadcrumb_name = response.name
        next((vm: VInnerInterface) => {
          // Проверяю наличие ссылки на компонент, её может не быть
          if (vm.assertObjectHasAttribute(vm.$refs, 'sOrganizationsAutocomplete')) {
            if (vm.assertObjectHasAttribute(response.organization, 'id')) {
              vm.$refs.sOrganizationsAutocomplete.setDefault(response.organization?.id)
            }
          }

          vm.$data.projectName = response.name
          vm.$data.members = response.members || []
          vm.$data.statuses = response.statuses || []
          vm.$data.users_groups = response.users_groups || []
        })
      })
  },

  created () {
    findAvailableUsers({ roles: 'r_operator' }, this)
  },

  methods: {

    /**
     * Срабатывает когда пользователь кликнул по кнопке удалить в списке "Группы пользователей"
     **/
    onUsersGroupsDeleteClick (obj: GroupInterface) {
      const index: number = this.users_groups.findIndex((e: GroupInterface) => e.id === obj.id)
      if (index > -1) {
        this.users_groups.splice(index, 1)
      }
    },

    /**
     * Срабатывает когда пользователь выбрал найденный эелемент в выпадающем списке поиска групп.
     **/
    onGroupAutocompleteSelected (obj: GroupInterface) {
      if (this.users_groups.findIndex((e: GroupInterface) => e.id === obj.id) === -1) {
        this.users_groups.push(obj)
      }
    },

    memberToRight (item: UserInterface) {
      const index = this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id)
      if (index === -1) {
        this.members.push(item)
        const availableMemberIndex = this.availableMembers.findIndex((member: UserInterface | ProjectMemberInterface) => member.id === item.id)
        if (availableMemberIndex > -1) {
          this.availableMembers.splice(availableMemberIndex, 1)
        }
      }
    },

    memberToLeft (item: UserInterface) {
      const availableMemberIndex = this.availableMembers.findIndex((member: UserInterface | ProjectMemberInterface) => member.id === item.id)
      if (availableMemberIndex === -1) {
        this.availableMembers.push(item)
      }
      const memberIndex = this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id)
      if (memberIndex > -1) {
        this.members.splice(memberIndex, 1)
      }
    },

    onSelectedUser (item: UserInterface) {
      if (this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id) === -1) {
        this.members.push(item)
      }
    },

    /**
     * Происходит, когда нажали на кнопку "Сохранить"
     **/
    onBtnSaveClick () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      if (this.members.length === 0) {
        return this.$toast.warning(this.$tc('The project requires one or more participants', 1))
      }

      this.buttonSave.loading = true
      new Projects()
        .update<{ name: string; members: number[]; statuses: any[] }>(+this.$route.params.project_id, {
          /* eslint-disable */
          name: this.projectName,
          members: this.members.map((e: ProjectMemberInterface) => e.id),
          statuses: this.statuses.map((e: any) => {
            return {
              id: e.id,
              name: e.name,
              color: e.color,
              children: e.children.map((e: StatusInterface) => ({
                id: e.id,
                name: e.name,
                actions: e.actions
              }))
            }
          })
          /* eslint-enable */
        }).then(() => {
          this.$toast.success(this.$tc('Project updated successfully!'))
        }).catch((e: APIError) => {
          if (Array.isArray(e.errors)) {
            e.errors.forEach((e) => {
              this.$toast.error(e.message)
            })
          }
          this.$toast.error(e.message)
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    onBtnDeleteClick () {
      this.$dialog.confirm({
        title: this.$tc('Deleting a project'),
        text: this.$tc('All information about the project, history of interaction, will be deleted permanently.'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise<void>((resolve) => {
                new Projects()
                  .delete(+this.$route.params.project_id)
                  .then(() => {
                    this.$toast.success(this.$tc('Project successfully deleted!'))
                    this.$router.back()
                  }).catch((e: APIError) => {
                    this.$toast.error(e.message)
                  })
                resolve()
              })
            }
          }
        }
      })
    }
  }
})

// Поиск доступных участников
const findAvailableUsers = debounce((params = {}, ctx: VInterface) => {
  ctx.$data.availableMembersLoading = true
  new Users()
    .find<{ count: number }, UserInterface[]>(params)
    .then((response) => {
      ctx.availableMembersCount = response.meta.count
      ctx.availableMembers = response.data
    }).finally(() => (ctx.$data.availableMembersLoading = false))
}, 400)
</script>

<style scoped>
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}

.empty-list {
  height: 50px;
  width: 100%;
  background-color: #f5f3f5;
}
</style>
