<template>
  <div class="d-flex justify-center align-center fill-height">
    <div class="text-center">
      <div class="error-caption mb-5">
        {{ $tc('An error occurred while loading data.') }}
      </div>
      <v-btn
        :loading="loading"
        text
        tile
        small
        @click="reload"
      >
        {{ $tc('To retry') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class ContactsViewError extends Vue {
  loading = false

  private reload () {
    this.loading = true;
    this.$router.replace({
      name: 'contacts_view',
      params: this.$route.params
    }).finally(() => (this.loading = false));
  }
}
</script>

<style lang="scss" scoped>
 .error-caption {
   font-size: 24px;
   color: gray;
 }
</style>
