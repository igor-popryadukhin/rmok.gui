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
            <v-card-text class="pb-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                >
                  <v-text-field
                    v-model="projectName"
                    :label="$tc('Project name')"
                    persistent-hint
                    required
                    :rules="[rules.notBlank]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text
              v-if="$permission.isSuperAdmin"
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
                    v-model="organizationSelected"
                    :label="$tc('Organization')"
                    :rules="[rules.notBlank]"
                    clearable
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
            xl="6"
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
            class="py-0 pl-md-0 pl-lg-0 pl-xl-0"
            cols="12"
            md="6"
            lg="6"
            xl="6"
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

    <!-- Statuses -->
    <v-row>
      <v-col
        class="py-0"
        cols="12"
      >
        <v-card tile outlined flat>
          <v-card-title class="grey--text">
            Статусы звонков
          </v-card-title>
          <v-card-text>
            <project-status v-model="statuses"/>
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
              text
              tile
              :loading="buttonSave.loading"
              :disabled="buttonSave.disabled"
              @click="onSave"
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
import Projects from '@/api/Projects'
import ProjectStatus from '@/components/ProjectStatus/ProjectStatus.vue'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import VInterface from '@/VInterface'
import { debounce } from 'vuetify/src/util/helpers'
import APIError from '@/api/classes/APIError'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import { StatusInterface } from '@/components/ProjectStatus/Interfaces'

interface IData {
  organizationSelected: any,
  projectName: string;
  availableQ: string;
  availableMembersCount: number;
  availableMembers: UserInterface[];
  availableMembersLoading: boolean;
  members: UserInterface[];
  statuses: any[];
  buttonSave: any;
}

export default (Vue as VueConstructor<VInterface>).extend({
  components: {
    SOrganizationsAutocomplete,
    ProjectStatus
  },

  mixins: [rules, vueScrollOptions],

  data (): IData {
    return {
      organizationSelected: null,
      availableQ: '',
      availableMembersCount: 0,
      availableMembers: [] as UserInterface[],
      availableMembersLoading: false,
      members: [],
      statuses: [],
      buttonSave: {
        disabled: false,
        loading: false
      },
      projectName: '' as string
    }
  },

  watch: {
    'availableQ' (q: string) {
      findAvailableUsers({ q }, this)
    }
  },

  created () {
    findAvailableUsers({ roles: 'r_operator' }, this)
  },

  mounted () {
    if (this.$permission.isSuperAdmin) {
      if (this.assertObjectHasAttribute(this.$refs, 'sOrganizationsAutocomplete')) {
        this.$refs.sOrganizationsAutocomplete.fetchData()
      }
    }
  },

  methods: {

    memberToRight (item: UserInterface) {
      const index = this.members.findIndex((member: UserInterface) => member.id === item.id)
      if (index === -1) {
        this.members.push(item)
        const availableMemberIndex = this.availableMembers.findIndex((member: UserInterface) => member.id === item.id)
        if (availableMemberIndex > -1) {
          this.availableMembers.splice(availableMemberIndex, 1)
        }
      }
    },

    memberToLeft (item: UserInterface) {
      const index = this.availableMembers.findIndex((member: UserInterface) => member.id === item.id)
      if (index === -1) {
        this.availableMembers.push(item)
        const index = this.members.findIndex((member: UserInterface) => member.id === item.id)
        if (index > -1) {
          this.members.splice(index, 1)
        }
      }
    },

    resetForm () {
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      if (this.members.length === 0) {
        return this.$toast.warning(this.$tc('The project requires one or more participants', 1))
      }

      const requestData: any = {
        name: this.projectName,
        members: this.members.map((e: UserInterface) => e.id),
        statuses: this.statuses.map((e: any) => {
          return {
            name: e.name,
            color: e.color,
            children: e.children.map((e: StatusInterface) => {
              return {
                name: e.name,
                actions: e.actions
              }
            })
          }
        })
      }

      if (this.assertObjectHasAttribute(this.organizationSelected, 'id')) {
        requestData.organization_id = this.organizationSelected.id
      }

      this.buttonSave.loading = true
      new Projects()
        .add(requestData)
        .then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('Project added successfully!'))
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
    }
  }
})

// Поиск доступных участников
const findAvailableUsers = debounce((params = {}, ctx: VInterface) => {
  ctx.$data.availableMembersLoading = true
  new Users()
    .find<{ count: number }, UserInterface[]>(params)
    .then((response) => {
      ctx.$data.availableMembersCount = response.meta.count
      ctx.$data.availableMembers = response.data
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
