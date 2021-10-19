<template>
  <v-sheet>
    <v-treeview
      v-if="items.length > 0"
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      item-key="id"
      item-children="statuses"
      open-on-click
      class="border-solid mb-2"
    >
      <template #prepend="{ item, open }">
        <v-icon
          v-if="item.statuses"
        >
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-checkbox-blank-circle
        </v-icon>
      </template>
      <template #append="append">
        <template
          v-if="append.item.statuses"
        >
          <v-btn
            icon
            :color="append.item.color"
            @click.stop="onGroupEditClick(append.item)"
          >
            <v-icon>
              mdi-pencil-box-outline
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click.stop="onGroupRemoveClick(append.item)"
          >
            <v-icon>
              mdi-minus
            </v-icon>
          </v-btn>
          <v-btn
            icon
            color="green"
            @click.stop="onStatusAddClick(append.item)"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <template
          v-else
        >
          <v-btn
            icon
            @click.stop="onStatusEditClick(append.item)"
          >
            <v-icon>
              mdi-pencil-box-outline
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click.stop="onStatusRemoveClick(append.item)"
          >
            <v-icon>
              mdi-minus
            </v-icon>
          </v-btn>
        </template>
      </template>
    </v-treeview>
    <div
      v-else
      class="blank d-flex align-center justify-center mb-2"
    >
      {{ $tc('Empty') }}
    </div>
    <div>
      <v-btn
        text
        @click="onGroupAddClick"
      >
        {{ $tc('Add group') }}
      </v-btn>
    </div>

    <project-status-dialog-group
      v-model="dialogGroup.visible"
      :name="dialogGroup.name"
      :color="dialogGroup.color"
      @save-click="onSaveGroupClick"
    />

    <project-status-dialog-status
      v-model="dialogStatus.visible"
      :name="dialogStatus.name"
      :actions="dialogStatus.actions"
      @save-click="onSaveStatusClick"
    />
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectStatusDialogGroup from './AppProjectStatusesDialogGroup.vue'
import ProjectStatusDialogStatus from './AppProjectStatusesDialogStatus.vue'
import { ActionInterface, StatusInterface } from './Interfaces'

interface GroupInterface {
  id: string | number;
  name: string;
  color: string;
  statuses: StatusInterface[];
  isNew?: boolean;
}

export default Vue.extend({
  name: 'AppProjectStatuses',

  components: {
    ProjectStatusDialogGroup,
    ProjectStatusDialogStatus
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    actions: {
      default: () => [],
      type: Array
    },
    value: {
      default: () => [],
      type: Array
    }
  },

  data () {
    return {
      currentGroup: null as unknown as GroupInterface,
      dialogGroup: {
        color: '',
        id: '' as number | string,
        name: '',
        visible: false
      },
      dialogStatus: {
        actions: [] as ActionInterface[],
        id: '' as number | string,
        name: '',
        selected: null,
        visible: false
      },
      initiallyOpen: [],
      items: [] as GroupInterface[],
      tree: []
    }
  },

  watch: {
    items: {
      deep: true,
      handler (value) {
        this.$emit('change', value)
      }
    },

    value (data: any) {
      this.items = data
    }
  },

  mounted () {
    this.items = this.value
  },

  methods: {

    onGroupAddClick () {
      this.dialogGroup.id = ''
      this.dialogGroup.name = ''
      this.dialogGroup.color = ''
      this.dialogGroup.visible = true
    },

    onGroupEditClick (item: GroupInterface) {
      this.dialogGroup.id = item.id
      this.dialogGroup.name = item.name
      this.dialogGroup.color = item.color
      this.dialogGroup.visible = true
    },

    onGroupRemoveClick (item: GroupInterface) {
      const index: number = this.items.findIndex((e: GroupInterface) => e.id === item.id)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    onSaveGroupClick ({ name, color }: any) {
      const index = this.items.findIndex((e: GroupInterface) => e.id === this.dialogGroup.id)
      if (index > -1) {
        this.items[index].name = name
        this.items[index].color = color
      } else {
        this.items.push({
          statuses: [],
          color,
          id: `group-${this.items.length}`,
          name
        })
      }

      this.dialogGroup.id = ''
      this.dialogGroup.name = ''
      this.dialogGroup.color = ''
    },

    /**
     * Срабатывает когда пользователь нажал на кнопу сохранения статуса.
     * @param status
     */
    onSaveStatusClick (status: StatusInterface) {
      let isEdit = false
      this.items.forEach((e: GroupInterface) => {
        const index = e.statuses.findIndex((status: StatusInterface) => status.id === this.dialogStatus.id)
        if (index > -1) {
          e.statuses[index].name = status.name
          e.statuses[index].actions = status.actions
          isEdit = true
        }
      })

      if (!isEdit) {
        this.items.forEach((group: GroupInterface) => {
          if (group.id === this.dialogGroup.id) {
            group.statuses.push({
              actions: status.actions,
              id: `status-${group.statuses.length}`,
              name: status.name
            })
          }
        })
      }
    },

    onStatusAddClick (item: GroupInterface) {
      this.dialogGroup.id = item.id
      this.dialogStatus.id = ''
      this.dialogStatus.name = ''
      this.dialogStatus.visible = true
      this.dialogStatus.actions = []
    },

    onStatusEditClick (item: StatusInterface) {
      this.dialogStatus.id = item.id
      this.dialogStatus.name = item.name
      this.dialogStatus.actions = item.actions
      this.dialogStatus.visible = true
    },

    onStatusRemoveClick (item: StatusInterface) {
      this.items.forEach((element: any, i: number) => {
        const index: number = element.statuses.findIndex((e: any) => e.id === item.id)
        if (index > -1) {
          this.items[i].statuses.splice(index, 1)
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.blank {
  height: 50px;
  width: 100%;
}
.border {

  &-solid {
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
