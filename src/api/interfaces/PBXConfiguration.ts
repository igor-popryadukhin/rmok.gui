interface Credentials {
  display_name: string;
  schema: string;
  server: string;
  port: number;
  login: string;
  password: string;
}

interface RTCConfiguration {
  bundle_policy: string;
  rtcp_mux_policy: string;
  ice_servers: [],
  ice_transport_policy: 'all' | 'relay',
  ice_candidate_pool_size: number,
  certificates: []
}

export default interface PBXConfiguration {
  credentials: Credentials;
  rtc_configuration: RTCConfiguration;
}
