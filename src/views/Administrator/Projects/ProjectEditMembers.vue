<template>
  <v-sheet>

    <s-users
      v-model="membersForJoin"
      :label="$tc('Доступные участники')"
      multiple
      outlined
      dense
    />

    <app-tools>
      <template v-slot:left>
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
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.first_name }} {{ item.last_name }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action
                v-if="memberHoverId === item.id"
                style="margin: 0"
                class="d-flex d-inline-flex"
              >
                <v-btn
                  small
                  text
                  tile
                  @click="onDeleteMemberClick(item)"
                >
                  {{ $tc('To exclude') }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="'v-divider-' + key"/>
          </template>
        </v-list>
        <v-btn
          text
          block
        >
          Загрузить ещё
        </v-btn>
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
import AppTools from '@/components/AppTools/AppTools.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue from 'vue'
import petrovich from 'petrovich'

interface IProps {
  [key: string]: unknown;
}

interface IData {
  [key: string]: unknown;
}

interface IComputed {
  [key: string]: unknown;
}

interface IMethod {
  [key: string]: unknown;
}

export default Vue.extend<IData, IMethod, IComputed, IProps>({
  name: 'ProjectEditMembers',

  components: { AppLoading, AppTools, SUsers },

  data () {
    return {
      memberHoverId: 0,
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
    /** Смещение для выборки подмножеств */
    queryOffset: {
      get () {
        return +this.$route.query?.offset || 0
      },

      set (val: number) {
        this.$routerQuery.setQuery({ offset: val })
      }
    }
  },

  mounted () {
    this.fetchProjectMembers()
  },

  methods: {
    fetchProjectMembers () {
      this.processLoadingData = true
      new Projects()
        .getMembers(+this.$route.params.project_id, this.queryOffset, 50)
        .then((response) => {
          this.$data.members = response
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
     * Событие, генерируется при изменении нажатии на кнопку исключения участника из проекта
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
