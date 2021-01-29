<template>
  <div>
    <v-form
      ref="form"
      lazy-validation
    >
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

      <!-- Organizations -->
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="6"
        >
          <s-organizations-autocomplete
            ref="sOrganizationsAutocomplete"
            v-model="organizationSelected"
            :label="$tc('organization')"
            :rules="[rules.notBlank]"
            disabled
          />
        </v-col>
      </v-row>
    </v-form>

    <!-- Users -->
    <v-row class="mb-5">
      <v-col
        cols="12"
      >
        <h3>{{ $tc('Project participants') }}</h3>
        <v-row>
          <v-col cols="6">
            <v-card
              height="400"
              class="overflow-y-auto v-card"
              outlined
            >
              <v-card-subtitle>
                {{ $tc('Available members') }}
              </v-card-subtitle>
              <v-card-text class="v-card__text">
                <div>
                  <template v-if="availableMembers.length > 0">
                    <v-list>
                      <template v-for="(item, index) in availableMembers">
                        <v-divider :key="`v-divider-${index}`"/>
                        <v-list-item
                          :key="`v-list-item-${index}`"
                        >
                          <v-list-item-avatar
                            size="30"
                            color="indigo"
                            class="headline font-weight-light white--text"
                          >
                            {{ item.first_name.charAt(0) }}
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
                </div>
              </v-card-text>
              <v-divider/>
              <v-footer color="white">
                <small class="grey--text">{{
                    $tc('Click the add button to add the participant to the project.')
                  }}</small>
              </v-footer>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              height="400"
              class="overflow-y-auto v-card"
              outlined
            >
              <v-card-subtitle>
                {{ $tc('Project members') }}
              </v-card-subtitle>
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
                          {{ item.first_name.charAt(0) }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            icon
                            small
                            @click="memberToLeft(item)"
                          >
                            <v-icon color="red lighten-1">mdi-close</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-list>
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
                    $tc('Click the remove button to remove a member from the project.')
                  }}</small>
              </v-footer>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Statuses -->
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <h3 class="mb-3">Статусы звонков</h3>
        <project-status v-model="statuses"/>
      </v-col>
    </v-row>

    <v-row class="mb-16">
      <v-col
        cols="12"
      >
        <div class="d-flex">
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
        </div>
      </v-col>
    </v-row>

    <div class="pa-16"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import Users, { UserInterface } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import Projects, { ProjectInterface, ProjectMemberInterface } from '@/api/Projects'
import ProjectStatus from '@/components/ProjectStatus/ProjectStatus.vue'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import ErrorInterface from '@/api/Schemas/ErrorInterface'
import statusActions from '@/mixins/statusActions'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'

export default Vue.extend({
  components: {
    SOrganizationsAutocomplete,
    ProjectStatus
  },

  mixins: [rules, vueScrollOptions, statusActions],

  data () {
    return {
      availableMembersCount: 0,
      availableMembers: [] as UserInterface[],
      availableMembersLoading: false,
      members: [] as ProjectMemberInterface[] | UserInterface[],
      statuses: [] as any[],
      buttonSave: {
        disabled: false,
        loading: false
      },
      buttonDelete: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      projectName: '',
      organizationName: '',
      organizationSelected: {} as OrganizationInterface
      /* eslint-enable */
    }
  },

  beforeRouteEnter (to, from, next) {
    new Projects()
      .getById(+to.params.project_id)
      .then((response: ProjectInterface) => {
        next(vm => {
          vm.projectName = response.name
          vm.members = response.members
          vm.statuses = response.statuses
          vm.organizationName = response.organization.name

          vm.$refs.sOrganizationsAutocomplete.setDefault(response.organization.id)
          vm.searchAvailableMembers('', response.organization.id) // Загрузить доступных участников
        })
      })
  },

  methods: {

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
      const index = this.availableMembers.findIndex((member: UserInterface | ProjectMemberInterface) => member.id === item.id)
      if (index === -1) {
        this.availableMembers.push(item)
        const index = this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id)
        if (index > -1) {
          this.members.splice(index, 1)
        }
      }
    },

    onSelectedUser (item: UserInterface) {
      if (this.members.findIndex((member: ProjectMemberInterface) => member.id === item.id) === -1) {
        this.members.push(item)
      }
    },

    onBtnSaveClick () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      if (this.members.length === 0) {
        return this.$toast.warning(this.$tc('The project requires one or more participants', 1))
      }

      this.buttonSave.loading = true
      new Projects()
        .update(+this.$route.params.project_id, {
          /* eslint-disable */
          name: this.projectName.trim(),
          organization_id: this.$route.params.project_id,
          members: this.members.map((e: ProjectMemberInterface) => e.id),
          statuses: this.statuses.map((e: any) => {
            return {
              id: e.id,
              name: e.name,
              color: e.color,
              children: e.children.map((e: any) => ({id: e.id, name: e.name}))
            }
          })
          /* eslint-enable */
        }).then(() => {
          this.$toast.success(this.$tc('Project updated successfully!'))
        }).catch((e: ErrorInterface | any) => {
          if ('errors' in e) {
            if (Array.isArray(e.errors)) {
              e.errors.forEach((e) => {
                switch (e.property_name) {
                  case '[members]': {
                    this.$toast.warning('Как минимум один участник проекта обязан присутствовать!')
                    break
                  }
                }
              })
            }
          } else {
            this.$toast.error(e.statusText || e.error_message || e || 'undefined')
          }
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
              return new Promise((resolve) => {
                new Projects()
                  .delete(+this.$route.params.project_id)
                  .then(() => {
                    this.$toast.success(this.$tc('Project successfully deleted!'))
                    this.$router.back()
                  }).catch((e: any) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('group_delete_error', { cause }), { icon: true })
                  }).finally()

                resolve()
              })
            }
          }
        }
      })
    },

    searchAvailableMembers (q: string, organization_id: number) {
      this.availableMembersLoading = true
      this.availableMembers = []
      new Users()
        .find({
          q,
          organization_id,
          roles: 'r_operator',
          offset: 0,
          count: 500
        }).then((response: ResponseInterface<{ count: number }, UserInterface[]>) => {
          this.availableMembersCount = response.meta.count

          // Фильтрую участников, для того чтобы в списке доступных, не было текущих участников
          this.availableMembers = response.data.filter(function (element: UserInterface) {
            return this.members.findIndex((member: ProjectMemberInterface) => member.id === element.id) === -1
          }, this)
        }).finally(() => (this.availableMembersLoading = false))
    }
  }
})
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
