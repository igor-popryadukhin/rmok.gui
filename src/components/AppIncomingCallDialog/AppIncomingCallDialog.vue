<template>
  <div
    class="app-incoming-toast"
  >
    <div class="display">
      <div>
        <div class="incoming-dialog-phone-number">
          <div style="text-align: center; font-size: 14px; margin-bottom: 10px">
            Входящий вызов
          </div>
          {{ display() }}
        </div>
      </div>
    </div>
    <div>
      <div class="app-incoming-toast__actions">
        <button
          v-ripple
          class="button button__hangup"
          @click="clickBtnHangup"
        >
          <i class="mdi mdi-phone-hangup" />
        </button>
        <button
          v-ripple
          class="button button__answer"
          @click="clickBtnAnswer"
        >
          <i class="mdi mdi-phone" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppIncomingCallDialog extends Vue {
  @Prop({ default: () => () => '' }) readonly display: CallableFunction

  @Emit('click:btn:answer')
  clickBtnAnswer () {
    return undefined;
  }

  @Emit('click:btn:hangup')
  clickBtnHangup () {
    return undefined;
  }
}
</script>

<style lang="scss" scoped>
.app-incoming-toast {
  padding: 0 16px 0 16px;

  & button {
    position: relative;
    overflow: hidden;
  }

  &__actions {
    align-items: center;
    justify-content: space-between;
    display: flex;
    padding: 8px;
    min-width: 350px;
  }

  & .display {
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 8px;
    font-size: 18px;
    font-family: "Roboto", sans-serif;
  }

  & .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;

    &__answer {
      background-color: #2cc642;
    }

    &__hangup {
      background-color: #f96161;
    }

    & i {
      font-size: 25px;
    }
  }
}

</style>
