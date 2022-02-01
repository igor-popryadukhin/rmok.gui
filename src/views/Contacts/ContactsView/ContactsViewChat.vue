<template>
  <div class="chat-page">
    <div class="d-flex flex-row justify-space-between py-2">
      <div class="d-flex align-center">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          :label="$tc('Search')"
          style="max-width: 350px"
          dense
          outlined
          hide-details
        />
      </div>
      <div class="d-flex align-center">
        <v-btn
          small
          tile
          text
          @click="onCloseChatClick"
        >
          {{ $tc('Завершить диалог') }}
        </v-btn>
        <v-btn
          small
          tile
          text
          @click="onChangeOwnerClick"
        >
          {{ $tc('Передать диалог') }}
        </v-btn>
      </div>
    </div>
    <div
      ref="messageBox"
      class="chat-page__box overflow-y-auto pa-5"
    >
      <div
        v-if="messagesFetching && messages.length === 0"
        class="d-flex align-center justify-center fill-height"
      >
        <app-loading message="Загрузка сообщений..." />
      </div>
      <template v-else>
        <transition-group
          name="fade"
          type="animation"
          duration="1"
          appear
        >
          <app-chat-message
            v-for="item in messages"
            :key="'app-chat-message-' + item.id"
            :name="item.owner_name"
            :text="item.text"
            :sent="item.direction"
            :date-time="$dayjs(item.created_at).format('HH:mm')"
            :status="item.status"
          />
        </transition-group>
        <div ref="messageAnchor" />
      </template>
    </div>
    <div class="chat-page__bottom-control">
      <v-textarea
        v-model="text"
        class="mr-2"
        placeholder="Написать сообщение..."
        hide-details="auto"
        autofocus
        flat
        auto-grow
        row-height="2"
        @keydown.enter.prevent="onSendEnter"
      >
        <template #prepend>
          <v-btn
            icon
            color="primary"
            @click="onAttachMediaFiles"
          >
            <v-icon>mdi-paperclip</v-icon>
          </v-btn>
        </template>
        <template #append>
          <v-btn
            icon
            color="primary"
          >
            <v-icon>mdi-emoticon-happy-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            color="primary"
          >
            <v-icon>mdi-send-outline</v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </div>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
import AppChat from '@/components/AppChat/AppChat.vue'
import AppChatMessage from '@/components/AppChat/AppChatMessage.vue'
import { Ref, Watch } from 'vue-property-decorator'

@Component({
  components: { AppLoading, AppChatMessage, AppChat },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('contacts/view/messages/fetch', {
        contact_id: to.params.id
      })
    })
  }
})
export default class ContactsViewChat extends AppBase {
  @Ref('messageBox') readonly messageBox!: HTMLElement
  @Ref('messageAnchor') readonly messageAnchor!: HTMLElement

  text = null

  get messagesFetching () { return this.$store.getters['contacts/view/messages/items_fetching'] }
  get messages () { return this.$store.getters['contacts/view/messages/items'] }

  @Watch('messages')
  messagesWatch () {
    setTimeout(() => {
      // this.messageAnchor.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      //   inline: 'nearest'
      // })
    }, 0)
  }

  public created () {
    this.$root.$on('sse-messenger-message', this.onSSEMessengerMessage)
  }

  public beforeDestroy () {
    this.$root.$off('sse-messenger-message', this.onSSEMessengerMessage)
  }

  private onSSEMessengerMessage () {
    this.$store.dispatch('contacts/view/messages/fetch', {
      contact_id: this.$route.params.id
    })
  }

  /**
   * Закрываем диалог
   * @protected
   */
  protected onCloseChatClick () {
    // Some code
  }

  /**
   * Передаем диалог другому оператору
   * @protected
   */
  protected onChangeOwnerClick () {
    // Some code
  }

  /**
   * Отправить сообщение
   * @protected
   */
  protected sendMessage () {
    this.$axios.post('/chat/messages', {
      contact_id: this.$route.params.id,
      text: this.text
    })
    this.text = null
  }

  private onSendEnter () {
    this.sendMessage()
  }

  /**
   * Прикрепляем медиа файлы
   * @protected
   */
  protected onAttachMediaFiles () {
    // Some code
  }

  /**
   * Выбрать шаблон сообщения
   * @protected
   */
  protected onSelectTemplateMessage () {
    // Some code
  }
}

</script>

<style lang="scss" scoped>
.chat-page {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.chat-page__top-control {

}

.chat-page__box {
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  overflow-y: auto;
}

.chat-page__bottom-control {
  box-sizing: border-box;
}
</style>
