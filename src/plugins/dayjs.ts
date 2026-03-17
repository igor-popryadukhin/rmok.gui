import Vue from 'vue';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import Weekday from 'dayjs/plugin/weekday';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(Weekday);
dayjs.locale('ru');

class Plugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $dayjs: {
        get () {
          return dayjs;
        }
      }
    });
  }
}

Vue.use(new Plugin());

export default dayjs;
