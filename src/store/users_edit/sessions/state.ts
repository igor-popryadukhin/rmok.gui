interface Browser {
  name: string;
  version: string;
}

interface Os {
  name: string;
  version: string;
}

interface UserSession {
  id: number;
  ip: string;
  user_agent: string;
  browser: Browser;
  os: Os;
  created_at: number;
}

export interface State {
  items: UserSession[]
}

export function defaultState (): State {
  return {
    items: []
  }
}

const state = defaultState()

export default state
