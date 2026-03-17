import Component from 'vue-class-component';
import AppBase from '@/AppBase';
import SSEMessage from '@/interfaces/SSEMessage';
import { AxiosResponse } from 'axios';

@Component
export default class SSEEvents extends AppBase {

  private onSSEContactsAssignTagsSuccessFully (message: SSEMessage) {
    switch (message.payload?.status) {
      case 'successfully': {
        this.$toast.success('Tags assigned successfully');
        break;
      }
      case 'failed': {
        this.$toast.error('Tags assign failed');
        break;
      }
    }
  }

  private onSSEContactsExportProcess (message: SSEMessage) {
    switch (message.payload?.status) {
      case 'progress': {
        this.$root.$emit('main-process-dialog-update', {
          message: this.$tc('Please stand by...'),
          progress: +message.payload.percent
        });
        break;
      }
      case 'success': {
        // Скачивание файла
        this.$axios.get(message.payload.url, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent: any) => {
            this.$root.$emit('main-process-dialog-update', {
              progress: Math.floor((progressEvent.loaded * 100) / progressEvent.total)
            });
          }
        })
          .then((response: AxiosResponse) => {
            const type = response.headers['content-type'];

            const a = document.createElement('a');
            a.setAttribute('style', 'display: none');

            const fileName = message.payload.url.split('/').pop();
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(new Blob([response.data], { type }));
            a.href = url;
            a.click();
            setTimeout(() => {
              a.remove();
            }, 1000);

            window.URL.revokeObjectURL(url);
          })
          .finally(() => (this.$root.$emit('main-process-dialog-hide')));

        break;
      }
      case 'failure': {
        this.$root.$emit('main-process-dialog-hide');
        this.$toast.error(message.payload?.message);
        break;
      }
    }
  }
}
