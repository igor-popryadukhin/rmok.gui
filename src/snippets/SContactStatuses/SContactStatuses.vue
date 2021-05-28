<template>
  <div :style="styleWrapper">
    <v-divider />
    <v-tabs
      v-model="tabStatus"
      height="35"
    >
      <v-tab>
        {{ $tc('All') }}
      </v-tab>
      <v-tab
        v-for="(group, groupIndex) in statuses"
        :key="groupIndex"
      >
        <span :style="{ color: group.color }">{{ group.name }}</span>
      </v-tab>
      <v-spacer />
      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            color="red"
            tile
            text
            @click="$emit('on-close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('Close') }}</span>
      </v-tooltip>
    </v-tabs>
    <v-divider />
    <v-tabs-items
      v-model="tabStatus"
    >
      <v-tab-item>
        <v-container class="px-5" fluid>
          <v-radio-group
            column
          >
            <v-row
              v-for="(status, statusIndex) in statuses"
              :key="`v-row-status-${statusIndex}`"
              justify="start"
              align="start"
            >
              <v-col
                v-for="(item, statusIndex) in status.children"
                :key="`v-col-status-${statusIndex}`"
                cols="4"
                class="pa-0 mb-1"
              >
                <v-radio
                  :key="`v-radio-${statusIndex}`"
                  :color="status.color"
                  :id="`v-radio-${item.id}`"
                  @change="onRadioChange(item)"
                >
                  <template v-slot:label>
                    <span :style="{ color: status.color }">{{ item.name }}</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-container>
      </v-tab-item>
      <v-tab-item
        v-for="(tabItem, tabIndex) in statuses"
        :key="`tab-item-status-${tabIndex}`"
      >
        <v-container class="px-5" fluid>
          <v-radio-group
            :key="`v-radio-group-${tabIndex}`"
            column
          >
            <v-row>
              <v-col
                v-for="(status, statusIndex) in tabItem.children"
                :key="`status-${statusIndex}`"
                cols="4"
              >
                <v-radio
                  :label="status.name"
                  :color="tabItem.color"
                  :id="`v-radio-${status.id}`"
                  @change="onRadioChange(status)"
                ></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { StatusInterface } from '@/api/Database'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  components: {},

  computed: {
    ...mapGetters({
      project_current: 'project/current'
    }),

    statuses () {
      return this.project_current?.statuses || []
    },

    styleWrapper () {
      return {
        height: `${this.height}px`,
        'min-height': `${this.minHeight}px`
      }
    }
  },

  data () {
    return {
      currentStatus: {} as unknown & StatusInterface,
      tab: null,
      tabStatus: 0
    }
  },

  methods: {
    onRadioChange (status: any) {
      this.$data.currentStatus = status
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  mounted () {
    this.$watch('currentStatus', (val: any) => {
      this.$emit('change', val.id)
    })
  },

  props: {
    height: {
      default: 250,
      type: [Number, String]
    },

    minHeight: {
      default: 250,
      type: [Number, String]
    },

    value: {
      default: null,
      type: Number
    }
  }
})
</script>

<style scoped>

</style>
