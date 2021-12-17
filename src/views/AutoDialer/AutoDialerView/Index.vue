<template>
  <v-sheet>
    <v-tabs
      v-model="tab"
      color="primary"
      optional
      hide-slider
      height="35"
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
      class="pa-2"
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
  loading = true

  get height () {
    return this.screenHeight - 130
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
          name: 'auto_dialer_tab_params'
        }
      },
      {
        title: 'Настройки повторных звонков',
        to: {
          name: 'auto_dialer_tab_repeat_calls_settings'
        }
      },
      {
        title: 'Операторы',
        to: {
          name: 'auto_dialer_tab_operators'
        }
      },
      {
        title: 'Расписание',
        to: {
          name: 'auto_dialer_tab_schedule'
        }
      },
      {
        title: 'Контакты',
        to: {
          name: 'auto_dialer_tab_contacts'
        }
      }
    ]
  }

  mounted () {
    this.$store
      .dispatch('autodialer/view/fetch', this.$route.params.id)
      .finally(() => (this.loading = false))
  }
}
</script>

<style scoped>

</style>
