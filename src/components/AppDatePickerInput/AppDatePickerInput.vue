<template>
  <v-menu
    ref="menu"
    v-model="menuShow"
    :close-on-content-click="false"
    :return-value.sync="datePickerValue"
    transition="scale-transition"
    min-width="290px"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        v-on="on"
        :label="label"
        :value="dateDecoration"
        prepend-inner-icon="mdi-calendar"
        readonly
        outlined
        dense
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="datePickerValue"
      :range="dateRange"
      locale="ru"
      first-day-of-week="1"
      scrollable
      no-title
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="red"
        @click="onDatePickerClear"
      >
        {{ $tc('Clear') }}
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="onSave(datePickerValue)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface IData {
  datePickerValue?: string | string[] | null
  [key: string]: any;
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

interface IProps{
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  computed: {
    dateDecoration () {
      if (Array.isArray(this.datePickerValue)) {
        // Выходим
        if (this.datePickerValue.length < 2) {
          return ''
        }

        return this.datePickerValue.join(' ~ ')
      } else {
        return this.datePickerValue
      }
    }
  },

  created () {
    this.initialize(this.value)
  },

  data () {
    return {
      date: null,
      datePickerValue: null,
      menuShow: false
    }
  },

  methods: {
    initialize (val: string | string[] | number | number[] | Date | Date[]) {
      if (!val) {
        return
      }

      if (Array.isArray(val)) {
        if (val.length < 2) {
          return
        }

        this.datePickerValue = val.map((val: string | number | Date) => {
          if (val instanceof Date) {
            return val.toISOString().substr(0, 10)
          } else if (Number.isInteger(val)) {
            return new Date(+val * 1000).toISOString().substr(0, 10)
          } else {
            return new Date(val).toISOString().substr(0, 10)
          }
        }).sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime()
        })
      } else {
        if (val instanceof Date) {
          this.datePickerValue = val.toISOString().substr(0, 10)
        } else if (Number.isInteger(val)) {
          this.datePickerValue = new Date(+val * 1000).toISOString().substr(0, 10)
        } else {
          this.datePickerValue = new Date(val).toISOString().substr(0, 10)
        }
      }
    },

    onDatePickerClear () {
      if (this.dateRange) {
        this.datePickerValue = []
      } else {
        this.datePickerValue = null
      }

      this.$refs.menu.save(this.datePickerValue)
      this.$emit('change', this.datePickerValue)
    },

    onSave (val: string | string[]) {
      if (Array.isArray(val)) {
        if (val.length < 2) {
          this.$refs.menu.save(null)
          return
        }
        this.$refs.menu.save(val.sort((a: string, b: string) => {
          return new Date(a).getTime() - new Date(b).getTime()
        }))
      }

      switch (this.returnDateType) {
        case 'unix': {
          if (Array.isArray(val)) {
            // Выходим
            if (val.length < 2) {
              return
            }

            const dates: number[] = []
            for (let i = 0; i < val.length; i++) {
              dates.push(new Date(val[i]).getTime() / 1000)
            }

            this.$emit('change', dates.sort((a: number, b: number) => a - b))
          } else {
            this.$emit('change', null)
          }
          break
        }

        case 'date': {
          if (Array.isArray(val)) {
            // Выходим
            if (val.length < 2) {
              return
            }

            const dates: Date[] = []
            for (let i = 0; i < val.length; i++) {
              dates.push(new Date(val[i]))
            }

            this.$emit('change', dates.sort((a: Date, b: Date) => a.getTime() - b.getTime()))
          } else {
            this.$emit('change', new Date(val))
          }
          break
        }
      }
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'AppDatePickerInput',

  props: {
    dateRange: {
      default: () => false,
      type: Boolean
    },

    label: {
      default: '',
      type: String
    },

    returnDateType: {
      default: 'unix',
      type: String
    },

    value: {
      default: null,
      type: [Array, String, Date]
    }
  },

  watch: {
    value (val: string | string[] | number | number[] | Date | Date[]) {
      this.initialize(val)
    }
  }
})
</script>

<style scoped>

</style>
