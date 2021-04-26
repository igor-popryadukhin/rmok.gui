
interface NavigationDrawerInterface {
  mini: boolean;
}

export interface SettingsStateInterface {
  navigation_drawer: NavigationDrawerInterface
}

function state (): SettingsStateInterface {
  return {
    navigation_drawer: {
      mini: true
    }
  }
}

export default state
