<template>
  <v-sheet class="projects-view-members">
    <div
      class="projects-view-members__tools d-flex align-center"
    >
      <app-autocomplete
        v-model="availableMembersSelected"
        :options="filteredMembers"
        :loading="availableMembersFetching"
        item-text="full_name"
        item-value="id"
        class="mr-2"
        clearable
        multiple
        hide-details
        @search="onSearchMembers"
        @focus="onSearchMembersFocus"
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
            @click:close="onMembersSelectedRemove(item)"
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
        @click="onBtnAddMembersClick"
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
      class="projects-view-members__box"
    >
      <div class="projects-view-members__list">
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
                  @click="onBtnExcludeMembers(item)"
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
import User from '@/api/interfaces/User';
import AppBase from '@/AppBase';
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppPaginator from '@/components/AppPagination/AppPaginator.vue';
import debounce from '@/utils/debounce';
import { AxiosResponse } from 'axios';
import Component from 'vue-class-component';
import petrovich from 'petrovich';

// eslint-disable-next-line no-use-before-define
@Component<ProjectsViewMembers>({
  components: { AppPaginator, AppAutocomplete, AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.items.length === 0) {
        vm.$store.dispatch('projects/view/members/fetch');
      }
    });
  }
})
export default class ProjectsViewMembers extends AppBase {
  filteredMembers: User[] = []
  availableMembers: User[] = []
  availableMembersSelected = []
  availableMembersFetching = false
  processAdd = false

  get fetching (): boolean { return this.$store.getters['projects/view/members/fetching']; }
  get items (): User[] { return this.$store.getters['projects/view/members/items']; }
  get items_count () { return this.$store.getters['projects/view/members/items_count']; }

  public created () {
    this.onSearchMembers = debounce(this.onSearchMembers, 350);
  }

  private onBtnExcludeMembers (item: User) {
    const person = petrovich({
      first: item.first_name,
      last: item.last_name,
      middle: item.last_name
    }, 'accusative');

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
              throw new Error('Failed');
            }
            this.$toast.success('Changes accepted');
            this.$store.dispatch('projects/view/members/fetch');
          });
      }
    });
  }

  private onBtnAddMembersClick () {
    this.processAdd = true;
    this.$axios
      .post(`/projects/${this.$route.params.id}/members`, this.availableMembersSelected)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error');
        }
        this.$toast.success('Changes accepted');
        this.availableMembersSelected = [];
        this.$store.dispatch('projects/view/members/fetch');
      })
      .finally(() => (this.processAdd = false));
  }

  private onSearchMembers (q: string) {
    if (q) {
      this.filteredMembers = this.availableMembers
        .filter((e) => e.full_name.indexOf(q) > -1);
    } else {
      this.filteredMembers = this.availableMembers;
    }

    if (this.filteredMembers.length === 0) {
      this.availableMembersFetching = true;
      this.$axios
        .get('/users', { params: { q } })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Error');
          }

          (response.data?.data as User[] || [])
            .forEach((member) => {
              if (this.availableMembers.findIndex((e) => e.id === member.id) === -1) {
                this.availableMembers.push(member);
              }
            });

          if (this.filteredMembers.length === 0) {
            this.filteredMembers = this.availableMembers;
          }
        })
        .finally(() => (this.availableMembersFetching = false));
    }
  }

  private onSearchMembersFocus () {
    if (this.availableMembers.length === 0) {
      this.onSearchMembers('');
    }
  }

  private onMembersSelectedRemove (item: User) {
    const index = this.availableMembersSelected.findIndex((id) => id === item.id);
    if (index > -1) {
      this.availableMembersSelected.splice(index, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-view-members { height: 100% }

.projects-view-members__tools {
  height: 60px;
  margin-bottom: 2px;
}

.projects-view-members__box {
  height: 100%;
}

.projects-view-members__list {
  height: calc(100% - 70px);
  height: -moz-calc(100% - 70px);
  height: -webkit-calc(100% - 70px);
  overflow: auto;
}
</style>
