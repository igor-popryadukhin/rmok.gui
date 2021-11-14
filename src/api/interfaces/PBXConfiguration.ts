export interface Credentials {
  display_name: string;
  schema: string;
  server: string;
  port: number;
  login: string;
  password: string;
}

export interface RTCConfiguration {
  bundle_policy: RTCBundlePolicy;
  rtcp_mux_policy: RTCRtcpMuxPolicy;
  ice_servers: RTCIceServer[];
  ice_transport_policy: RTCIceTransportPolicy;
  ice_candidate_pool_size: number;
  certificates: [];
  candidate_ready_timeout: number;
}

export default interface PBXConfiguration {
  credentials: Credentials;
  rtc_configuration: RTCConfiguration;
}
