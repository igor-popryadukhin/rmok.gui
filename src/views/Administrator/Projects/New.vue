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
            ref="sOrganizations"
            v-model="organizationSelected"
            :label="$tc('organization')"
            :rules="[rules.notBlank]"
          />
        </v-col>
      </v-row>
    </v-form>

    <!-- Users -->
    <v-row class="mb-5" no-gutters>
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
              <v-divider />
              <v-footer color="white">
                <small class="grey--text">{{ $tc('Click the add button to add the participant to the project.') }}</small>
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
              <v-divider />
              <v-footer color="white">
                <small class="grey--text">{{ $tc('Click the remove button to remove a member from the project.') }}</small>
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

    <v-row no-gutters>
      <v-col
        cols="12"
        class="text-right"
      >
        <v-btn
          text
          tile
          :loading="buttonSave.loading"
          :disabled="buttonSave.disabled"
          @click="onSave"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import Users, { UserInterface } from '@/api/Users'
import { OrganizationInterface } from '@/api/Organizations'
import Projects from '@/api/Projects'
import ProjectStatus from '@/components/ProjectStatus/ProjectStatus.vue'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'

export default Vue.extend({
  components: {
    SOrganizationsAutocomplete,
    ProjectStatus
  },

  mixins: [rules, vueScrollOptions],

  data () {
    return {
      userSearch: {
        q: null as any,
        loading: false,
        count: 0,
        selected: null,
        entries: [] as UserInterface[],
        errorMessages: [] as string[]
      },
      availableMembersCount: 0,
      availableMembers: [] as UserInterface[],
      availableMembersLoading: false,
      members: [] as UserInterface[],
      statuses: [],
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      projectName: '',
      organizationSelected: {} as OrganizationInterface
      /* eslint-enable */
    }
  },

  created () {
    this.$refs.sOrganizations.fetchData()
  },

  watch: {

    // Когда выбрали только выбрали и изменили организацию
    organizationSelected (scope?: OrganizationInterface) {
      if (scope?.id) {
        this.searchAvailableMembers('', scope.id)
      }
    },

    'userSearch.q' (q: string) {
      // Items have already been loaded
      // if (this.users.length > 0) return

      // Items have already been requested
      if (this.userSearch.loading) return

      this.userSearch.errorMessages = []
      if (!('id' in this.organizationSelected)) {
        this.userSearch.errorMessages = [
          this.$tc('To activate the member search box, select an organization')
        ]
        return
      }

      this.userSearch.loading = true

      // Lazily load input items
      new Users()
        .find({
          q,
          roles: 'r_operator',
          organization_id: this.organizationSelected.id
        }).then((response: ResponseInterface<{ count: number }, UserInterface[]>) => {
          this.userSearch.count = response.meta.count
          this.userSearch.entries = response.data
        }).finally(() => (this.userSearch.loading = false))
    }
  },

  computed: {
    users (): UserInterface[] {
      return this.userSearch.entries
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

    onSelectedUser (item: UserInterface) {
      if (this.members.findIndex((member: UserInterface) => member.id === item.id) === -1) {
        this.members.push(item)
        this.userSearch.q = ''
        this.userSearch.selected = null
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

      this.buttonSave.loading = true
      new Projects()
        .add({
          /* eslint-disable */
          name: this.projectName.trim(),
          organization_id: this.organizationSelected.id,
          members: this.members.map((e: UserInterface) => e.id),
          statuses: this.statuses.map((e: any) => {
            return {
              name: e.name,
              color: e.color,
              children: e.children.map((e: any) => e.name)
            }
          })
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('Project added successfully!'))
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    searchAvailableMembers (q: string, organization_id: number) {
      this.availableMembersLoading = true
      this.availableMembers = []
      this.members = []
      new Users()
        .find({
          q,
          organization_id,
          roles: 'r_operator',
          offset: 0,
          count: 500
        }).then((response: ResponseInterface<{ count: number }, UserInterface[]>) => {
          this.availableMembersCount = response.meta.count
          this.availableMembers = response.data
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
