import integrations from './integrations'
import messengers from './messengers'


const chats = {
  namespaced: true,
  modules: {
    integrations,
    messengers
  }
}

export default chats
