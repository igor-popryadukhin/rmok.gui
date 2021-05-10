
interface NavigationDrawerInterface {
  mini: boolean;
}

interface AudioPlayerInterface {
  volume: number;
}

interface DateTimeFormatInterface {
  first_day_of_week: number;
  long_date: string;
  short_date: string;
  short_time: string;
  long_time: string;
}

export interface SettingsStateInterface {
  navigation_drawer: NavigationDrawerInterface;
  audio_player: AudioPlayerInterface;
  date_time_format: DateTimeFormatInterface;
}

function state (): SettingsStateInterface {
  return {
    date_time_format: {
      first_day_of_week: 1,
      long_date: 'LL',
      short_date: 'DD.MM.YYYY',
      long_time: 'HH:mm:ss',
      short_time: 'HH:mm'
    },
    navigation_drawer: {
      mini: true
    },
    audio_player: {
      volume: 1
    }
  }
}

export default state
