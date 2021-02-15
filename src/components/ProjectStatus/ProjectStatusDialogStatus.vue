<template>
  <v-dialog
    v-model="dialogVisible"
    fullscreen
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
            ></v-text-field>
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
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  text
                  outlined
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
              v-model="item.data"
              :is="item.component"
              :key="`component-${index}`"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-footer class="py-4" absolute>
        <v-spacer></v-spacer>

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
      </v-footer>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ActionInterface, StatusInterface } from './Interfaces'

interface IProps {
  [key: string]: any;
}

interface IData {
  actionTab: number;
  availableActions: ActionInterface[];
  currentActions: ActionInterface[];
  status: StatusInterface;
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    name: {
      type: String,
      default: ''
    },

    actions: {
      type: Array as PropType<ActionInterface[]>,
      default: () => []
    },
    value: Boolean
  },

  data (): IData {
    return {
      /*
        Доступные действия
        Добавь новый объект.
        Объект должен реализовать ActionInterface
      */
      availableActions: [
        {
          title: 'Автозадача',
          type: 'create_task',
          component: 'ATask',
          data: null
        },
        {
          title: 'Отправить Email',
          type: 'send_email',
          component: 'ASendEmail',
          data: null
        }
      ] as ActionInterface[],
      currentActions: [] as ActionInterface[],
      actionTab: 0,

      dialogVisible: false,
      status: {
        name: '',
        actions: [] as ActionInterface[]
      } as StatusInterface
    }
  },

  watch: {
    name (val: string) {
      this.status.name = val
    },

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

    value (val: boolean) {
      this.dialogVisible = val
    },

    dialogVisible (val) {
      this.$emit('change', val)
    },

    currentActions: {
      handler (actions: ActionInterface[]) {
        // Очищаю от ненужных данных...
        this.status.actions = actions.map((value: ActionInterface) => {
          return {
            title: value.title,
            type: value.type,
            data: value.data
          }
        })
      },
      deep: true
    }
  },

  methods: {

    /**
     * Срабатывает когда пользователь кликнул на кнопку добавить действие
     * @param item
     */
    onAddActionClick (item: ActionInterface) {
      this.currentActions.push({
        title: item.title,
        type: item.type,
        component: () => import(
          /* webpackPrefetch: false, webpackPreload: false  */
          './actions/ATask.vue'
        ),
        data: null
      })
    },

    save (status: StatusInterface) {
      this.$emit('save-click', status)
      this.dialogVisible = false
      this.formReset()
    },

    formReset () {
      this.status.name = ''
      this.status.actions = []
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
