<template>
  <div class="d-flex justify-center align-center fill-height">
    <div class="text-center">
      <div class="error-caption mb-5">
        {{ $tc('Contact not found.') }}
      </div>
      <div class="d-flex">
        <v-btn
          text
          tile
          small
          @click="$router.replace({ name: 'contacts' })"
        >
          {{ $tc('To find') }}
        </v-btn>
        <v-btn
          :loading="retryLoading"
          text
          tile
          small
          @click="toRetry"
        >
          {{ $tc('To retry') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ContactsViewNotFound extends Vue {
  retryLoading = false

  /**
   * @private
   */
  private toRetry () {
    this.retryLoading = true
    this.$router.replace({
      name: 'contacts_view',
      params: this.$route.params
    }).finally(() => (this.retryLoading = false))
  }
}
</script>

<style lang="scss" scoped>
.error-caption {
  font-size: 24px;
  color: gray;
}
</style>
