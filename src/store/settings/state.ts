
interface NavigationDrawerInterface {
  mini: boolean;
}

interface AudioPlayerInterface {
  volume: number;
}

export interface SettingsStateInterface {
  navigation_drawer: NavigationDrawerInterface;
  audio_player: AudioPlayerInterface;
}

function state (): SettingsStateInterface {
  return {
    navigation_drawer: {
      mini: true
    },
    audio_player: {
      volume: 1
    }
  }
}

export default state
