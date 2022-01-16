<template>
  <v-sheet>
    <v-tabs
      v-model="tab"
      color="primary"
      height="35"
      show-arrows
      optional
      hide-slider
      style="margin-bottom: 5px"
    >
      <v-tab
        v-for="(item, key) in tabs"
        :key="key"
        :to="item.to"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-sheet
      :height="height"
      class="pa-3"
      style="overflow-y: auto"
      outlined
    >
      <div
        v-if="loading"
        class="d-flex fill-height align-center justify-center"
      >
        <app-loading />
      </div>
      <template v-else>
        <keep-alive>
          <router-view />
        </keep-alive>
      </template>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

// eslint-disable-next-line no-use-before-define
@Component<AutoDialerView>({
  components: { AppLoading }
})
export default class AutoDialerView extends Base {
  sse: EventSource|null = null
  loading = true

  get height () {
    return this.screenHeight - 115
  }

  get tab () {
    return this.$route.path
  }

  set tab (val: string) {
    console.log(val)
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
        title: 'Телефония',
        to: {
          name: 'auto_dialer_view_tab_telephony'
        }
      },
      {
        title: 'Настройки повторных звонков',
        to: {
          name: 'auto_dialer_view_tab_repeat_calls_settings'
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
    ]
  }

  mounted () {
    this.$store
      .dispatch('autodialer/view/fetch', this.$route.params.id)
      .finally(() => (this.loading = false))

    this.sseOpen()
  }

  beforeDestroy () {
    this.sseClose()
  }

  private sseOpen () {
    if ('VUE_APP_SSE' in process.env) {
      const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE)

      // Темы для подписок
      url.searchParams.append('topic', `${window.origin}/autodialer/${this.$route.params.id}/messages`)

      this.sse = new EventSource(url, {
        withCredentials: true
      })

      this.sse.addEventListener('autodialer-journal-change', (event: Event) => {
        if (event instanceof MessageEvent) {
          this.$root.$emit('sse-autodialer-journal-change', JSON.parse(event.data))
        }
      })
      this.sse.addEventListener('autodialer-worker-stats', (event: Event) => {
        if (event instanceof MessageEvent) {
          this.$root.$emit('sse-autodialer-worker-stats', JSON.parse(event.data))
        }
      })
    }
  }

  private sseClose () {
    if (this.sse instanceof EventSource) {
      this.sse.close()
    }
  }
}
</script>

<style scoped>

</style>
