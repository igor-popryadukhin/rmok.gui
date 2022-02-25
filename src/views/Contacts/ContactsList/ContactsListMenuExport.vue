<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
      />
    </template>
    <v-list
      class="py-0"
      tile
    >
      <template v-for="(item, key) in menuItems">
        <v-list-item
          :key="'v-list-item-'+key"
          link
          @click="onMenuItemClick(item.format)"
        >
          <v-list-item-icon>
            <v-icon :color="item.icon_color">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="'v-divider-'+key" />
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

@Component({
  components: { AppLoading }
})
export default class ContactsListMenuImport extends AppBase {
  get menuItems () {
    // "xls", "xlsx", "ods", "csv", "html", "tcpdf", "dompdf", "mpdf"
    return [
      {
        title: this.$tc('Export to CSV'),
        subtitle: this.$tc('Text format'),
        icon: 'mdi-file-document-outline',
        icon_color: 'grey',
        format: 'csv'
      },
      {
        title: this.$tc('Export to HTML'),
        subtitle: this.$tc('Text format'),
        icon: 'mdi-file-document-outline',
        icon_color: 'grey',
        format: 'html'
      },
      {
        title: this.$tc('Export to Excel'),
        subtitle: this.$tc('Office Open XML (.xlsx, .xls) Excel 2007, Excel 97 and above'),
        icon: 'mdi-file-table-box-outline',
        icon_color: 'green',
        format: 'xlsx'
      }
    ]
  }

  get contactsListSelectedAll (): boolean { return this.$store.getters['contacts/list/selected_all'] }
  get contactsListItemsSelected () { return this.$store.getters['contacts/list/items_selected'] }
  get contactFilter () {
    const params: Record<string, unknown> = this.$store.getters['contacts/list/filter/all']

    if ('offset' in params) { delete params.offset }
    if ('count' in params) { delete params.count }
    if ('order_by' in params) { delete params.order_by }
    if ('order_direction' in params) { delete params.order_direction }

    return params
  }

  private onMenuItemClick (format: string) {
    let request: Record<string, unknown> = {}

    if (this.contactsListSelectedAll) {
      // На основе фильтров
      request = this.contactFilter
    } else {
      request = {
        // На основе идентификаторов контактов
        ids: this.contactsListItemsSelected
      }
    }

    request.format = format

    $axios.post('/contacts/export', request)
      .then((response: AxiosResponse) => {
        if (![200, 202].includes(response.status)) {
          throw new APIError(response.data)
        }

        this.$root.$emit('main-process-dialog-show', {
          message: this.$tc('Please stand by...'),
          progress: 0
        })
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      })
  }
}
</script>

<style lang="scss">

</style>

<i18n>
{
  "ru": {}
}
</i18n>
