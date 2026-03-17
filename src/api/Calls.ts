import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';

export class Calls {
  /**
   * Позволяет оценить качество связи.
   *
   * @param request
   */
  public communicationQualityAssessment (request: {rating: number; comment: string; contact_id: number}): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/calls/quality', request)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            resolve(response.data?.id || 0);
          }
          throw new APIError(response.data);
        }).catch(reject);
    });
  }

  /**
   * Скачать файл отчёта опроса качества связи.
   *
   */
  public communicationQualityDownload (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get('/calls/quality/export', {
        params: {
          format: 'excel'
        },
        responseType: 'blob'
      })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const type = response.headers['content-type'];
            const url = window.URL.createObjectURL(new Blob([response.data], { type }));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `${new Date().getTime()}.xlsx`);

            document.body.appendChild(link);

            link.click();

            setTimeout(() => {
              link.remove();
            }, 1000);

            resolve();
          } else {
            throw new APIError(response.data);
          }
        }).catch(reject);
    });
  }

  /**
   * Receives all calls
   */
  public get (offset = 0, count = 100): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get('/calls', {
        params: { count, offset }
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          reject(response.data);
        }
        resolve(response.data);
      }).catch(reject);
    });
  }
}
