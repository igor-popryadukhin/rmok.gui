<template>
  <v-sheet class="projects-view-people">
    <div
      class="projects-view-people__tools d-flex align-center"
    >
      <app-autocomplete
        v-model="availablePeopleSelected"
        :options="filteredPeople"
        :loading="availablePeopleFetching"
        item-text="full_name"
        item-value="id"
        class="mr-2"
        clearable
        multiple
        hide-details
        @search="onSearchPeople"
        @focus="onSearchPeopleFocus"
      >
        <template #selection="{ item, attrs, selected }">
          <v-chip
            v-bind="attrs"
            :input-value="selected"
            color="primary"
            close
            small
            label
            outlined
            @click:close="onPeopleSelectedRemove(item)"
          >
            <v-avatar
              size="16"
              left
            >
              <v-img
                sizes="16,24,48,64,128"
                :src="item.userpic || '/images/default-avatar.jpg'"
              />
            </v-avatar>
            {{ item.full_name }}
          </v-chip>
        </template>
      </app-autocomplete>
      <v-btn
        :loading="processAdd"
        height="40"
        text
        tile
        @click="onBtnAddPeopleClick"
      >
        {{ $tc('Add') }}
      </v-btn>
    </div>
    <div
      v-if="fetching && items.length === 0"
      class="d-flex align-center justify-center fill-height"
    >
      <app-loading />
    </div>
    <div
      v-else-if="items.length === 0"
      class="d-flex align-center justify-center fill-height"
    >
      {{ $tc('Empty') }}
    </div>
    <div
      v-else
      class="projects-view-people__box"
    >
      <div class="projects-view-people__list">
        <v-list dense>
          <template v-for="(item, itemKey) in items">
            <v-list-item :key="`v-list-item-${itemKey}`">
              <v-list-item-avatar>
                <v-img :src="item.userpic || '/images/default-avatar.jpg'">
                  <v-badge
                    v-show="item.online"
                    offset-y="16"
                    offset-x="13"
                    color="#38ff00"
                    dot
                    bordered
                  />
                </v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.full_name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  tile
                  text
                  ripple
                  small
                  @click="onBtnExcludePeople(item)"
                >
                  {{ $tc('To exclude') }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="`v-divider-${itemKey}`" />
          </template>
        </v-list>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import User from '@/api/interfaces/User'
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'
import debounce from '@/utils/debounce'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'
import petrovich from 'petrovich'

// eslint-disable-next-line no-use-before-define
@Component<ProjectsViewPeople>({
  components: { AppPaginator, AppAutocomplete, AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.items.length === 0) {
        vm.$store.dispatch('projects/view/people/fetch')
      }
    })
  }
})
export default class ProjectsViewPeople extends AppBase {
  filteredPeople: User[] = []
  availablePeople: User[] = []
  availablePeopleSelected = []
  availablePeopleFetching = false
  processAdd = false

  get fetching (): boolean { return this.$store.getters['projects/view/people/fetching'] }
  get items (): User[] { return this.$store.getters['projects/view/people/items'] }
  get items_count () { return this.$store.getters['projects/view/people/items_count'] }

  public created () {
    this.onSearchPeople = debounce(this.onSearchPeople, 350)
  }

  private onBtnExcludePeople (item: User) {
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
        this.$axios.delete(`/projects/${this.$route.params.id}/members/${item.id}`)
          .then((response: AxiosResponse) => {
            if (response.status !== 200) {
              throw new Error('Failed')
            }
            this.$toast.success('Changes accepted')
            this.$store.dispatch('projects/view/people/fetch')
          })
      }
    })
  }

  private onBtnAddPeopleClick () {
    this.processAdd = true
    this.$axios
      .post(`/projects/${this.$route.params.id}/members`, this.availablePeopleSelected)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error')
        }
        this.$toast.success('Changes accepted')
        this.availablePeopleSelected = []
        this.$store.dispatch('projects/view/people/fetch')
      })
      .finally(() => (this.processAdd = false))
  }

  private onSearchPeople (q: string) {
    if (q) {
      this.filteredPeople = this.availablePeople
        .filter((e) => e.full_name.indexOf(q) > -1)
    } else {
      this.filteredPeople = this.availablePeople
    }

    if (this.filteredPeople.length === 0) {
      this.availablePeopleFetching = true
      this.$axios
        .get('/users', { params: { q } })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Error')
          }

          (response.data?.data as User[] || [])
            .forEach((people) => {
              if (this.availablePeople.findIndex((e) => e.id === people.id) === -1) {
                this.availablePeople.push(people)
              }
            })

          if (this.filteredPeople.length === 0) {
            this.filteredPeople = this.availablePeople
          }
        })
        .finally(() => (this.availablePeopleFetching = false))
    }
  }

  private onSearchPeopleFocus () {
    if (this.availablePeople.length === 0) {
      this.onSearchPeople('')
    }
  }

  private onPeopleSelectedRemove (item: User) {
    const index = this.availablePeopleSelected.findIndex((id) => id === item.id)
    if (index > -1) {
      this.availablePeopleSelected.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-view-people { height: 100% }

.projects-view-people__tools {
  height: 60px;
  margin-bottom: 2px;
}

.projects-view-people__box {
  height: 100%;
}

.projects-view-people__list {
  height: calc(100% - 70px);
  height: -moz-calc(100% - 70px);
  height: -webkit-calc(100% - 70px);
  overflow: auto;
}
</style>
