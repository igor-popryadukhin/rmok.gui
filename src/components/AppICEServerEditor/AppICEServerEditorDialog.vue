<template>
  <div>
    <slot
      name="activator"
      :on="{ click: activatorOnClick }"
    />
    <template v-if="dialogComponent">
      <v-dialog
        v-model="dialogVisible"
        max-width="600"
      >
        <component
          :is="dialogComponent"
          :urls.sync="urlsModel"
          :username.sync="usernameModel"
          :credential.sync="credentialModel"
          @click:cancel="dialogVisible = false"
          @click:save="clickSave"
        />
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop } from 'vue-property-decorator'

@Component
export default class AppICEServerDialogEditor extends Vue {
  dialogComponent = null
  dialogVisible = false

  urlsModel = ''
  usernameModel = ''
  credentialModel = ''

  @Prop({ default: () => '', type: String }) urls!: string
  @Prop({ default: () => '', type: String }) username!: string
  @Prop({ default: () => '', type: String }) credential!: string

  @Emit('click:save')
  clickSave () {
    this.dialogVisible = false
    return {
      urls: this.urlsModel,
      username: this.usernameModel,
      credential: this.credentialModel
    }
  }

  private activatorOnClick () {
    this.urlsModel = this.urls
    this.usernameModel = this.username
    this.credentialModel = this.credential

    this.dialogComponent = () => new Promise((resolve) => {
      return import(/* webpackChunkName: "app-i-c-e-server-editor-dialog" */ './AppICEServerEditor.vue')
        .then(resolve)
        .finally(() => (this.dialogVisible = true))
    })
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n>
{
  "ru" : {
    "Possible options, separated by commas: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302": "Возможные варианты через запятую: stun:stun.a.google.com:19302, stun:stun.b.google.com:19302",
    "ICE server": "ICE сервер",
    "ICE servers": "ICE серверы"
  }
}
</i18n>
