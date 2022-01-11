<template>
  <v-sheet>
    <v-container
      class="mt-5"
      style="max-width: 768px"
    >
      <v-sheet
        height="400"
        class="overflow-auto mb-3"
        outlined
      >
        <div
          v-if="statuses.length === 0"
          class="d-flex align-center justify-center fill-height"
        >
          <span class="grey--text">Нет статусов</span>
        </div>
        <v-treeview
          v-else
          :items="statuses"
          item-key="id"
          item-children="children"
          open-on-click
        >
          <template #prepend="{ item, open }">
            <v-icon
              v-if="item.children"
            >
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              mdi-checkbox-blank-circle
            </v-icon>
          </template>
          <template #append="append">
            <template
              v-if="append.item.children"
            >
              <v-btn
                :color="append.item.color"
                icon
                @click.stop="onBtnStatusGroupEditClick(append.item.id)"
              >
                <v-icon>
                  mdi-pencil-box-outline
                </v-icon>
              </v-btn>
              <v-btn
                icon
                @click.stop="onBtnStatusGroupDeleteClick(append.item.id)"
              >
                <v-icon>
                  mdi-minus
                </v-icon>
              </v-btn>
              <v-btn
                :color="append.item.color"
                icon
                @click.stop="onBtnStatusAddClick(append.item.id)"
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
                :disabled="processLoadingStatusId !== append.item.id && processLoadingStatusId > 0"
                :loading="processLoadingStatusId === append.item.id"
                icon
                @click.stop="onBtnStatusEditClick(append.item.id)"
              >
                <v-icon>
                  mdi-pencil-box-outline
                </v-icon>
              </v-btn>
              <v-btn
                icon
                @click.stop="onBtnStatusDeleteClick(append.item.id)"
              >
                <v-icon>
                  mdi-minus
                </v-icon>
              </v-btn>
            </template>
          </template>
        </v-treeview>
      </v-sheet>

      <div class="mb-3">
        <v-btn
          tile
          text
          outlined
          @click="onBtnStatusGroupAddClick"
        >
          {{ $tc('Add') }}
        </v-btn>
      </div>

      <div class="mb-16" />
    </v-container>

    <statuses-group-edit-dialog
      v-model="statusesGroupDialog.visible"
      :name.sync="statusesGroupDialog.fields.name"
      :color.sync="statusesGroupDialog.fields.color"
      @click:save="onBtnStatusGroupDialogSaveClick"
    />

    <statuses-edit-dialog
      v-model="statusesDialog.visible"
      :name.sync="statusesDialog.name"
      :actions.sync="statusesDialog.actions"
      @click:save="onBtnStatusSaveDialogClick"
    />
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import StatusGroup from '@/api/interfaces/StatusGroup'
import AppBase from '@/AppBase'
import { loadLanguageAsync } from '@/plugins/i18n'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import StatusesEditDialog from '@/views/Projects/StatusesEditDialog.vue'
import StatusesGroupEditDialog from './StatusesGroupEditDialog.vue'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ProjectsViewStatuses>({
  components: { StatusesEditDialog, StatusesGroupEditDialog, ProjectsTools, ProjectsItems },
  beforeRouteEnter (to, from, next) {
    loadLanguageAsync('ru', 'messages')
      .finally(() => {
        next()
      })
  }
})
export default class ProjectsViewStatuses extends AppBase {
  statusesGroupDialog = {
    visible: false,
    id: 0,
    fields: {
      name: '',
      color: ''
    }
  }

  statusesDialog = {
    visible: false,
    status_id: 0,
    group_id: 0,
    name: '',
    actions: []
  }

  processLoadingStatusId = 0

  get statuses (): StatusGroup[] {
    return this.$store.getters['projects/view/project_statuses']
  }

  set statuses (value: StatusGroup[]) {
    this.$store.commit('projects/view/project_statuses', value)
  }

