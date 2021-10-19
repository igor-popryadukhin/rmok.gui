<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="920"
  >
    <v-card>
      <v-card-text class="pt-5">
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="4"
            xl="4"
          >
            <v-text-field
              v-model="status.name"
              :tabindex="0"
              autofocus
              :label="$tc('Status name')"
              @keyup.enter="save(status)"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="4"
            xl="4"
          >
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  text
                  outlined
                  v-on="on"
                >
                  {{ $tc('Available actions') }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in availableActions"
                  :key="index"
                  @click="onAddActionClick(item)"
                >
                  <v-list-item-title>{{ $tc(item.title) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text
        v-if="dialogVisible"
        class="py-0 mb-4"
      >
        <v-tabs
          v-model="actionTab"
        >
          <v-tab
            v-for="(actionItem, actionItemIndex) in currentActions"
            :key="actionItemIndex"
          >
            {{ actionItem.title }}
            <v-btn
              class="ml-2"
              color="red"
              icon
              x-small
              @click.stop="currentActions.splice(actionItemIndex, 1)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>

        <v-tabs-items
          v-model="actionTab"
        >
          <v-tab-item
            v-for="(item, index) in currentActions"
            :key="index"
            transition="fade-transition"
            reverse-transition="fade-transition"
          >
            <component
              :is="item.component"
              :key="`component-${index}`"
              v-model="item.data"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="red darken-1"
          text
          @click="dialogVisible = false"
        >
          {{ $tc('Cancel') }}
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="save(status)"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ActionInterface, StatusInterface } from './Interfaces'

interface Props {
  [key: string]: any;
}

interface Data {
  actionTab: number;
  availableActions: ActionInterface[];
  currentActions: ActionInterface[];
  status: StatusInterface;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'AppProjectStatusesDialogStatus',

  model: {
    event: 'change',
    prop: 'value'
  },
  data (): Data {
    return {

      actionTab: 0,
      /*
        Доступные действия
        Добавь новый объект.
        Объект должен реализовать ActionInterface
      */
      availableActions: [
        {
          component: 'ATask',
          data: null,
          title: 'Автозадача',
          type: 'create_task'
        },
        {
          component: 'ASendEmail',
          data: null,
          title: 'Отправить Email',
          type: 'send_email'
        }
      ] as ActionInterface[],
      currentActions: [] as ActionInterface[],

      dialogVisible: false,
      status: {
        actions: [] as ActionInterface[],
        name: ''
      } as StatusInterface
    }
  },

  methods: {

    formReset () {
      this.status.name = ''
      this.status.actions = []
    },

    /**
     * Срабатывает когда пользователь кликнул на кнопку добавить действие
     * @param item
     */
    onAddActionClick (item: ActionInterface) {
      this.currentActions.push({
        component: () => import(
          /* webpackPrefetch: false, webpackPreload: false  */
          './actions/ATask.vue'
        ),
        data: null,
        title: item.title,
        type: item.type
      })
    },

    save (status: StatusInterface) {
      this.$emit('save-click', status)
      this.dialogVisible = false
      this.formReset()
    }
  },

  props: {
    actions: {
      default: () => [],
      type: Array as PropType<ActionInterface[]>
    },

    name: {
      default: '',
      type: String
    },
    value: Boolean
  },

  watch: {
    actions (items: ActionInterface[]) {
      const actions: ActionInterface[] = []
      for (let i = 0; i < items.length; i++) {
        const action: ActionInterface = items[i]
        const index = this.availableActions.findIndex((e: ActionInterface) => e.type === action.type)
        if (index > -1) {
          const component: string = this.availableActions[index].component

          action.title = this.availableActions[index].title
          action.type = this.availableActions[index].type
          action.component = () => new Promise(resolve => import(/* webpackPrefetch: false, webpackPreload: false  */ `./actions/${component}.vue`).then(resolve))

          actions.push(action)
        }
      }
      this.currentActions = actions
    },

    currentActions: {
      deep: true,
      handler (actions: ActionInterface[]) {
        // Очищаю от ненужных данных...
        this.status.actions = actions.map((value: ActionInterface) => {
          return {
            data: value.data,
            title: value.title,
            type: value.type
          }
        })
      }
    },

    dialogVisible (val) {
      this.$emit('change', val)
    },

    name (val: string) {
      this.status.name = val
    },

    value (val: boolean) {
      this.dialogVisible = val
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
