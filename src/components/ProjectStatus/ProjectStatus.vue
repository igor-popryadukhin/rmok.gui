<template>
  <div>
    <v-treeview
      v-if="items.length > 0"
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      open-all
      item-key="name"
      open-on-click
      class="border-solid mb-2"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon
          v-if="'children' in item"
        >
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-checkbox-blank-circle
        </v-icon>
      </template>
      <template v-slot:append="append">
        <template
          v-if="'children' in append.item"
        >
          <v-btn
            icon
            :color="append.item.color"
            @click.stop="onGroupEditClick(append.item)"
          >
            <v-icon
            >
              mdi-pencil-box-outline
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click.stop="onGroupRemoveClick(append.item)"
          >
            <v-icon
            >
              mdi-minus
            </v-icon>
          </v-btn>
          <v-btn
            icon
            color="green"
            @click.stop="onStatusAddClick(append.item)"
          >
            <v-icon
            >
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
            <v-icon
            >
              mdi-pencil-box-outline
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click.stop="onStatusRemoveClick(append.item)"
          >
            <v-icon
            >
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
      @save-click="onSaveStatusClick"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectStatusDialogGroup from './ProjectStatusDialogGroup.vue'
import ProjectStatusDialogStatus from './ProjectStatusDialogStatus.vue'

interface StatusInterface {
  id: string | number;
  name: string;
}

interface GroupInterface {
  id: string | number;
  name: string;
  color: string;
  children: StatusInterface[]
}

export default Vue.extend({
  components: {
    ProjectStatusDialogGroup,
    ProjectStatusDialogStatus
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: {
      type: Array,
      default: () => null
    }
  },

  data () {
    return {
      dialogGroup: {
        visible: false,
        id: '' as number | string,
        name: '',
        color: ''
      },
      dialogStatus: {
        selected: null,
        visible: false,
        id: '' as number | string,
        name: ''
      },
      currentGroup: null as GroupInterface | any,
      initiallyOpen: [],
      tree: [],
      items: [] as GroupInterface[]
    }
  },

  watch: {
    items: {
      handler (value) {
        this.$emit('change', value)
      },
      deep: true
    }
  },

  methods: {

    generateUUID () {
      let d = new Date().getTime()
      let d2 = (performance && performance.now && (performance.now() * 1000)) || 0// Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16// random number between 0 and 16
        if (d > 0) { // Use timestamp until depleted
          r = (d + r) % 16 | 0
          d = Math.floor(d / 16)
        } else { // Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0
          d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    },

    onSaveGroupClick ({ name, color }: any) {
      const index = this.items.findIndex((e: GroupInterface) => e.id === this.dialogGroup.id)
      if (index > -1) {
        this.items[index].name = name
        this.items[index].color = color
      } else {
        this.items.push({
          id: this.generateUUID(),
          name,
          color,
          children: []
        })
      }

      this.dialogGroup.id = ''
      this.dialogGroup.name = ''
      this.dialogGroup.color = ''
    },

    onGroupRemoveClick (item: GroupInterface) {
      const index: number = this.items.findIndex((e: StatusInterface) => e.id === item.id)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

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

    onStatusRemoveClick (item: StatusInterface) {
      this.items.forEach((element: any, i: number) => {
        const index: number = element.children.findIndex((e: any) => e.id === item.id)
        if (index > -1) {
          this.items[i].children.splice(index, 1)
        }
      })
    },

    onSaveStatusClick (name: string) {
      let isEdit = false
      this.items.forEach((group: GroupInterface) => {
        const index = group.children.findIndex((status: StatusInterface) => status.id === this.dialogStatus.id)
        if (index > -1) {
          group.children[index].name = name
          isEdit = true
        }
      })

      if (!isEdit) {
        this.items.forEach((group: GroupInterface) => {
          if (group.id === this.dialogGroup.id) {
            group.children.push({
              id: this.generateUUID(),
              name
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
    },

    onStatusEditClick (item: StatusInterface) {
      this.dialogStatus.id = item.id
      this.dialogStatus.name = item.name
      this.dialogStatus.visible = true
    }
  }
})
</script>

<style lang="scss" scoped>
.blank {
  height: 50px;
  width: 100%;
  border: #9C27B0 1px dashed;
}
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
