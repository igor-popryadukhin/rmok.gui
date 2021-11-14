export interface RTCIceServer {
  credential?: string;
  credential_type?: 'password';
  urls: string | string[];
  username?: string;
}

export interface State {
  bundle_policy?: RTCBundlePolicy;
  certificates?: RTCCertificate[];
  ice_candidate_pool_size?: number;
  ice_servers?: RTCIceServer[];
  ice_transport_policy?: RTCIceTransportPolicy;
  rtcp_mux_policy?: RTCRtcpMuxPolicy;
  candidate_ready_timeout: number;
}

function state (): State {
  return {
    // @see https://webrtcstandards.info/sdp-bundle/
    bundle_policy: 'balanced',
    certificates: [],
    ice_candidate_pool_size: 0,
    ice_servers: [],
    ice_transport_policy: 'all',
    rtcp_mux_policy: 'require',
    candidate_ready_timeout: 0
  }
}

export default state
