<template>
  <v-sheet>
    <v-tabs
      v-model="tab"
      class="mb-5"
      height="35"
    >
      <v-tab
        v-for="(tab, tabKey) in tabs"
        v-bind="tab.attrs"
        :key="tabKey"
      >
        {{ $tc(tab.title) }}
      </v-tab>
    </v-tabs>

    <div>
      <keep-alive exclude="ProjectEditMain">
        <router-view />
      </keep-alive>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { GroupInterface } from '@/api/Groups'
import Projects, { ProjectMemberInterface } from '@/api/Projects'
import Users, { UserInterface } from '@/api/Users'
import { StatusInterface } from '@/components/ProjectStatus/Interfaces'
import rules from '@/mixins/rules'
import statusActions from '@/mixins/statusActions'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

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
  scenario: string;
  buttonSave: any;
  buttonDelete: any;
}

interface VInnerInterface extends VInterface {
  $refs: IRefs;
  $data: IData;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({

  components: {
    // AppWysiwyg,
    // ProjectStatus
  },

  // beforeRouteEnter (to, from, next) {
  //   new Projects()
  //     .getById(+to.params.project_id)
  //     .then((response: ProjectInterface) => {
  //       to.meta.route_breadcrumb_name = response.name
  //       next((vm: VInnerInterface) => {
  //         // Проверяю наличие ссылки на компонент, её может не быть
  //         if (vm.assertObjectHasAttribute(vm.$refs, 'sOrganizationsAutocomplete')) {
  //           if (vm.assertObjectHasAttribute(response.organization, 'id')) {
  //             vm.$refs.sOrganizationsAutocomplete.setDefault(response.organization?.id)
  //           }
  //         }
  //
  //         vm.$data.projectName = response.name
  //         vm.$data.members = response.members || []
  //         vm.$data.statuses = response?.statuses || []
  //         vm.$data.scenario = response?.scenario || ''
  //         vm.$data.users_groups = response.users_groups || []
  //       })
  //     })
  // },

  created () {
    findAvailableUsers({}, this)
  },

  data (): IData {
    return {
      tab: null,
      availableMembers: [] as UserInterface[],
      availableMembersCount: 0,
      availableMembersLoading: false,
      availableQ: '',
      buttonDelete: {
        disabled: false,
        loading: false
      },
      buttonSave: {
        disabled: false,
        loading: false
      },
      members: [],
      organizationSelected: null,
      projectName: '',
      statuses: [],
      users_groups: [],
      scenario: ''
    }
  },

  computed: {
    tabs () {
      return [
        {
          title: 'Main information',
          attrs: {
            to: {
              name: 'administrator_projects_main'
            }
          }
        },
        {
          title: 'Project members',
          attrs: {
            to: {
              name: 'administrator_projects_members'
            }
          }
        },
        {
          title: 'Statuses',
          attrs: {
            to: {
              name: 'administrator_projects_statuses'
            }
          }
        }
      ]
    }
  },

  methods: {

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

    onBtnDeleteClick () {
      this.$dialog.confirm({
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            handler: () => {
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
            },
            text: this.$tc('yes')
          }
        },
        text: this.$tc('All information about the project, history of interaction, will be deleted permanently.'),
        title: this.$tc('Deleting a project')
      })
    },

    /**
     * Происходит, когда нажали на кнопку "Сохранить"
     **/
    onBtnSaveClick () {
      if (this.members.length === 0) {
        return this.$toast.warning(this.$tc('The project requires one or more participants', 1))
      }

      this.buttonSave.loading = true
      new Projects()
        .update(+this.$route.params.project_id, {
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
          }),
          scenario: this.$refs.wysiwyg.getContent()
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

    /**
     * Срабатывает когда пользователь выбрал найденный эелемент в выпадающем списке поиска групп.
     **/
    onGroupAutocompleteSelected (obj: GroupInterface) {
      if (this.users_groups.findIndex((e: GroupInterface) => e.id === obj.id) === -1) {
        this.users_groups.push(obj)
      }
    },

    onSelectedUser (item: UserInterface) {
      if (this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id) === -1) {
        this.members.push(item)
      }
    },

    /**
     * Срабатывает когда пользователь кликнул по кнопке удалить в списке "Группы пользователей"
     **/
    onUsersGroupsDeleteClick (obj: GroupInterface) {
      const index: number = this.users_groups.findIndex((e: GroupInterface) => e.id === obj.id)
      if (index > -1) {
        this.users_groups.splice(index, 1)
      }
    }
  },

  mixins: [rules, vueScrollOptions, statusActions],

  watch: {
    'availableQ' (q: string) {
      findAvailableUsers({ q }, this)
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
