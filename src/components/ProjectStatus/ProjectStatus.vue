<template>
  <div>
    <v-treeview
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      activatable
      item-key="name"
      open-on-click
      class="border-solid"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon
          v-if="item.type === 'group'"
          :color="item.color"
        >
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-checkbox-blank-circle
        </v-icon>
      </template>
      <template v-slot:append="{ item, open }">
        <v-icon
          v-if="item.type === 'group'"
          :color="item.color"
        >
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-checkbox-blank-circle
        </v-icon>
      </template>
    </v-treeview>
    <v-list>
      <v-list-item link class="border-dashed">
        <v-list-item-content>
          ADD
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      initiallyOpen: [],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      tree: [],
      items: [
        {
          name: 'Успешные',
          type: 'group',
          color: 'green',
          children: [
            {
              name: 'Элемент 1',
              type: 'status'
            },
            {
              name: 'Элемент 2',
              type: 'status'
            },
            {
              name: 'Элемент 3',
              type: 'status'
            }
          ]
        },

        {
          name: 'Неуспешные',
          type: 'group',
          color: 'red',
          children: [
            {
              name: 'Элемент 1',
              type: 'status'
            },
            {
              name: 'Элемент 2',
              type: 'status'
            },
            {
              name: 'Элемент 3',
              type: 'status'
            }
          ]
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
 .border {

   &-solid {
     border-color: #8d3eb1;
     border-style: solid;
     border-width: 1px !important;
   }

   &-dashed {
     border-color: #8d3eb1;
     border-style: dashed;
     border-width: 1px !important;
   }
 }
</style>
