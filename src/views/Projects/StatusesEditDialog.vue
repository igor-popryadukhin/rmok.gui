<template>
  <v-dialog
    v-model="visible"
    max-width="800"
  >
    <v-card
      tile
      flat
    >
      <v-card-text class="pt-10">
        <v-text-field
          v-model="nameSync"
          :error-messages="nameErrors"
          :label="$tc('Name')"
          dense
          outlined
          @input="$v.nameSync.$touch()"
          @blur="$v.nameSync.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-sheet
          v-if="actionsSync.length === 0"
          height="350"
          class="d-flex align-center justify-center"
        >
          <v-icon
            size="64"
            class="mr-2"
          >
            mdi-cube-send
          </v-icon>
          <span class="grey--text">
            Нет действий
          </span>
        </v-sheet>
        <template v-else>
          <v-tabs
            v-model="tab"
            height="35"
            show-arrows
          >
            <v-tab
              v-for="(item, key) in actionsSync"
              :key="key"
            >
              {{ item.title }}
              <v-btn
                color="red"
                class="ml-2 mr-n1"
                x-small
                icon
                @click="closeTab(item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="(item, key) in actionsSync"
              :key="key"
            >
              <v-sheet
                class="mt-2"
                height="400"
                flat
              >
                <template v-if="hasType(item.type)">
                  <component
                    :is="getComponentById(item.type)"
                    :key="`component-${key}`"
                    v-model="item.data"
                  />
                </template>
                <template v-else>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon
                      color="red"
                      class="mr-2"
                    >
                      mdi-bug
                    </v-icon>
                    <span class="grey--text">Нарушена структура, данных!</span>
                  </div>
                </template>
              </v-sheet>
            </v-tab-item>
          </v-tabs-items>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-menu>
          <template #activator="{ on, attrs }">
            <v-btn
              text
              tile
              v-bind="attrs"
              v-on="on"
            >
              {{ $tc('Add new action') }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in components"
              :key="item.id"
              link
              @click="addAction(item.action_template)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer />
        <v-btn
          text
          tile
          @click="clickCancelEmit"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="$v.$invalid"
          text
          tile
          @click="clickSaveEmit"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import StatusAction from '@/api/interfaces/StatusAction'
import AppBase from '@/AppBase'
import ActionBlank from '@/views/Projects/Action/ActionBlank.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop, PropSync, VModel } from 'vue-property-decorator'
import Vuelidate, { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

// eslint-disable-next-line no-use-before-define
@Component<StatusesEditDialog>({
  components: { ActionBlank },
  mixins: [validationMixin],
  validations: {
    nameSync: { required, maxLength: maxLength(255) }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.nameSync.$dirty) return errors
      !this.$v.nameSync.maxLength && errors.push('Name must be at most 255 characters long')
      !this.$v.nameSync.required && errors.push('Name is required.')
      return errors.map((e) => this.$tc(e))
    }
  }
})
export default class StatusesEditDialog extends AppBase {
  tab = null

  @Prop({ default: () => '' }) dialogTitle!: string
  @PropSync('name', { type: String }) nameSync!: string
  @PropSync('actions', { type: Array }) actionsSync!: StatusAction[]

  @VModel({ default: () => false }) visible!: boolean

  get components () {
    return [
      {
        id: 'create_task',
        title: 'Автозадача',
        component: () => new Promise((resolve) => {
          return import('./Action/ActionAutoTask.vue').then(resolve)
        }),
        action_template: {
          data: {
            type: 'task',
            unit: 'hour',
            value: '1',
            description: ''
          },
          type: 'create_task',
          title: 'Автозадача'
        }
      },
      {
        id: 'send_email',
        title: 'Отправить письмо на почту',
        component: () => new Promise((resolve) => {
          return import('./Action/ActionSendEmail.vue').then(resolve)
        }),
        action_template: {
          data: {},
          type: 'send_email',
          title: 'Отправить письмо на почту'
        }
      }
    ]
  }

  @Emit('click:save')
  clickSaveEmit () {
    this.visible = false
    return undefined
  }

  @Emit('click:cancel')
  clickCancelEmit () {
    this.visible = false
    return undefined
  }

  private hasType (id: string): boolean {
    return this.components.findIndex((e) => e.id === id) > -1
  }

  private getComponentById (id: string) {
    return this.components.find((e) => e.id === id).component
  }

  private addAction (template: StatusAction) {
    this.actionsSync.push({
      data: { ...template.data },
      type: template.type,
      title: template.title
    })
  }

  private closeTab (item: StatusAction) {
    const index = this.actionsSync.findIndex((e) => e.type === item.type)
    if (index > -1) {
      this.actionsSync.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
