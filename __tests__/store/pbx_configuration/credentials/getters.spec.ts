
import getters from './../../../../src/store/pbx_configuration/credentials/getters'
import { State } from './../../../../src/store/pbx_configuration/credentials/state'

const state: State = {
  login: 'login',
  password: 'Sd08S1_us3',
  schema: 'wss',
  server: 'wss://example.com/ws',
  port: 8089,
  display_name: 'Milana'
}

describe('Геттеры модуля credentials', () => {
  test('Геттер "login" возвращает "login"', () => {
    expect(getters.login(state)).toBe('login')
  })

  test('Геттер "password" возвращает "Sd08S1_us3"', () => {
    expect(getters.password(state)).toBe('Sd08S1_us3')
  })

  test('Геттер "schema" возвращает "wss"', () => {
    expect(getters.schema(state)).toBe('wss')
  })

  test('Геттер "server" возвращает "wss://example.com/ws"', () => {
    expect(getters.server(state)).toBe('wss://example.com/ws')
  })

  test('Геттер "port" возвращает "8089"', () => {
    expect(getters.port(state)).toBe(8089)
  })

  test('Геттер "display_name" возвращает "Milana"', () => {
    expect(getters.display_name(state)).toBe('Milana')
  })
})
