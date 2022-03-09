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
import AppBase from '@/AppBase'

import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

@Component
export default class ContactsAllMenuExport extends AppBase {
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

  get contactsListItemsSelected (): number[] {
    return ((this.$store.getters['contacts/contacts_all/items_selected'] || []) as Array<Record<'id', number>>).map((e) => e.id)
  }

  private onMenuItemClick (format: string) {
    let request: Record<string, unknown> = {
      ids: this.contactsListItemsSelected
    }

    request.format = format

    $axios.post('/contacts/export', request, { responseType: 'blob' })
      .then((response: AxiosResponse) => {
        const type = response.headers['content-type']
        const objectUrl = window.URL.createObjectURL(new Blob([response.data], { type }))
        window.open(objectUrl);
      }).catch((e: Error) => {
        this.$toast.error(e.message)
      })
  }
}
</script>

<style lang="scss">
</style>
