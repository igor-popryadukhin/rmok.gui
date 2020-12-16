<template>
  <v-row class="ma-0">
    <v-col
      cols="12"
    >
      <vuescroll
        :ops="vueScrollOptions"
        :style="{ height: `${$screenHeight - 250}px` }"
        style="width: 100%"
      >
        <template v-if="tasks.length > 0">
          <v-list>
            <template
              v-for="item in organizations"
            >
              <v-divider
                :key="`divider-${item.id}`"
              />
              <v-list-item
                :key="`list-item-${item.id}`"
                ripple
                selectable
                link
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.sphere_activity }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-group>
                  <v-list-item-subtitle v-if="item.responsible">
                    {{ item.responsible.first_name }} {{ item.responsible.last_name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $tc('feckless') }}
                  </v-list-item-subtitle>
                </v-list-item-group>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        v-bind="attrs"
                        v-on.stop="on"
                      >
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        :to="{ name: 'administrator_organizations_edit', params: { id: item.id } }"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Редактировать</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                        @click.stop="onDeleteItem(item.id)"
                        disabled
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Удалить</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </template>
        <template v-else-if="tasksProcessLoading">
          <v-list-item class="text-center">
            <v-spacer />
            <span class="grey--text">
                {{ $tc('Loading content...') }}
              </span>
            <v-spacer />
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item class="text-center">
            <v-spacer />
            <span class="grey--text">
                {{ $tc('organizations_list_empty') }}
              </span>
            <v-spacer />
          </v-list-item>
        </template>
      </vuescroll>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import vuescroll from 'vuescroll'
import vueScrollOptions from '@/mixins/vueScrollOptions'

export default Vue.extend({

  mixins: [vueScrollOptions],

  components: {
    vuescroll
  },

  data () {
    return {
      tasksProcessLoading: false,
      tasks: []
    }
  }
})
</script>

<style lang="scss" scoped>
  .border {
    border-left: 2px #b729b1 solid;
    margin-left: 5px;
  }
</style>
