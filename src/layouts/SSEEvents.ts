import Component from 'vue-class-component'
import AppBase from '@/AppBase'
import SSEMessage from '@/interfaces/SSEMessage'

@Component
export default class SSEEvents extends AppBase {
  public created () {
    this.$root.$on('sse-contact-assign-tags', this.onSSEContactsAssignTagsSuccessFully)
  }

  public beforeDestroy () {
    this.$root.$off('sse-contact-assign-tags', this.onSSEContactsAssignTagsSuccessFully)
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
}
