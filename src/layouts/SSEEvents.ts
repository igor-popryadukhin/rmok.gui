import Component from 'vue-class-component'
import AppBase from '@/AppBase'
import SSEMessage from '@/interfaces/SSEMessage'

@Component
export default class SSEEvents extends AppBase {
  public created () {
    this.$root.$on('sse-contact-assign-tags', this.onSSEContactsAssignTagsSuccessFully)
    this.$root.$on('sse-contacts-import-process', this.onSSEContactsImportProcess)
  }

  public beforeDestroy () {
    this.$root.$off('sse-contact-assign-tags', this.onSSEContactsAssignTagsSuccessFully)
    this.$root.$off('sse-contacts-import-process', this.onSSEContactsImportProcess)
  }

  private onSSEContactsAssignTagsSuccessFully (message: SSEMessage) {
    switch (message.payload?.status) {
      case 'successfully': {
        this.$toast.success('Tags assigned successfully')
        break
      }
      case 'failed': {
        this.$toast.error('Tags assign failed')
        break
      }
    }
  }

  private onSSEContactsImportProcess (message: SSEMessage) {
    switch (message.payload?.status) {
      case 'progress': {
        this.$root.$emit('main-process-dialog-update', {
          message: this.$tc('Please stand by...'),
          progress: +message.payload.percent
        })
        break
      }
      case 'success': {
        this.$root.$emit('main-process-dialog-hide')
        this.$toast.success('Tags assigned successfully')
        break
      }
      case 'failure': {
        this.$root.$emit('main-process-dialog-hide')
        this.$toast.error(message.payload?.message)
        break
      }
    }
  }
}
