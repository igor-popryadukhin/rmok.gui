
import mutations from '@/store/pbx_configuration/credentials/mutations'

const state = {
  login: '',
  password: '',
  schema: '',
  server: '',
  port: 0,
  display_name: ''
}

describe('Мутации модуля credentials', () => {
  test('Мутация "login" заполняет данные "login"', () => {
    mutations.login(state, 'login')
    expect(state.login).toBe('login')
  })

  test('Мутация "login" заполняет данные "password"', () => {
    mutations.password(state, 'password')
    expect(state.password).toBe('password')
  })

  test('Мутация "schema" заполняет данные "wss"', () => {
    mutations.schema(state, 'wss')
    expect(state.schema).toBe('wss')
  })

  test('Мутация "server" заполняет данные "wss://example.com/ws"', () => {
    mutations.server(state, 'wss://example.com/ws')
    expect(state.server).toBe('wss://example.com/ws')
  })

  test('Мутация "port" заполняет данные "8089"', () => {
    mutations.port(state, 8089)
    expect(state.port).toBe(8089)
  })

  test('Мутация "display_name" заполняет данные "Milana"', () => {
    mutations.display_name(state, 'Milana')
    expect(state.display_name).toBe('Milana')
  })

  test('Мутация "fill" заполняет все состояние', () => {
    mutations.fill(state, {
      login: '3456',
      password: 'Sd0oersS',
      schema: 'wss',
      server: 'wss://example.com/ws',
      port: 443,
      display_name: 'XXX'
    })
    expect(state).toStrictEqual({
      login: '3456',
      password: 'Sd0oersS',
      schema: 'wss',
      server: 'wss://example.com/ws',
      port: 443,
      display_name: 'XXX'
    })
  })
})
