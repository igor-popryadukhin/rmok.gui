<template>
  <v-sheet>
    <v-text-field
      v-model="debugNamespace"
      clearable
      outlined
    />

    <v-list>
      <template v-for="(item, key) in infoItems">
        <v-list-item
          :key="key"
          dense
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`v-divider-${key}`" />
      </template>
    </v-list>
  </v-sheet>
</template>

<script lang="ts">
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue';
import Component from 'vue-class-component';
import Base from './Base';
import { Watch } from 'vue-property-decorator';
import * as Bowser from 'bowser';
@Component({
  components: { SmartAutocomplete }
})
export default class AutoDialerView extends Base {
  get infoItems () {
    const browser = Bowser.parse(window.navigator.userAgent);
    return [
      {
        title: 'Browser',
        value: `${browser.browser.name} ${browser.browser.version}`
      },
      {
        title: 'OS',
        value: `${browser.os.name} ${browser.os.version}`
      },
      {
        title: 'Platform',
        value: [
          browser.platform.type,
          browser.platform.vendor,
          browser.platform.model
        ].filter((e) => e).join(', ')
      },
      {
        title: 'Engine',
        value: [
          browser.engine.name,
          browser.engine.version
        ].filter((e) => e).join(' ')
      },
      {
        title: 'Unique identifier for the tab',
        value: sessionStorage.tabID || '-'
      },
      {
        title: 'WS',
        value: this.$monitoring.connected ? 'Connected' : 'Disconnected'
      }
    ];
  }

  get debugNamespace () {
    return window.localStorage.getItem('debug');
  }

  set debugNamespace (val: string) {
    window.localStorage.setItem('debug', val);
  }

  @Watch('debugNamespace')
  debugNamespaceWatch (val: string) {
    if (!val) {
      window.localStorage.removeItem('debug');
    }
  }
}
</script>

<style scoped>

</style>
