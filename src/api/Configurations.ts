import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import PBXInterface from './Schemas/PBXInterface';

export class Configurations {
  /**
   * Receives ATE configuration
   */
  public getATEConfigurations (): Promise<PBXInterface | any> {
    return new Promise<PBXInterface | any>((resolve, reject) => {
      $axios.get('/configurations/bpx')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data);
          }
          resolve(response.data);
        }).catch(reject);
    });
  }

  /**
   * Setting up a configuration for ATE
   * @param conf
   */
  public setATEConfigurations (conf: PBXInterface): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.put('/configurations/bpx', conf)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
  }
}
