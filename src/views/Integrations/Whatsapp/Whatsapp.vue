<template>
  <div class="whatsapp__page">
    <div class="whatsapp__box mb-10">
      <div class="mr-10">
        <div class="qr_code mb-5">
          <v-fade-transition>
            <v-img
              v-if="whatsappQRCode && whatsappQRCodeVisible"
              :src="whatsappQRCode"
            />
            <v-img
              v-else-if="!whatsappQRCode && whatsappQRCodeVisible"
              :src="whatsappQRCodeFake"
            />
          </v-fade-transition>
        </div>
        <v-btn
          v-if="!whatsappIsRunning"
          text
          block
          tile
          outlined
          @click="whatsappEnable"
        >
          Подключить
        </v-btn>
        <v-btn
          v-else
          color="red"
          text
          block
          tile
          outlined
          @click="whatsappDisable"
        >
          Отключить
        </v-btn>
      </div>
      <div class="leading">
        <div class="landing-title _3-XoE">
          Чтобы использовать WhatsApp:
        </div>
        <ol class="_2A31C">
          <li class="QtrYx">
            Откройте WhatsApp на своём телефоне
          </li>
          <li class="QtrYx">
            <span
              dir="ltr"
              class="i0jNr"
            >Нажмите <strong><span
              dir="ltr"
              class="i0jNr"
            >Меню <span class="_30yMe"><svg
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
            ><rect
              fill="#f2f2f2"
              height="24"
              rx="3"
              width="24"
            /><path
              d="m12 15.5c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5.675-1.5 1.5-1.5zm0-2c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm0-5c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5z"
              fill="#818b90"
            /></svg></span></span></strong> или <strong><span
              dir="ltr"
              class="i0jNr"
            >Настройки <span class="_30yMe"><svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
            ><rect
              fill="#F2F2F2"
              width="24"
              height="24"
              rx="3"
            /><path
              d="M12 18.69c-1.08 0-2.1-.25-2.99-.71L11.43 14c.24.06.4.08.56.08.92 0 1.67-.59 1.99-1.59h4.62c-.26 3.49-3.05 6.2-6.6 6.2zm-1.04-6.67c0-.57.48-1.02 1.03-1.02.57 0 1.05.45 1.05 1.02 0 .57-.47 1.03-1.05 1.03-.54.01-1.03-.46-1.03-1.03zM5.4 12c0-2.29 1.08-4.28 2.78-5.49l2.39 4.08c-.42.42-.64.91-.64 1.44 0 .52.21 1 .65 1.44l-2.44 4C6.47 16.26 5.4 14.27 5.4 12zm8.57-.49c-.33-.97-1.08-1.54-1.99-1.54-.16 0-.32.02-.57.08L9.04 5.99c.89-.44 1.89-.69 2.96-.69 3.56 0 6.36 2.72 6.59 6.21h-4.62zM12 19.8c.22 0 .42-.02.65-.04l.44.84c.08.18.25.27.47.24.21-.03.33-.17.36-.38l.14-.93c.41-.11.82-.27 1.21-.44l.69.61c.15.15.33.17.54.07.17-.1.24-.27.2-.48l-.2-.92c.35-.24.69-.52.99-.82l.86.36c.2.08.37.05.53-.14.14-.15.15-.34.03-.52l-.5-.8c.25-.35.45-.73.63-1.12l.95.05c.21.01.37-.09.44-.29.07-.2.01-.38-.16-.51l-.73-.58c.1-.4.19-.83.22-1.27l.89-.28c.2-.07.31-.22.31-.43s-.11-.35-.31-.42l-.89-.28c-.03-.44-.12-.86-.22-1.27l.73-.59c.16-.12.22-.29.16-.5-.07-.2-.23-.31-.44-.29l-.95.04c-.18-.4-.39-.77-.63-1.12l.5-.8c.12-.17.1-.36-.03-.51-.16-.18-.33-.22-.53-.14l-.86.35c-.31-.3-.65-.58-.99-.82l.2-.91c.03-.22-.03-.4-.2-.49-.18-.1-.34-.09-.48.01l-.74.66c-.39-.18-.8-.32-1.21-.43l-.14-.93a.426.426 0 00-.36-.39c-.22-.03-.39.05-.47.22l-.44.84-.43-.02h-.22c-.22 0-.42.01-.65.03l-.44-.84c-.08-.17-.25-.25-.48-.22-.2.03-.33.17-.36.39l-.13.88c-.42.12-.83.26-1.22.44l-.69-.61c-.15-.15-.33-.17-.53-.06-.18.09-.24.26-.2.49l.2.91c-.36.24-.7.52-1 .82l-.86-.35c-.19-.09-.37-.05-.52.13-.14.15-.16.34-.04.51l.5.8c-.25.35-.45.72-.64 1.12l-.94-.04c-.21-.01-.37.1-.44.3-.07.2-.02.38.16.5l.73.59c-.1.41-.19.83-.22 1.27l-.89.29c-.21.07-.31.21-.31.42 0 .22.1.36.31.43l.89.28c.03.44.1.87.22 1.27l-.73.58c-.17.12-.22.31-.16.51.07.2.23.31.44.29l.94-.05c.18.39.39.77.63 1.12l-.5.8c-.12.18-.1.37.04.52.16.18.33.22.52.14l.86-.36c.3.31.64.58.99.82l-.2.92c-.04.22.03.39.2.49.2.1.38.08.54-.07l.69-.61c.39.17.8.33 1.21.44l.13.93c.03.21.16.35.37.39.22.03.39-.06.47-.24l.44-.84c.23.02.44.04.66.04z"
              fill="#818b90"
            /></svg></span></span></strong> и выберите <strong>Связанные устройства</strong></span>
          </li>
          <li class="QtrYx">
            Наведите свой телефон на этот экран, чтобы считать код
          </li>
        </ol>
      </div>
    </div>

    <v-list>
      <template v-for="(item, itemIndex) in hostDevice">
        <v-divider
          v-if="itemIndex > 0"
          :key="'v-divider-' + itemIndex"
        />

        <v-list-item
          :key="'v-list-item-' + itemIndex"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Whatsapp extends Vue {
  whatsappQRCodeFake = 'data:image/png;base64,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'
  whatsappQRCode = null
  whatsappQRCodeVisible = true
  whatsappIsRunning = false
  whatsappClientStatus = {
    status: '',
    session: ''
  }

  hostDevice = []
  eventSource = new EventSource(`${process.env.VUE_APP_MS_WHATSAPP_ENDPOINT}/application/state`)
  eventSourceData = null

  public mounted () {
    this.eventSource.addEventListener('catch-qr', this.SSEWhatsappCatchQR);
    this.eventSource.addEventListener('client-status', this.SSEWhatsappClientStatus);
    this.eventSource.addEventListener('service-state', this.SSEWhatsappServiceState);
  }

  beforeDestroy () {
    this.eventSource.removeEventListener('catch-qr', this.SSEWhatsappCatchQR);
    this.eventSource.removeEventListener('client-status', this.SSEWhatsappClientStatus);
    this.eventSource.removeEventListener('service-state', this.SSEWhatsappServiceState);
    this.eventSource.close();
  }

  /**
   * Срабатывает каждый раз, когда микросервис меняет QR Code
   *
   * @param event
   * @private
   */
  private SSEWhatsappCatchQR (event: Event | MessageEvent) {
    this.whatsappQRCodeUpdate((event as MessageEvent).data);
  }

  /**
   * Срабатывает каждый раз, когда изменяется статус клиента
   * status = "autocloseCalled" | "browserClose" | "desconnectedMobile" | "inChat" | "isLogged"
   *
   * @param event
   * @private
   */
  private SSEWhatsappClientStatus (event: Event | MessageEvent) {
    this.whatsappClientStatus = JSON.parse((event as MessageEvent).data);
  }

  /**
   * Срабатывает каждый раз, когда изменяется статус клиента
   * status = "autocloseCalled" | "browserClose" | "desconnectedMobile" | "inChat" | "isLogged"
   *
   * @param event
   * @private
   */
  private SSEWhatsappServiceState (event: Event | MessageEvent) {
    const data = JSON.parse((event as MessageEvent).data || '{ "is_running": false }');

    this.hostDevice = [];

    this.whatsappIsRunning = !!data.is_running;

    if (data.is_running) {

      this.hostDevice.push({
        title: data.connected ? 'Да' : 'Нет',
        subtitle: 'Телефон подключен к сети интернет'
      });

      this.hostDevice.push({
        title: data.battery + ' %',
        subtitle: 'Уровень заряда батареи'
      });

      this.hostDevice.push({
        title: `${data.platform} / ${data.phone.os_version} / ${data.phone.os_build_number}`,
        subtitle: 'Платформа / Версия / Сборка'
      });

      this.hostDevice.push({
        title: `${data.phone.device_manufacturer} / ${data.phone.device_model}`,
        subtitle: 'Производитель / Модель'
      });

      this.hostDevice.push({
        title: data.phone.wa_version,
        subtitle: 'Версия установленного приложения WhatsApp'
      });
    }
  }

  private whatsappEnable () {
    this.$axios.get(`${process.env.VUE_APP_MS_WHATSAPP_ENDPOINT}/application/start`);
  }

  private whatsappDisable () {
    this.$axios.get(`${process.env.VUE_APP_MS_WHATSAPP_ENDPOINT}/application/stop`);
  }

  private whatsappQRCodeUpdate (qr: string) {
    this.whatsappQRCodeVisible = false;
    setTimeout(() => {
      this.whatsappQRCode = qr;
      this.whatsappQRCodeVisible = true;
    }, 300);
  }
}
</script>

<style lang="scss" scoped>
.whatsapp__page {
  padding: 15px 15px;
}

.whatsapp__box {
  display: flex;
  flex-grow: 1;
  align-items: start;
}

.leading {
  font-size: 18px;
  color: #414141;

  ol li {
    margin-bottom: 10px;
  }
}

.qr_code {
  width: 200px;
  height: 200px;
  border-style: solid;
  border-width: 1px;
  border-color: #bebebe;
  border-radius: 4px;
  padding: 4px;
}

.qr_code .qr {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 32px;
}

.qr_code__img-fake {
  //opacity: 0.4;
}
</style>
