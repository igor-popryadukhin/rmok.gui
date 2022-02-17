<template>
  <v-sheet>
    <template v-if="fetching">
      <div class="d-flex align-center justify-center fill-height">
        <app-loading />
      </div>
    </template>
    <template v-else>
      <template v-if="currentMessengers.name === 'Telegram'">
        <v-alert
          border="top"
          colored-border
          type="info"
          elevation="2"
        >
          Прежде чем работать с Telegram, вам необходимо получить собственный API ID и API HASH:
          <br>
          1. <a href="https://my.telegram.org/">Войдите в свою учетную запись Telegram</a>, используя номер телефона.
          <br>
          2. Щелкните по разделу Инструменты разработки API.
          <br>
          3. Появится окно Создать новое приложение . Заполните данные заявки. Нет необходимости вводить какой -либо URL -адрес , и только первые два поля ( название приложения и краткое имя ).
          <br>
          4. Нажмите « Создать приложение » в конце. Помните, что хэш вашего API является секретным, и Telegram не позволит вам его отозвать. Не публикуйте это нигде!
        </v-alert>
        <v-container
          class="mt-5"
          style="max-width: 500px"
        >
          <h3 class="grey--text">
            {{ $tc('Параметры подключения к Телеграмм') }}
          </h3>
          <v-divider class="mb-5" />
          <div class="mb-5">
            <v-text-field
              v-model="accountPhone"
              :label="$tc('Phone')"
              dense
              outlined
              flat
            />
            <v-text-field
              v-model="apiId"
              :label="$tc('API_ID')"
              dense
              outlined
              flat
            />
            <v-text-field
              v-model="apiHash"
              :label="$tc('API_HASH')"
              dense
              outlined
              flat
            />
          </div>
        </v-container>
      </template>

      <template v-if="currentMessengers.name === 'WhatsApp'">
        <v-container
          class="mt-5"
          style="max-width: 500px"
        >
          <h3 class="grey--text">
            {{ $tc('Параметры подключения к WhatsApp') }}
          </h3>
          <v-divider class="mb-5" />
          <v-text-field
            v-model="accountPhone"
            :label="$tc('Phone')"
            dense
            outlined
            flat
          />
        </v-container>
      </template>

      <template v-if="currentMessengers.name === 'Instagram'">
        <v-container
          class="mt-5"
          style="max-width: 500px"
        >
          <h3 class="grey--text">
            {{ $tc('Параметры подключения к Instagram') }}
          </h3>
          <v-divider class="mb-5" />
          <v-text-field
            v-model="accountPhone"
            :label="$tc('Phone')"
            dense
            outlined
            flat
          />
        </v-container>
      </template>
      <v-container
        v-if="!fetching"
        class="mt-5"
        style="max-width: 500px"
      >
        <div class="mb-5">
          <v-btn
            :loading="saveProcess"
            tile
            text
            outlined
            @click="integrationId ? onBtnChangeClick() : onBtnSaveClick()"
          >
            {{ $tc('Save change') }}
          </v-btn>
          <v-btn
            :loading="saveProcess"
            tile
            text
            outlined
            class="float-end"
          >
            {{ $tc('Запустить сессию') }}
          </v-btn>
        </div>
      </v-container>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import APIError from "@/api/classes/APIError";
import RolePermission from "@/api/interfaces/RolePermission";
import {ChatParamsIntegration} from "@/api/interfaces/ChatParamsIntegration";
import AppLoading from "@/components/AppLoading/AppLoading.vue";

@Component({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('chats/integrations/fetch_params', to.params.id)
    })
  }
})
export default class IntegrationsView extends Vue {
  saveProcess = false
  get fetching () { return this.$store.getters['chats/integrations/fetching'] }

  // Номер телефона владельца внешнего API
  get accountPhone () { return this.$store.getters['chats/integrations/account_phone'] }
  set accountPhone (val: string) { this.$store.commit('chats/integrations/account_phone', val) }

  get apiId () { return this.$store.getters['chats/integrations/api_id'] }
  set apiId (val: string) { this.$store.commit('chats/integrations/api_id', val) }

  get apiHash () { return this.$store.getters['chats/integrations/api_hash'] }
  set apiHash (val: string) { this.$store.commit('chats/integrations/api_hash', val) }


  // Текущий мессенджер по ID роута
  get currentMessengers () { return this.$store.state.chats.messengers.items.find((v) => v.id === this.$route.params.id) }

  // ID записи настроек интеграции
  get integrationId () { return this.$store.state.chats.integrations.id }

  /**
   * Создаем новые параметры для подключения к API
   * @private
   */
  private onBtnSaveClick () {

    const requestData: Record<string, unknown> = {}

    requestData.phone = this.accountPhone

    // Необязательные параметры например для WhatsApp не задаются
    if (this.apiId) { requestData.api_id = this.apiId }
    if (this.apiHash) { requestData.api_hash = this.apiHash }

    this.$axios
      .post(`/integrations/${this.$route.params.id}`, requestData)
      .then((response) => {
      if (response.status !== 200) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason: Error | APIError) => {
      if (reason instanceof APIError) {
        reason.errors.forEach((e) => {
          this.$toast.error(e.message)
        })
      } else {
        this.$toast.error(reason.message)
      }
    }).finally(() => (this.saveProcess = false))
  }

  /**
   * Изменения параметров подключения к API
   * @private
   */
  private onBtnChangeClick () {
    // Change params
    const requestData: Record<string, unknown> = {}

    requestData.phone = this.accountPhone

    // Необязательные параметры например для WhatApp не задаются
    if (this.apiId) { requestData.api_id = this.apiId }
    if (this.apiHash) { requestData.api_hash = this.apiHash }

    this.$axios
      .patch(`/integrations/${this.$route.params.id}`, requestData)
      .then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')
      }).catch((reason: Error | APIError) => {
      if (reason instanceof APIError) {
        reason.errors.forEach((e) => {
          this.$toast.error(e.message)
        })
      } else {
        this.$toast.error(reason.message)
      }
    }).finally(() => (this.saveProcess = false))
  }

  /**
   * Старт сессии API и переход на страницу верификации
   * @private
   */
  private onBtnSessionStartClick () {
    // TODO: Реализовать как будет внешний сервис
  }

  /**
   * Остановка сессии API
   * @private
   */
  private onBtnSessionStopClick () {
    // TODO: Реализовать как будет внешний сервис
  }

  /**
   * Удаление сессии API
   * @private
   */
  private onBtnSessionDeleteClick () {
    // TODO: Реализовать как будет внешний сервис
  }
}
</script>

<style scoped>

</style>