  private onBtnStatusDeleteClick (id: number) {
    this.$axios.delete(`/projects/statuses/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')

        const statuses: StatusGroup[] = JSON.parse(JSON.stringify(this.statuses))

        for (let i = 0; i < statuses.length; i++) {
          for (let j = 0; j < statuses[i].children.length; j++) {
            if (statuses[i].children[j].id === id) {
              statuses[i].children.splice(j, 1)
            }
          }
        }

        this.statuses = statuses
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
  }

  /**
   *
   * @param id Идентификатор статуса группы
   * @private
   */
  private onBtnStatusAddClick (id: number) {
    this.statusesDialog.status_id = 0
    this.statusesDialog.group_id = id
    this.statusesDialog.name = ''
    this.statusesDialog.actions = []
    this.statusesDialog.visible = true
  }

  /**
   *
   * @param id Идентификатор статуса
   * @private
   */
  private onBtnStatusEditClick (id: number) {
    const statuses: StatusGroup[] = JSON.parse(JSON.stringify(this.statuses))

    let isBreak = false
    for (let i = 0; i < statuses.length; i++) {
      for (let j = 0; j < statuses[i].children.length; j++) {
        if (id === statuses[i].children[j].id) {
          this.statusesDialog.status_id = statuses[i].children[j].id
          this.statusesDialog.name = statuses[i].children[j].name
          this.statusesDialog.actions = statuses[i].children[j].actions
          this.statusesDialog.visible = true

          isBreak = true
          break
        }
      }
      if (isBreak) {
        break
      }
    }
  }

  private onBtnStatusSaveDialogClick () {
    this.statusesDialog.visible = false

    const statuses: StatusGroup[] = JSON.parse(JSON.stringify(this.statuses))

    let statusGroupIndex = -1
    let statusIndex = -1
    let isBreak = false
    for (let i = 0; i < statuses.length; i++) {
      if (this.statusesDialog.group_id === statuses[i].id) {
        statusGroupIndex = i
      }
      for (let j = 0; j < statuses[i].children.length; j++) {
        if (this.statusesDialog.status_id === statuses[i].children[j].id) {
          statusGroupIndex = i
          statusIndex = j
          isBreak = true
          break
        }
      }
      if (isBreak) {
        break
      }
    }

    if (statusGroupIndex > -1 && statusIndex > -1) {
      statuses[statusGroupIndex].children[statusIndex].name = this.statusesDialog.name
      statuses[statusGroupIndex].children[statusIndex].actions = this.statusesDialog.actions

      this.statuses = statuses

      this.$axios.patch(`/projects/statuses/${this.statusesDialog.status_id}`, {
        name: this.statusesDialog.name,
        actions: this.statusesDialog.actions
      }).then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')

        this.statusesDialog.group_id = 0
        this.statusesDialog.status_id = 0
        this.statusesDialog.name = ''
        this.statusesDialog.actions = []
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
    } else if (statusGroupIndex > -1) {
      // Создаю новый статус
      this.$axios.post('/projects/statuses', {
        name: this.statusesDialog.name,
        group_id: this.statusesDialog.group_id,
        actions: this.statusesDialog.actions,
        project_id: +this.$route.params.id
      }).then((response) => {
        if (response.status !== 201) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')

        statuses[statusGroupIndex].children.push({
          id: +response.data.id,
          name: this.statusesDialog.name,
          actions: this.statusesDialog.actions
        })

        this.statuses = statuses

        this.statusesDialog.group_id = 0
        this.statusesDialog.status_id = 0
        this.statusesDialog.name = ''
        this.statusesDialog.actions = []
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
    } else {
      this.$toast.error('An error occurred while saving the status')
    }
  }

  private onBtnStatusGroupDeleteClick (id: number) {
    this.$axios.delete(`/projects/statuses/groups/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')

        const statuses: StatusGroup[] = JSON.parse(JSON.stringify(this.statuses))
        const index = statuses.findIndex((e) => e.id === id)
        if (index > -1) {
          statuses.splice(index, 1)
          this.statuses = statuses
        }
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
  }

  private onBtnStatusGroupAddClick () {
    this.statusesGroupDialog.id = 0
    this.statusesGroupDialog.fields.name = ''
    this.statusesGroupDialog.fields.color = ''
    this.statusesGroupDialog.visible = true
  }

  private onBtnStatusGroupEditClick (id: number) {
    const index = this.statuses.findIndex((e) => e.id === id)
    if (index > -1) {
      const statusGroup = { ...this.statuses[index] }
      this.statusesGroupDialog.id = id
      this.statusesGroupDialog.fields.name = statusGroup.name
      this.statusesGroupDialog.fields.color = statusGroup.color

      this.statusesGroupDialog.visible = true
    }
  }

  /**
   * Срабатывает при добавлении/создании группы статусов.
   *
   * @private
   */
  private onBtnStatusGroupDialogSaveClick () {
    // Обязательно делаем копию
    const statuses: StatusGroup[] = JSON.parse(JSON.stringify(this.statuses))

    // Нахожу элемент группы статуса
    const index = statuses.findIndex((e) => e.id === this.statusesGroupDialog.id)

    if (index > -1) {
      statuses[index].name = this.statusesGroupDialog.fields.name
      statuses[index].color = this.statusesGroupDialog.fields.color

      // Заменяю во Vuex
      this.statuses = statuses

      // Изменение старой
      this.$axios.patch(`/projects/statuses/groups/${this.statusesGroupDialog.id}`, {
        ...this.statusesGroupDialog.fields
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          this.$toast.success('Changes accepted')

          this.statusesGroupDialog.id = 0
          this.statusesGroupDialog.fields.name = ''
          this.statusesGroupDialog.fields.color = ''
        }).catch((reason) => {
          if (reason instanceof APIError) {
            reason.errors.forEach((e) => {
              this.$toast.error(e.message)
            })
          } else {
            this.$toast.error(reason.message)
          }
        })
    } else {
      // Новая группа
      this.$axios.post('/projects/statuses/groups', {
        project_id: this.$route.params.id,
        ...this.statusesGroupDialog.fields
      }).then((response) => {
        if (response.status !== 201) {
          throw new APIError(response.data)
        }

        statuses.push({
          id: response.data.id,
          name: this.statusesGroupDialog.fields.name,
          color: this.statusesGroupDialog.fields.color,
          children: []
        })

        // Заменяю во Vuex
        this.statuses = statuses

        this.statusesGroupDialog.id = 0
        this.statusesGroupDialog.fields.name = ''
        this.statusesGroupDialog.fields.color = ''
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message)
          })
        } else {
          this.$toast.error(reason.message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
