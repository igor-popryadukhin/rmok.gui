<template>
  <div class="auto-dialer-view-page">
    <v-tabs
      v-model="tab"
      color="primary"
      height="35"
      style="margin-bottom: 5px"
      hide-slider
      show-arrows
      optional
    >
      <v-tab
        v-for="(item, key) in tabs"
        :key="key"
        :to="item.to"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <div class="auto-dialer-view-page__content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import $store from '@/store';
import Component from 'vue-class-component';
import Base from './Base';
import AppLoading from '@/components/AppLoading/AppLoading.vue';

// eslint-disable-next-line no-use-before-define
@Component<AutoDialerView>({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    $store
      .dispatch('autodialer/view/fetch', to.params.id)
      .finally(() => (next()));
  }
})
export default class AutoDialerView extends Base {
  sse: EventSource|null = null

  get height () {
    return this.screenHeight - 115;
  }

  get tab () {
    return this.$route.path;
  }

  set tab (val: string) {
    console.log(val);
  }

  get tabs () {
    return [
      {
        title: 'Общее',
        to: {
          name: 'auto_dialer_view_tab_main'
        }
      },
      {
        title: 'Журнал',
        to: {
          name: 'auto_dialer_view_tab_journal'
        }
      },
      {
        title: 'Телефония',
        to: {
          name: 'auto_dialer_view_tab_telephony'
        }
      },
      {
        title: 'Настройки повторных звонков',
        to: {
          name: 'auto_dialer_view_tab_calls_processing_rules'
        }
      },
      {
        title: 'Операторы',
        to: {
          name: 'auto_dialer_view_tab_operators'
        }
      },
      {
        title: 'Расписание',
        to: {
          name: 'auto_dialer_view_tab_schedule'
        }
      },
      {
        title: 'Контакты',
        to: {
          name: 'auto_dialer_view_tab_contacts'
        }
      }
    ];
  }

  mounted () {
    this.sseOpen();
  }

  beforeDestroy () {
    this.sseClose();
  }

  private sseOpen () {
    if ('VUE_APP_SSE_ENDPOINT' in process.env) {
      const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE_ENDPOINT);

      // Темы для подписок
      url.searchParams.append('topic', `${window.origin}/autodialer/${this.$route.params.id}/messages`);

      this.sse = new EventSource(url, {
        withCredentials: true
      });

      this.sse.addEventListener('autodialer-journal-change', (event: Event) => {
        if (event instanceof MessageEvent) {
          this.$root.$emit('sse:autodialer:journal:change', JSON.parse(event.data));
        }
      });
      this.sse.addEventListener('autodialer:worker:stats', (event: Event) => {
        if (event instanceof MessageEvent) {
          this.$root.$emit('sse:autodialer:worker:stats', JSON.parse(event.data));
        }
      });
      this.sse.addEventListener('autodialer:worker:agents', (event: Event) => {
        if (event instanceof MessageEvent) {
          this.$root.$emit('sse:autodialer:worker:agents', JSON.parse(event.data));
        }
      });
    }
  }

  private sseClose () {
    if (this.sse instanceof EventSource) {
      this.sse.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.auto-dialer-view-page {

}

.auto-dialer-view-page__content {
  height: calc(100vh - 150px);
  overflow: auto;
}
</style>
