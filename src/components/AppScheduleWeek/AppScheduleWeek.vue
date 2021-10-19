<template>
  <div class="schedule-wrapper">
    <!--    <div :style="verticalLineCss" ref="lineVertical"></div>-->
    <table
      cellpadding="0"
      cellspacing="0"
    >
      <thead>
        <tr>
          <td />
          <td
            v-for="(itemHour, itemHourIndex) in hours"
            :key="itemHourIndex"
          >
            <div class="schedule-hour-title">
              {{ itemHour.title }}
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(itemDay, itemDayIndex) in days"
          :key="itemDayIndex"
        >
          <td>
            <div class="schedule-day-title">
              {{ itemDay.title }}
            </div>
          </td>

          <td
            v-for="(itemHour, itemHourIndex) in hours"
            :key="itemHourIndex"
          >
            <div
              :style="{'background-color': getMatrixState(itemDay.x, itemHour.y) ? elementColor: ''}"
              @mouseup.left="onMatrixClick({ itemHour, itemDay })"
              @contextmenu="onMouseUpCtrl(itemDay, $event)"
            />
          </td>
        </tr>
      </tbody>
      <tfoot />
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ScheduleInterface {
  day: number;
  time: string;
}

interface ScheduleMatrixInterface {
  x: number;
  y: number;
  selected: boolean;
  schedule: ScheduleInterface;
}

export default Vue.extend({
  name: 'AppScheduleWeek',

  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    elementColor: {
      type: String,
      default () {
        return 'green'
      }
    },

    elementSize: {
      type: Number,
      default () {
        return 30
      }
    },

    disabled: {
      type: Boolean,
      default: () => false
    },

    value: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      days: [] as any[],
      hours: [] as any[],
      matrix: [] as ScheduleMatrixInterface[]
    }
  },

  computed: {
    currentDay () {
      return new Date().getDay()
    },

    currentHour () {
      return String(new Date().getHours()).padStart(2, '00') + ':00'
    },

    verticalLineCss () {
      const left = 100
      const first = 113
      const length = 750
      // const hours = new Date().getHours()

      // const difference = length - first

      return {
        display: 'block',
        position: 'absolute',
        'background-color': '#f44336',
        left: `${left}px`,
        top: '169px',
        height: '205px',
        width: '2px'
      }
    },

    cssElementSize () {
      return {
        height: '50px',
        width: '50px'
      }
    },

    selected () {
      return this.matrix.filter((value: ScheduleMatrixInterface) => {
        return value.selected
      }).map((value: ScheduleMatrixInterface) => {
        return value.schedule
      })
    }
  },

  watch: {
    value: {
      handler (val?: ScheduleInterface[]) {
        if (val) {
          this.matrix = this.matrix.map(value => {
            value.selected = false
            return value
          })
          for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < val.length; j++) {
              if (this.matrix[i].schedule.day === val[j].day && this.matrix[i].schedule.time === val[j].time) {
                this.matrix[i].selected = true
              }
            }
          }
        }
      },

      deep: true
    }
  },

  mounted () {
    for (let i = 0; i < 24; i++) {
      this.hours.push({
        title: String(i).padStart(2, '00'),
        h: i,
        y: i
      })
    }

    const daysOfTheWeek = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье'
    ]

    this.days = daysOfTheWeek.map((value, index) => {
      return {
        title: value,
        d: index + 1,
        x: index
      }
    })

    for (let i = 0; i < this.days.length; i++) {
      for (let j = 0; j < this.hours.length; j++) {
        this.matrix.push({
          x: this.days[i].x,
          y: this.hours[j].y,
          selected: false,
          schedule: {
            time: String(j).padStart(2, '00') + ':00',
            day: i + 1
          }
        })
      }
    }
  },

  methods: {
    onMouseUpCtrl (itemDay: any, event: MouseEvent) {
      event.preventDefault()
      this.matrix = this.matrix.map(value => {
        if (itemDay.d === value.schedule.day) { value.selected = false }
        return value
      })
      this.$emit('change', this.selected)
    },

    onMatrixClick ({ itemDay, itemHour }: any) {
      const x = itemDay?.x || 0
      const y = itemHour?.y || 0
      this.setMatrixState(x, y || 0, !this.getMatrixState(x, y))

      this.$emit('change', this.selected)
      this.$emit('click:square', this.getMatrix(x, y))
    },

    setMatrixState (x: number, y: number, selected: boolean) {
      const m = this.matrix.find(value => {
        return value.x === x && value.y === y
      })

      if (m) { m.selected = selected }
    },

    getMatrixState (x: number, y: number) {
      const m = this.matrix.find(value => {
        return value.x === x && value.y === y
      })

      if (m) {
        return m.selected
      }

      return false
    },

    getMatrix (x: number, y: number): ScheduleMatrixInterface | undefined {
      const m = this.matrix.find(value => {
        return value.x === x && value.y === y
      })

      if (m) {
        return m
      }

      return undefined
    },

    calculateStyle (x: number, y: number) {
      const m = this.getMatrix(x, y)

      if (m) {
        return {}
      }
    }
  }

})
</script>

