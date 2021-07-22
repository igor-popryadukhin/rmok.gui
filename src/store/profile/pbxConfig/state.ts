import PBXConfig from '@/api/interfaces/PBXConfig'

export type PBXConfigState = PBXConfig

function state (): PBXConfigState {
  return {
    display_name: '',
    login: '',
    password: '',
    port: 443,
    server: ''
  }
}

export default state
