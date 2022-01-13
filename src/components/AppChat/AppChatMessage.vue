<template>
  <div class="app-chat-message">
    <div
      class="row"
      :class="{ 'reverse': sent }"
    >
      <div>
        <div
          class="app-chat-message-name"
          :class="{ 'app-chat-message-name-sent': sent }"
        >
          <slot
            name="user"
            :username="name"
          >
            {{ name }}
          </slot>
        </div>
        <div
          class="app-chat-message-text"
          :class="sent ? 'app-chat-message-text--sent' : 'app-chat-message-text--received'"
        >
          <div class="app-chat-message-text-content">
            <div>
              <slot
                name="text"
                :textMessage="text"
              >
                {{ text }}
              </slot>
            </div>
            <div class="app-chat-message-stamp">
              {{ dateTime }}
              <slot name="statusIcons">
                <template v-if="status === 'sent'">
                  <v-icon
                    style="font-size: 18px;"
                  >
                    mdi-check
                  </v-icon>
                </template>
                <template v-if="status === 'delivered'">
                  <v-icon
                    style="font-size: 18px;"
                  >
                    mdi-check-all
                  </v-icon>
                </template>
                <template v-if="status === 'read'">
                  <v-icon
                    color="primary"
                    style="font-size: 18px;"
                  >
                    mdi-check-all
                  </v-icon>
                </template>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppChatMessage extends Vue {
  @Prop() name!: string
  @Prop() text!: string
  @Prop() dateTime!: string
  @Prop({
    type: String,
    validator (value: string): boolean {
      return ['delivered', 'sent', 'read'].includes(value)
    }
  }) status!: string

  @Prop({ default: () => false }) sent!: boolean
}
</script>

<style lang="scss" scoped>
.app-chat-message {
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.reverse {
  flex-direction: row-reverse;
}

.app-chat-message-name {
  font-size: small;
}

.app-chat-message-text:last-child {
  min-height: 48px;
  max-width: 468px;
}

.app-chat-message-text {
  background: currentColor;
  line-height: 1.2;
  padding: 8px;
  position: relative;
  word-break: break-word;
}

.app-chat-message-name-sent {
  text-align: right;
}

.app-chat-message-text--sent {
  border-radius: 4px 4px 0 4px;
  color: #c3d8ff;
}

.app-chat-message-text:last-child:before {
  bottom: 0;
  content: "";
  height: 0;
  position: absolute;
  width: 0;
}
.app-chat-message-text--sent:last-child:before {
  border-bottom: 8px solid;
  border-left: 0 solid #0000;
  border-right: 8px solid #0000;
  left: 100%;
}

.app-chat-message-text-content {
  color: #000;
  opacity: 0.8;
}

.app-chat-message-text:last-child .app-chat-message-stamp {
  display: block;
}

.app-chat-message-stamp {
  color: inherit;
  display: none;
  margin-top: 4px;
  opacity: .6;
  font-size: small;
}

.app-chat-message-text--received {
  border-radius: 4px 4px 4px 0;
  color: #c3d8ff;
}

.app-chat-message-text--received:last-child:before {
  border-bottom: 8px solid;
  border-left: 8px solid #0000;
  border-right: 0 solid #0000;
  right: 100%;
}
</style>
