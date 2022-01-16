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
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

@Component({
  components: { AppLoading }
})
export default class ContactListMenuImport extends AppBase {
  get menuItems () {
    return [
      {
        title: this.$tc('Import from CSV'),
        subtitle: this.$tc('Text format'),
        icon: 'mdi-file-document-outline',
        icon_color: 'grey',
        format: 'csv'
      },
      {
        title: this.$tc('Import from Excel'),
        subtitle: this.$tc('Office Open XML (.xlsx, .xls) Excel 2007, Excel 97 and above'),
        icon: 'mdi-file-table-box-outline',
        icon_color: 'green',
        format: 'excel'
      }
    ]
  }

  private onMenuItemClick (format: string) {
    let accept = ''
    switch (format) {
      case 'csv': {
        accept = '.csv'
        break
      }
      case 'excel': {
        accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
        break
      }
    }

    this.$fileDialog
      .open({
        accept,
        multiple: false
      }).then((file) => {
        if (file instanceof File) {
          const formData = new FormData()
          formData.append('file', new Blob([file], { type: file.type }))

          this.$root.$emit('main-process-dialog-update', {
            message: this.$tc('Uploading a file to the server...'),
            progress: 0
          })
          $axios.post('/contacts/import', formData, {
            maxBodyLength: 5 * 1024 * 1024, // 5 MB
            onUploadProgress: (progressEvent: any) => {
              this.$root.$emit('main-process-dialog-update', {
                message: `${progressEvent.total} / ${progressEvent.loaded}`,
                progress: Math.floor((progressEvent.loaded * 100) / progressEvent.total)
              })
            }
          }).then((response: AxiosResponse) => {
            if (response.status === 202) {
              this.$root.$emit('main-process-dialog-show', {
                message: this.$tc('Please stand by...'),
                progress: 0
              })
            }
          }).catch((e: Error) => {
            this.$root.$emit('main-process-dialog-hide')
            this.$toast.error(e.message)
          })
        }
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
