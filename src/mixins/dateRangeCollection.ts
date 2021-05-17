import moment from 'moment'
import Vue from 'vue'

const dateRangeCollection = Vue.extend({
  computed: {
    dateRangeCollection () {
      return [
        {
          title: 'Сегодня',
          value: `${moment('00:00:00', 'hh:mm:ss').unix()},${moment('23:59:59', 'hh:mm:ss').unix()}`
        },
        {
          title: 'Вчера',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(1, 'day').unix()}`
        },
        {
          title: 'Текущая неделя',
          value: `${moment('23:59:59', 'hh:mm:ss').subtract(7, 'day').unix()},${moment('00:00:00', 'hh:mm:ss').unix()}`
        },
        {
          title: 'Прошлая неделя',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(14, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(7, 'day').unix()}`
        },
        {
          title: moment().format('MMMM'),
          value: `${moment('1 00:00:00', 'D hh:mm:ss').unix()},${moment('23:59:59', 'hh:mm:ss').unix()}`
        }
      ]
    }
  }
})

export default dateRangeCollection
