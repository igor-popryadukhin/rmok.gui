
import getters from '@/store/pbx_configuration/rtc_configuration/getters'
import { State } from '@/store/pbx_configuration/rtc_configuration/state'

const state: State = {
  bundle_policy: 'balanced',
  certificates: [],
  ice_candidate_pool_size: 5,
  ice_servers: [{
    credential: 'token',
    credentialType: 'password',
    urls: [
      'stun:stun.rmok.tech'
    ],
    username: ''
  }],
  ice_transport_policy: 'all',
  rtcp_mux_policy: 'require'
}

describe('Геттеры модуля rtc_configuration', () => {
  test('Геттер "bundle_policy" возвращает "balanced"', () => {
    expect(getters.bundle_policy(state)).toBe('balanced')
  })

  test('Геттер "certificates" возвращает "[]"', () => {
    expect(getters.certificates(state)).toStrictEqual([])
  })

  test('Геттер "ice_candidate_pool_size" возвращает "5"', () => {
    expect(getters.ice_candidate_pool_size(state)).toBe(5)
  })

  test('Геттер "ice_servers" возвращает массив "[]"', () => {
    expect(getters.ice_servers(state)).toStrictEqual([{
      credential: 'token',
      credentialType: 'password',
      urls: [
        'stun:stun.rmok.tech'
      ],
      username: ''
    }
    ])
  })

  test('Геттер "ice_transport_policy" возвращает "all"', () => {
    expect(getters.ice_transport_policy(state)).toBe('all')
  })

  test('Геттер "rtcp_mux_policy" возвращает "require"', () => {
    expect(getters.rtcp_mux_policy(state)).toBe('require')
  })
})