<style lang="scss" scoped>
.schedule-wrapper {
  //border: solid 1px Silver;
  padding: 10px;
  display: inline-block;
}
.schedule-wrapper * {
  user-select: none;
}

.schedule-wrapper table:disabled {
  background: #2cc642;
}

.schedule-wrapper .schedule-day-title {
  user-select: none;
}

.schedule-wrapper .schedule-hour-title {
  user-select: none;
}

.schedule-wrapper table thead tr td div {
  color: #666;
  text-align: center;
  overflow: hidden;
  background-color: White;
  margin: 1px;
  cursor: pointer;
  padding: 8px 0;
  font-size: 9pt;
  font-weight: bold;
  width: 25px;
  //background: url(../images/grad.png) left bottom repeat-x;
}

.schedule-wrapper table thead tr td div:hover {
  color: #555;
  border-color: #bfbfbf;
  //background: url(../images/gradRev.png) left bottom repeat-x;
}

.schedule-wrapper table thead tr td.hovered div {
  color: #444;
}

.schedule-wrapper table thead tr td div.selected, .schedule-wrapper table thead tr td div.selected:hover {
  //background: url(../images/ggrad.png) left -2px repeat-x;
  border-color: #b7c4df;
  color: #444;
}

.schedule-wrapper table tbody tr td div {
  border: solid 1px #ddd;
  height: 25px;
  cursor: pointer;
  margin: 1px;
}

.schedule-wrapper table tbody tr td.hovered div {

  border-color: #ccc;
  //background: url(../images/ggrad2.png) left bottom repeat-x;
}

.schedule-wrapper table tbody tr td div.selected, .schedule-wrapper table tbody tr td div.selected:hover {
  //background: url(../images/ggrad.png) left -2px repeat-x;
  border-color: #b7c4df;
}

.schedule-wrapper table tbody tr td div:hover {
  border-color: #ccc;
  //background: url(../images/ggrad2.png) left bottom repeat-x;
}

.schedule-wrapper table tbody tr td div.selected:hover {

}

.schedule-wrapper table tbody tr td:first-child div {
  padding: 1px 3px;
  vertical-align: top;
  font-size: 9pt;
  cursor: default;
  text-align: right;
  margin: 0;
  border: solid 1px White;
  font-weight: bold;
  color: #777;
}

.schedule-wrapper table tbody tr.hovered td:first-child div {
  color: #333;
  border-color: White;
  background: none;

}

.schedule-wrapper table tbody tr td:first-child div:hover {
  color: #777;
}

.ResultsHolder input {
  margin: 10px 40px;
}

.ResultsHolder #output {
  font-family: Courier New;
  font-size: 10px;
  padding: 20px;
}
</style>
