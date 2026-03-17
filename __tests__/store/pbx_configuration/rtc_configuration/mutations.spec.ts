
import mutations from './../../../../src/store/pbx_configuration/rtc_configuration/mutations'
import { State } from './../../../../src/store/pbx_configuration/rtc_configuration/state'

const state: State = {
  bundle_policy: 'balanced',
  certificates: [],
  ice_candidate_pool_size: 0,
  ice_servers: [],
  ice_transport_policy: 'all',
  rtcp_mux_policy: 'require',
  candidate_ready_timeout: 0
}

describe('Мутации модуля rtc_configuration', () => {
  test('Мутация "bundle_policy" заполняет данные "balanced"', () => {
    mutations.bundle_policy(state, 'balanced')
    expect(state.bundle_policy).toBe('balanced')
  })

  test('Мутация "certificates" заполняет данные "[]"', () => {
    mutations.certificates(state, [])
    expect(state.certificates).toStrictEqual([])
  })

  test('Мутация "ice_candidate_pool_size" заполняет данные "1"', () => {
    mutations.ice_candidate_pool_size(state, 1)
    expect(state.ice_candidate_pool_size).toBe(1)
  })

  test('Мутация "ice_servers" заполняет данные', () => {
    mutations.ice_servers(state, [{
      credential: 'token',
      credentialType: 'password',
      urls: [
        'stun:stun.rmok.tech'
      ],
      username: ''
    }
    ])
    expect(state.ice_servers).toStrictEqual([{
      credential: 'token',
      credentialType: 'password',
      urls: [
        'stun:stun.rmok.tech'
      ],
      username: ''
    }
    ])
  })

  test('Мутация "ice_transport_policy" заполняет данные "all"', () => {
    mutations.ice_transport_policy(state, 'all')
    expect(state.ice_transport_policy).toBe('all')
  })

  test('Мутация "rtcp_mux_policy" заполняет данные "require"', () => {
    mutations.rtcp_mux_policy(state, 'require')
    expect(state.rtcp_mux_policy).toBe('require')
  })

  test('Мутация "candidate_ready_timeout" заполняет данные "5000"', () => {
    mutations.candidate_ready_timeout(state, 5000)
    expect(state.candidate_ready_timeout).toBe(5000)
  })

  test('Мутация "fill" заполняет все состояние', () => {
    mutations.fill(state, {
      bundle_policy: 'balanced',
      certificates: [],
      ice_candidate_pool_size: 0,
      ice_servers: [{
        credential: 'token',
        credentialType: 'password',
        urls: [
          'stun:stun.rmok.tech'
        ],
        username: ''
      }
      ],
      ice_transport_policy: 'all',
      rtcp_mux_policy: 'require',
      candidate_ready_timeout: 5000
    })
    expect(state).toStrictEqual({
      bundle_policy: 'balanced',
      certificates: [],
      ice_candidate_pool_size: 0,
      ice_servers: [{
        credential: 'token',
        credentialType: 'password',
        urls: [
          'stun:stun.rmok.tech'
        ],
        username: ''
      }
      ],
      ice_transport_policy: 'all',
      rtcp_mux_policy: 'require',
      candidate_ready_timeout: 5000
    })
  })
})
