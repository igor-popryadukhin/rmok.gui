<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Capabilities') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :loading="savingProcess"
          text
          tile
          small
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider />

    <template v-for="(item, key) in permissions">
      <v-checkbox
        :key="'v-checkbox-' + key"
        v-model="item.is_access"
        :label="item.name"
        hide-details
        dense
      />
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import { Watch } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import debounce from '@/utils/debounce'

@Component({
  components: { AppTable, AppLoading }
})
export default class UserCapabilities extends AppBase {
  savingProcess = false
  permissions = []

  get userPermissions () {
    return this.$store.getters['users_edit/permissions']
  }

  @Watch('userPermissions')
  userPermissionsWatchHandler (value: Array<Record<string, unknown>>) {
    this.permissions = value.map(e => { return { ...e } })
  }

  created () {
    this.userPermissionsWatchHandler = debounce(this.userPermissionsWatchHandler, 500)
  }

  mounted () {
    this.permissions = this.userPermissions.map(e => { return { ...e } })
  }

  private onBtnSaveClick () {
    this.savingProcess = true
    this.$axios.patch(`/users/${this.$route.params.user_id}`, {
      permissions: this.permissions.filter(value => value.is_access).map(value => value.id)
    }).then((response: AxiosResponse) => {
      if (response.status === 200) {
        this.$toast.success('Changes accepted')
      }
    }).finally(() => (this.savingProcess = false))
  }
}
</script>

<style scoped>

</style>
