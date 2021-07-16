
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

interface ContactListInterface {
  /** Количество элементов на страницу */
  count_per_page: number;
}

interface TooltipInterface {
  openDelay: number;
  color: string;
}

export interface SettingsStateInterface {
  contact_list: ContactListInterface,
  navigation_drawer: NavigationDrawerInterface;
  audio_player: AudioPlayerInterface;
  date_time_format: DateTimeFormatInterface;
  tooltip: TooltipInterface;
  pc_config: RTCConfiguration;
}

function state (): SettingsStateInterface {
  return {
    contact_list: {
      count_per_page: 50
    },
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
    },
    tooltip: {
      openDelay: 1200,
      color: 'primary'
    },
    pc_config: {
      bundlePolicy: undefined,
      certificates: [],
      iceCandidatePoolSize: 0,
      iceServers: [],
      iceTransportPolicy: 'all',
      rtcpMuxPolicy: undefined
    }
  }
}

export default state
