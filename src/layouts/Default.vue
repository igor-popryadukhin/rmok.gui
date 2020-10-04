<template>
  <v-app id="inspire">
    <v-app-bar
      app
      dark
      flat
      elevation="2"
      fixed
      clipped-left
      clipped-right
      extended
      extension-height="35px"
      class="background--header"
    >
      <div class="offset-lg-2 offset-md-2"></div>
      <v-toolbar-title>
        <span class="hidden-sm-and-down">RMOK</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        :label="$t('search')"
        class="mr-4"
        style="max-width: 400px"
      ></v-text-field>
      <v-btn
        icon
        :to="{ name: 'contacts' }"
      >
        <v-icon>mdi-contacts</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-phone-classic</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn
        icon
        :to="{ name: 'help' }"
      >
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar
              size="32px"
              item
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
                alt="Vuetify"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.to"
            @click="item.click || function () { console.log('item click') }"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="offset-lg-2 offset-md-2"></div>
      <template v-slot:extension>
        <v-breadcrumbs
          :items="breadcrumbs"
          class="pa-0 offset-lg-2 col-lg-8 offset-md-2 col-md-8"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              v-if="!item.latest"
              ripple
              :href="item.path"
            >
              <span style="color: white !important;">{{ $t(item.title).toUpperCase() }}</span>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item v-else>
              <span style="color: white !important;">{{ $t(item.title).toUpperCase() }}</span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container
        class="offset-lg-2 col-lg-8 offset-md-2 col-md-8 pl-4 pr-4"
      >
        <vue-scroll :style="{ height: `${$screenHeight - 125}px` }">
          <v-fade-transition hide-on-leave>
            <router-view/>
          </v-fade-transition>
        </vue-scroll>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { CrumbInterface } from '@/Interfaces'

export default Vue.extend({
  props: {
    source: String
  },
  data: () => ({
    settings: {
      suppressScrollY: false,
      suppressScrollX: false,
      wheelPropagation: false
    },
    dialog: false,
    drawer: null,
    items: [
      {
        name: 'profile',
        to: {
          name: 'profile'
        }
      },
      {
        name: 'settings',
        to: {
          name: 'settings'
        }
      },
      {
        name: 'exit',
        click: () => {
          // todo: delete cookie
        }
      }
    ],
    mainMenu: [
      {
        icon: 'mdi-contacts',
        text: 'Contacts',
        to: ''
      }
    ]
  }),

  computed: {
    breadcrumbs (): Array<CrumbInterface> {
      /* eslint-disable */
      const crumbs: Array<CrumbInterface> = []
      if (this.$route.path !== '/') {
        crumbs.push({
          path: '/',
          title: this.$i18n.tc('route.home'),
          class: '',
          latest: false
        })
      }
      // @ts-ignore
      this.$route.matched.map((item: any, i: number, {length}) => {
        const crumb: CrumbInterface = {
          class: '',
          path: '',
          title: '',
          latest: false
        }
        crumb.path = item.path
        // @ts-ignore
        crumb.title = this.$i18n.tc('route.' + (item.name || item.path.replace(/^\//s, '').replace(/\//s, '')))
        // is last item?
        if (i === length - 1) {
          // is param route? .../.../:id
          if (item.regex.keys.length > 0) {
            crumbs.push({
              path: item.path.replace(/\/:[^/:]*$/, ''),
              title: this.$i18n.tc('route.' + item.name.replace(/-[^-/]*$/, '')),
              class: '',
              latest: false
            })
            // @ts-ignore
            crumb.path = this.$route.path
            // @ts-ignore
            crumb.title = this.$i18n.tc('route.' + this.$route.name, [
              // @ts-ignore
              crumb.path.match(/[/]*$/)[0]
            ])
          }
          crumb.class = 'is-active'
        }

        crumb.title = crumb.title.replace(/[/]/, '')
        crumbs.push(crumb)
      })
      if (crumbs.length > 1) {
        crumbs[crumbs.length - 1].latest = true
      }
      return crumbs
      /* eslint-enable */
    }
  }
})
</script>

<style lang="scss">
  .background--header {
    background-image: linear-gradient(to bottom, #1b4685, #3d4899, #6446a9, #8d3eb1, #b729b1);
  }
  .scroll-area {
    position: relative;
    margin: auto;
    width: 600px;
    height: 400px;
  }
</style>
