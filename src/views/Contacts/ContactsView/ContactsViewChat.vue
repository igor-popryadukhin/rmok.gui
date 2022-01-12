<template>
  <v-sheet
    height="100%"
  >
    <div class="d-flex flex-row">
      <div class="col-8">
        <v-text-field
          prepend-icon="mdi-magnify"
          label="Поиск по сообщениям"
          dense
        />
      </div>
      <div class="col-4 d-flex justify-center align-center">
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
    <app-chat>
      <template v-for="item in messages">
        <app-chat-message
          :key="item.id"
          :name="item.user"
          :text="item.text"
          :sent="item.direction"
          :date-time="item.created_at"
          :status="item.status"
        />
      </template>
    </app-chat>
    <div class="app-chat-message-send-tool">
      <v-btn
        icon
        color="primary"
        @click="onAttachMediaFiles"
      >
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
      <v-text-field
        append-icon="mdi-text-box-plus"
        class="mr-2"
        placeholder="Написать сообщение..."
        outlined
        dense
        hide-details="auto"
        @click:append="onSelectTemplateMessage"
      />
      <v-btn
        color="primary"
        text
        outlined
        tile
        @click="sendMessage"
      >
        {{ $tc('Отправить') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import ContactsViewBase from './ContactsViewBase'
import Component from 'vue-class-component'
import AppChat from '@/components/AppChat/AppChat.vue'
import AppChatMessage from '@/components/AppChat/AppChatMessage.vue'
import AppChatBottomTools from '@/components/AppChat/AppChatBottomTools.vue'

// eslint-disable-next-line no-use-before-define
@Component({
  components: { AppChatMessage, AppChat }
})
export default class ContactsViewChat extends ContactsViewBase {
  // Fake data
  get messages () {
    return [
      {
        id: 1,
        text: 'Здравствуйте, Галина!',
        direction: true,
        created_at: '05.01.2022 14:25:48',
        user: 'Милана Проценко',
        status: 'sent' // отправлено
      },
      {
        id: 2,
        text: 'Халва — это кредитная или дебетовая карта?',
        direction: false,
        created_at: '05.01.2022 14:26:08',
        user: 'Большаковa Галина',
        status: 'delivered' // доставлен
      },
      {
        id: 3,
        text: '«Халва» — это карта с двойной пользой: можнo покупать в рассрочку, можно хранить свои деньги, расплачиваться ими, зарабатывать кэшбэк и получать проценты на остаток.',
        direction: true,
        created_at: '05.01.2022 14:26:08',
        user: 'Милана Проценко',
        status: 'read' // прочитано
      },
      {
        id: 4,
        text: 'Здравствуйте, Галина!',
        direction: true,
        created_at: '05.01.2022 14:25:48',
        user: 'Милана Проценко',
        status: 'read'
      },
      {
        id: 5,
        text: 'Халва — это кредитная или дебетовая карта?',
        direction: false,
        created_at: '05.01.2022 14:26:08',
        user: 'Большаковa Галина',
        status: 'read'
      },
      {
        id: 6,
        text: '«Халва» — это карта с двойной пользой: можнo покупать в рассрочку, можно хранить свои деньги, расплачиваться ими, зарабатывать кэшбэк и получать проценты на остаток.',
        direction: true,
        created_at: '05.01.2022 14:26:08',
        user: 'Милана Проценко',
        status: 'read'
      },
      {
        id: 7,
        text: 'Здравствуйте, Галина!',
        direction: true,
        created_at: '05.01.2022 14:25:48',
        user: 'Милана Проценко',
        status: 'read'
      },
      {
        id: 8,
        text: 'Халва — это кредитная или дебетовая карта?',
        direction: false,
        created_at: '05.01.2022 14:26:08',
        user: 'Большаковa Галина',
        status: 'read'
      },
      {
        id: 9,
        text: '«Халва» — это карта с двойной пользой: можнo покупать в рассрочку, можно хранить свои деньги, расплачиваться ими, зарабатывать кэшбэк и получать проценты на остаток.',
        direction: true,
        created_at: '05.01.2022 14:26:08',
        user: 'Милана Проценко',
        status: 'read'
      }
    ]
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
    // Some code
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
.app-chat-message-send-tool {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
}
</style>
