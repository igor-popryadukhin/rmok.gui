<template>
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
            v-model="statusName"
            :tabindex="0"
            :label="$tc('Status name')"
            autofocus
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
                :color="$vuetify.theme.currentTheme.primary"
                v-bind="attrs"
                v-on="on"
                tile
                text
                small
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
        >
          <keep-alive>
            <component
              v-model="item.data"
              :is="item.component"
              :key="`component-${index}`"
            />
          </keep-alive>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        :color="$vuetify.theme.currentTheme.error"
        text
        tile
        small
        @click="onBtnCancelClick"
      >
        {{ $tc('Cancel') }}
      </v-btn>

      <v-btn
        :color="$vuetify.theme.currentTheme.primary"
        text
        tile
        small
        @click="onBtnSaveClick"
      >
        {{ $tc('Save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ActionInterface } from './Interfaces'

interface IProps {
  [key: string]: any;
}

interface IData {
  actionTab: number;
  availableActions: ActionInterface[];
  currentActions: ActionInterface[];
  statusName: string;
  statusActions: ActionInterface[];
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'AppStatusDialogEditor',
  model: {
    event: 'change',
    prop: 'value'
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

    handler: Function
  },

  data (): IData {
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
      statusName: '',
      statusActions: []
    }
  },

  watch: {
    statusActions (items: ActionInterface[]) {
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

    name (val: string) {
      this.status.name = val
    }
  },

  mounted () {
    this.statusName = this.name
    this.statusActions = this.actions
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
        component: () => import(/* webpackPrefetch: false, webpackPreload: false  */'./actions/' + item.component + '.vue'),
        data: null,
        title: item.title,
        type: item.type
      })
    },

    onBtnCancelClick () {
      if (typeof this.handler !== 'function') {
        return
      }

      this.handler('cancel')
    },

    onBtnSaveClick () {
      if (typeof this.handler !== 'function') {
        return
      }

      this.handler('save', {
        name: this.statusName,
        actions: this.currentActions
      })
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
