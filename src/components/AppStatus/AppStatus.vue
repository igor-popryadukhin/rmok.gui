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
        v-for="(group, groupIndex) in options"
        :key="groupIndex"
      >
        <span :style="{ color: group.color }">{{ group.name }}</span>
      </v-tab>
      <v-spacer />
      <v-tooltip
        bottom
        max-width="400"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="red"
            tile
            text
            v-on="on"
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
        <v-container
          class="px-5"
          fluid
        >
          <v-radio-group
            column
          >
            <v-row
              v-for="(status, statusIndex) in options"
              :key="`v-row-status-${statusIndex}`"
              justify="start"
              align="start"
            >
              <v-col
                v-for="(item, statusChildIndex) in status.children"
                :key="`v-col-status-${statusChildIndex}`"
                cols="4"
                class="pa-0 mb-1"
              >
                <v-radio
                  :id="`v-radio-${item.id}`"
                  :key="`v-radio-${statusIndex}`"
                  :color="status.color"
                  @change="onRadioChange(item)"
                >
                  <template #label>
                    <span :style="{ color: status.color }">{{ item.name }}</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-container>
      </v-tab-item>
      <v-tab-item
        v-for="(tabItem, tabIndex) in options"
        :key="`tab-item-status-${tabIndex}`"
      >
        <v-container
          class="px-5"
          fluid
        >
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
                  :id="`v-radio-${status.id}`"
                  :label="status.name"
                  :color="tabItem.color"
                  @change="onRadioChange(status)"
                />
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

export default Vue.extend({
  name: 'AppStatus',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    minHeight: {
      default: 250,
      type: [Number, String]
    },

    options: {
      type: Array,
      default: () => []
    },

    value: {
      default: null,
      type: Number
    }
  },

  data () {
    return {
      currentStatus: {} as unknown & StatusInterface,
      tab: null,
      tabStatus: 0
    }
  },

  computed: {
    styleWrapper () {
      return {
        'min-height': `${this.minHeight}px`
      }
    }
  },

  mounted () {
    // todo: implements
  },

  methods: {
    onRadioChange (status: any) {
      this.$emit('change', status.id)
    }
  }
})
</script>

<style scoped>

</style>
