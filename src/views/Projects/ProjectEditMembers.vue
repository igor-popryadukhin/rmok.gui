<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Project participants') }}
        </h3>
      </template>
    </app-tools>

    <s-users
      v-model="membersForJoin"
      :label="$tc('Доступные участники')"
      multiple
      outlined
      dense
    />

    <app-tools>
      <template #left>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :loading="processJoin"
          :disabled="membersForJoin.length === 0"
          tile
          outlined
          small
          @click="onAddClick"
        >
          {{ $tc('Add') }}
        </v-btn>
        <v-btn
          :color="$vuetify.theme.currentTheme.secondary"
          tile
          outlined
          small
          @click="membersForJoin.splice(0, membersForJoin.length)"
        >
          {{ $tc('Cancel') }}
        </v-btn>
      </template>
      <template #right>
        <app-pagination
          v-model="queryOffset"
          :count="membersTotal"
          :per-page="membersPerPage"
          :disabled="processLoadingData"
        />
      </template>
    </app-tools>

    <v-divider class="mt-5" />

    <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
      <template v-if="processLoadingData">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            <app-loading />
          </div>
        </div>
      </template>
      <template v-else-if="members.length > 0">
        <v-list>
          <template v-for="(item, key) in members">
            <v-list-item
              :key="'v-list-item-' + key"
              link
              @mouseenter="memberHoverId = item.id | 0"
              @mouseleave="memberHoverId = 0"
            >
              <v-list-item-avatar>
                <v-avatar
                  v-if="item.userpic"
                  class="primary white--text"
                >
                  <v-img :src="item.userpic" />
                  <v-badge
                    v-show="item.online"
                    offset-y="16"
                    offset-x="13"
                    color="#38ff00"
                    dot
                    bordered
                  />
                </v-avatar>
                <v-avatar
                  v-else
                  class="primary white--text"
                >
                  {{ item.abbreviation }}
                </v-avatar>
                <v-badge
                  v-show="item.online"
                  offset-y="16"
                  offset-x="13"
                  color="#38ff00"
                  dot
                  bordered
                />
              </v-list-item-avatar>
              <v-list-item-content class="py-0">
                <v-list-item-title>
                  {{ item.full_name }}
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="item.last_activity_at"
                  :key="`v-list-item-action-text-${item.id}-${tick}`"
                >
                  {{ $dayjs(item.last_activity_at * 1000).fromNow() }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action
                style="margin: 0"
                class="d-flex d-inline-flex"
              >
                <v-btn
                  small
                  text
                  tile
                  @click="onDeleteMemberClick(item, $event)"
                >
                  {{ $tc('To exclude') }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="'v-divider-' + key" />
          </template>
        </v-list>
      </template>
      <template v-else>
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            {{ $tc('Empty') }}
          </div>
        </div>
      </template>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import { UserInterface } from '@/api/Users'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue from 'vue'
import petrovich from 'petrovich'

interface IProps {
  [key: string]: unknown;
}

interface IData {
  membersPerPage: number;
  membersTotal: number;
  membersForJoin: UserInterface[];
  [key: string]: unknown;
}

interface IComputed {
  projectId: number;
  queryOffset: number;
  [key: string]: unknown;
}

interface IMethod {
  fetchProjectMembers: () => void;
  onSave: () => void;
  [key: string]: unknown;
}

export default Vue.extend<IData, IMethod, IComputed, IProps>({
  name: 'ProjectEditMembers',

  components: { AppPagination, AppLoading, AppTools, SUsers },

  data () {
    return {
      tick: 0,
      memberHoverId: 0,
      membersTotal: 0,
      membersPerPage: 50,
      membersPages: 1,
      members: [],
      membersForJoin: [],
      processLoadingData: false,
      processJoin: false
    }
  },

  computed: {
    /** Идентификатор редактируемого проекта */
    projectId (): number {
      return +this.$route.params.project_id
    },

    queryOffset: {
      get () {
        return +this.$route.query?.offset || 0
      },

      set (val: number) {
        this.$routerQuery.setQuery({ offset: val })
      }
    }
  },

  watch: {
    queryOffset () {
      this.fetchProjectMembers()
    }
  },

  mounted () {
    this.fetchProjectMembers()

    setInterval(() => (this.$data.tick++), 10000)
  },

  methods: {
    fetchProjectMembers () {
      this.processLoadingData = true
      new Projects()
        .getMembers(+this.$route.params.project_id, this.queryOffset, this.membersPerPage)
        .then((response) => {
          this.$data.membersTotal = response.meta?.count
          this.$data.members = response.data
        }).finally(() => (this.processLoadingData = false))
    },

    onAddClick () {
      new Projects()
        .addMembers(this.projectId, this.membersForJoin.map((value: UserInterface) => value.id))
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
          this.fetchProjectMembers()
          this.membersForJoin.splice(0, this.membersForJoin.length)
        })
    },

    /**
     * Событие, генерируется при нажатии на кнопку исключения участника из проекта
     *
     * @param item
     */
    onDeleteMemberClick (item: UserInterface) {
      // Креатив 2.0, склоняю по падежам.
      const person = petrovich({
        first: item.first_name,
        last: item.last_name,
        middle: item.last_name
      }, 'accusative')

      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$t('Exclude {user_name} from the project?', { user_name: [person.first, person.last].join(' ') }).toString(),
        showClose: false,
        actions: {
          false: {
            text: this.$tc('Cancel')
          },
          true: {
            text: this.$tc('Yes')
          }
        }
      }).then((result: boolean) => {
        if (result) {
          new Projects()
            .deleteMembers(this.projectId, [item.id])
            .then(() => {
              this.$toast.success(this.$tc('Changes accepted'))
              this.fetchProjectMembers()
            })
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
