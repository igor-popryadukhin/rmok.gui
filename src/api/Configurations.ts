import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface ATEConfigurationInterface {
  /* eslint-disable */
  server: string;
  port: number;
  display_name: string;
  login: string;
  password: string;
  /* eslint-enable */
}

export class Configurations {
  /**
   * Receives ATE configuration
   */
  public getATEConfigurations (): Promise<ATEConfigurationInterface> {
    return new Promise((resolve, reject) => {
      $axios.get('/configurations/ate')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Setting up a configuration for ATE
   * @param conf
   */
  public setATEConfigurations (conf: ATEConfigurationInterface): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.put('/configurations/ate', conf)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}
