<template>
  <v-container fluid>
    <v-row class="mb-5 mt-5" no-gutters>
      <v-col class="pt-0 pb-0">
        <div class="d-flex">
          <v-router-combo-box
            parent-route-name="team_leader_reports"
          >
            <template v-slot:item="scope">
              <v-list-item
                v-on="scope.on"
                :to="scope.item"
              >
                {{ scope.item.name }}
              </v-list-item>
            </template>
          </v-router-combo-box>
          <v-spacer />
          <v-btn-toggle
            v-model="filterRange"
            dense
          >
            <v-btn>
              {{ $tc('Today') }}
            </v-btn>

            <v-btn>
              {{ $tc('Yesterday') }}
            </v-btn>

            <v-btn>
              {{ $tc('This week') }}
            </v-btn>

            <v-btn>
              {{ $tc('Last week') }}
            </v-btn>

            <v-btn>
              {{ $tc('January | February | March | April | May | June | July | August | September | October | December', new Date().getMonth() - 1) }}
            </v-btn>

            <v-btn>
              {{ $tc('Range') }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
    </v-row>
    <v-row class="mb-5" no-gutters>
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  :label="$tc('Users')"
                  dense
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  :label="$tc('Tags')"
                  dense
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mb-5" no-gutters>
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
                lg="6"
              >
                <div
                  class="d-flex flex-column fill-height"
                >
                  <v-spacer />
                  <div class="mb-5">
                    <h4 class="mb-2 font-weight-medium">Всего сделано звонков</h4>
                    <div style="font-size: 2rem">4 735</div>
                  </div>
                  <div class="mb-5">
                    <h4 class="mb-2 font-weight-medium">Всего клиентов прозвонено</h4>
                    <div style="font-size: 2rem">1 975</div>
                  </div>
                  <v-spacer />
                  <div>
                    На диаграмме представлены результаты последних звонков каждому клиенту
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="6"
              >
                <v-card-text class="d-flex">
                  <v-spacer />
                  <apexchart
                    width="500"
                    type="donut"
                    :options="options"
                    :series="series"
                  />
                </v-card-text>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mb-5" no-gutters>
      <v-col>
        <!-- Сортировка -->
        <div>
          <v-btn-toggle
            v-model="filterRange"
            dense
          >
            <v-btn>
              {{ $tc('Date time') }}
            </v-btn>

            <v-btn>
              {{ $tc('Client') }}
            </v-btn>

            <v-btn>
              {{ $tc('Result') }}
            </v-btn>

            <v-btn>
              {{ $tc('Comment') }}
            </v-btn>

            <v-btn>
              {{ $tc('Call duration') }}
            </v-btn>

            <v-btn>
              {{ $tc('Manager') }}
            </v-btn>
          </v-btn-toggle>
        </div>
        <small class="grey--text">Варианты фильтрации</small>

        <!-- Контакты -->
        <v-list two-line>
          <v-list-item-group
            v-model="selected"
            active-class="pink--text"
            multiple
          >
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="item.headline"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.action"></v-list-item-action-text>

                    <v-icon
                      v-if="!active"
                      color="grey lighten-1"
                    >
                      mdi-star-outline
                    </v-icon>

                    <v-icon
                      v-else
                      color="yellow darken-3"
                    >
                      mdi-star
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <div style="height: 200px"></div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import VueApexCharts from 'vue-apexcharts'
import VRouterComboBox from '@/components/VRouterCombobox/VRouterComboBox.vue'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default Vue.extend({

  components: {
    VRouterComboBox
  },

  data () {
    return {
      filterRange: null,
      options: {
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
      },
      series: [50, 10, 10, 30],
      items: [
        {
          action: '5 min',
          headline: 'Brunch this weekend?',
          subtitle: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
          title: 'Ali Connors'
        },
        {
          action: '2 hr',
          headline: 'Summer BBQ',
          subtitle: 'Wish I could come, but I\'m out of town this weekend.',
          title: 'me, Scrott, Jennifer'
        },
        {
          action: '6 hr',
          headline: 'Oui oui',
          subtitle: 'Do you have Paris recommendations? Have you ever been?',
          title: 'Sandra Adams'
        },
        {
          action: '12 hr',
          headline: 'Birthday gift',
          subtitle: 'Have any ideas about what we should get Heidi for her birthday?',
          title: 'Trevor Hansen'
        },
        {
          action: '18hr',
          headline: 'Recipe to try',
          subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
          title: 'Britta Holt'
        }
      ]
    }
  }
})
</script>

<style scoped>

</style>
