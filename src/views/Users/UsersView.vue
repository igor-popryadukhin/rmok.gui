<template>
  <div style="height: calc(100vh - 145px)">
    <div
      class="d-flex flex-nowrap grow"
      style="height: 35px"
    >
      <v-tabs
        height="35"
        hide-slider
        show-arrows
      >
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab
            :key="`v-tab-${tabIndex}`"
            :to="tab.to"
          >
            {{ tab.title }}
          </v-tab>
          <v-divider
            v-if="tabIndex < tabs.length -1"
            :key="`v-divider-${tabIndex}`"
            vertical
          />
        </template>
      </v-tabs>
    </div>

    <app-divider class="my-1" />

    <div class="overflow-auto fill-height">
      <template v-if="fetching">
        <div class="d-flex align-center justify-center fill-height">
          <app-loading />
        </div>
      </template>
      <template v-else>
        <keep-alive>
          <router-view />
        </keep-alive>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import Component from 'vue-class-component';

// eslint-disable-next-line no-use-before-define
@Component<ProjectsView>({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('users/view/fetch');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('users/view/flush');
    this.$store.dispatch('users/view/sessions/flush');
    next();
  }
})
export default class ProjectsView extends AppBase {
  get getThisPageHeight () { return this.screenHeight - 118; }
  get fetching () { return this.$store.getters['users/view/fetching']; }
  get tabs () {
    return [
      {
        title: 'Основная информация',
        to: {
          name: 'users_view_main'
        }
      },
      {
        title: 'График работы',
        to: {
          name: 'users_view_schedule'
        }
      },
      {
        title: 'Телефония',
        to: {
          name: 'users_view_telephony'
        }
      },
      {
        title: 'Контакты',
        to: {
          name: 'users_view_contacts'
        }
      },
      {
        title: 'Сессии',
        to: {
          name: 'users_view_sessions'
        }
      }
    ];
  }

  public beforeDestroy () {
    this.$store.dispatch('users/view/flush');
  }
}
</script>

<style scoped>

</style>
