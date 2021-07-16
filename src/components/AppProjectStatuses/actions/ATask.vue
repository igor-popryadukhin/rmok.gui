<template>
  <v-card
    outlined
    tile
    flat
  >
    <v-card-title>Параметры автозадачи</v-card-title>

    <!-- Тип задачи -->
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="2"
          lg="2"
          xl="2"
        >
          <v-combobox
            v-model="dTaskTypeSelection"
            :items="dTaskTypeOptions"
            :label="$tc('Task type')"
          >
            <template v-slot:selection="{ item }">
              {{ $tc(item.charAt(0).toUpperCase() + item.slice(1)) }}
            </template>
            <template v-slot:item="{ item }">
              {{ $tc(item.charAt(0).toUpperCase() + item.slice(1)) }}
            </template>
          </v-combobox>
        </v-col>
        <v-col
          cols="12"
          md="2"
          lg="2"
          xl="2"
        >
          <v-text-field
            v-model="dValue"
            type="number"
            value="1"
          >
            <template v-slot:prepend-inner>
              <span class="grey--text" style="margin-top: 3px; margin-right: 10px">{{ $tc('Across') }}</span>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="2"
          lg="2"
          xl="2"
        >
          <v-select
            v-model="dUnit"
            :items="dUnitOptions"
          >
            <template v-slot:selection="{ item }">
              {{ $tc(item, dValue) }}
            </template>
            <template v-slot:item="{ item }">
              {{ $tc(item, dValue) }}
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- Тип задачи -->

    <v-card-text>
      <v-textarea
        v-model="dDescription"
        :label="$tc('Description')"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

interface IProps {
  [key: string]: any;
}

interface IData {
  dTaskTypeSelection: string;
  dTaskTypeOptions: string[];
  dValue: number;
  dUnit: string;
  dUnitOptions: string[];
  dDescription?: string;
}

interface IMethods {
  onChange: () => void;
}

interface IComputed {
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  created () {
    this.update = false // Не даём испускать события изменения
    if (this.value) {
      this.dTaskTypeSelection = this.value.type
      this.dValue = this.value.value
      this.dUnit = this.value.unit
      this.dDescription = this.value.description
    }
    this.update = true //
  },

  data (): IData {
    return {
      dTaskTypeOptions: ['call', 'task', 'meeting', 'letter', 'other'],
      dDescription: null,
      dTaskTypeSelection: 'call',
      dUnit: 'hour',
      dUnitOptions: ['day', 'hour', 'minute', 'second'],
      dValue: 1,
      update: true
    }
  },

  methods: {
    onChange () {
      if (this.update) {
        this.$emit('change', {
          description: this.dDescription,
          type: this.dTaskTypeSelection,
          unit: this.dUnit,
          value: this.dValue
        })
      }
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'ATask',

  props: {
    value: {
      default: () => null,
      type: Object
    }
  },

  watch: {
    dDescription () {
      this.onChange()
    },

    dTaskTypeSelection () {
      this.onChange()
    },

    dUnit () {
      this.onChange()
    },

    dValue () {
      this.onChange()
    },

    value (val: any) {
      console.log('Change in ATask.vue', val)
    }
  }
})
</script>
