<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Statuses') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :loading="processLoadingData"
          tile
          outlined
          small
          @click="fetchProjectStatuses"
        >
          {{ $tc('Refresh') }}
        </v-btn>
      </template>
    </app-tools>

    <v-divider />

    <template v-if="processLoadingData">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-treeview
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
              :disabled="processLoadingStatusGroupId !== append.item.id && processLoadingStatusGroupId > 0"
              :loading="processLoadingStatusGroupId === append.item.id"
              :color="append.item.color"
              icon
              @click.stop="onBtnStatusGroupEditClick(append.item.id)"
            >
              <v-icon>
                mdi-pencil-box-outline
              </v-icon>
            </v-btn>
            <v-btn
              :disabled="processLoadingStatusGroupId !== append.item.id && processLoadingStatusGroupId > 0"
              icon
              @click.stop="onBtnStatusGroupRemoveClick(append.item.id)"
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

      <v-divider />

      <div class="d-flex py-2">
        <v-spacer />
        <v-btn
          tile
          text
          small
          @click="onBtnAddNewGroupClick"
        >
          {{ $tc('Add group') }}
        </v-btn>
      </div>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppStatusDialogEditor from '@/components/AppStatusDialogEditor/AppStatusDialogEditor.vue'
import AppStatusGroupDialogEditor from '@/components/AppStatusGroupDialogEditor/AppStatusGroupDialogEditor.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'ProjectEditStatuses',
  components: { AppTools, AppLoading },

  data () {
    return {
      processLoadingData: false,
      processOfSaving: false,
      processLoadingStatusGroupId: -1,
      processLoadingStatusId: -1,
      statusesTree: null,
      statuses: [],
      newStatuses: []
    }
  },

  computed: {
    /** Идентификатор редактируемого проекта */
    projectId (): number {
      return +this.$route.params.project_id
    }
  },

  async mounted () {
    await this.fetchProjectStatuses()
    this.$watch('statuses', (val: any) => {
      console.log(val)
    }, { deep: true })
  },

  methods: {
    /**
     * Событие, генерируется при нажатии на кнопку "добавить группу"
     */
    async onBtnAddNewGroupClick () {
      const dialogInstance = await this.$dialog.show(AppStatusGroupDialogEditor, {
        waitForResult: false,
        showClose: false,
        actions: {
          cancel: {
            attrs: {
              text: this.$tc('Cancel'),
              value: 'cancel'
            },
            on: {
              click: () => (dialogInstance.close())
            }
          },
          ok: {
            attrs: {
              text: this.$tc('Save'),
              value: 'save'
            }
          }
        },
        handlers: (data: unknown & {name: string; color: string}, value: 'save' | 'cancel') => {
          switch (value) {
            case 'save': {
              new Projects()
                .addStatusGroup({
                  project_id: this.projectId,
                  name: data.name,
                  color: data.color
                }).then((id) => {
                  this.fetchProjectStatuses()
                })
              break
            }

            case 'cancel': {
              break
            }
          }

          dialogInstance.close()
        }
      })
    },

    /**
     * Событие, генерируется при нажатии на кнопку "редактировать группу статусов".
     * @param id идентификатор группы статуса.
     */
    onBtnStatusGroupEditClick (id: number) {
      this.$data.processLoadingStatusGroupId = id
      new Projects()
        .getStatusGroupById(id)
        .then(async (response) => {
          const dialogInstance = await this.$dialog.show(AppStatusGroupDialogEditor, {
            waitForResult: false,
            showClose: false,
            persistent: true,
            // Props
            name: response.name,
            color: response.color,
            // Props
            actions: {
              cancel: {
                attrs: {
                  text: this.$tc('Cancel'),
                  value: 'cancel'
                },
                on: {
                  click: () => (dialogInstance.close())
                }
              },
              ok: {
                attrs: {
                  text: this.$tc('Save'),
                  color: this.$vuetify.theme.currentTheme.primary,
                  value: 'save'
                }
              }
            },
            handlers: (data: unknown & {name: string; color: string}, value: 'save' | 'cancel') => {
              switch (value) {
                case 'save': {
                  new Projects()
                    .editStatusGroup(id, {
                      name: data.name,
                      color: data.color
                    })
                    .then(() => {
                      this.fetchProjectStatuses()
                    })
                  break
                }

                case 'cancel': {
                  break
                }
              }

              dialogInstance.close()
            }
          })
        })
        .finally(() => (this.$data.processLoadingStatusGroupId = -1))
    },

    /**
     * Событие, генерируется при нажатии на кнопку "удалить группу статусов".
     * @param id идентификатор группы статуса.
     */
    onBtnStatusGroupRemoveClick (id: number) {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$tc('Are you sure you want to delete a group of statuses?'),
        showClose: false,
        actions: {
          false: this.$tc('Cancel'),
          true: this.$tc('Yes')
        }
      })
        .then((result: boolean) => {
          if (result) {
            new Projects()
              .deleteStatusGroup(id)
              .then(() => {
                this.$toast.success(this.$tc('The group was successfully deleted.'))
                this.fetchProjectStatuses()
              }).catch((e) => {
                this.$toast.error(e.message)
              })
          }
        })
    },

    /**
     * Событие, генерируется при нажатии на кнопку "добавить статус в группу".
     * @param statusGroupId идентификатор группы статуса
     */
    async onBtnStatusAddClick (statusGroupId: number) {
      const dialogInstance = await this.$dialog.show(AppStatusDialogEditor, {
        waitForResult: false,
        showClose: false,
        width: 900,
        handler: (target: 'save' | 'cancel', data: { name: string; actions: any[] }) => {
          switch (target) {
            case 'save': {
              new Projects()
                .addStatus({
                  project_id: this.projectId,
                  name: data.name,
                  group_id: statusGroupId,
                  actions: data.actions
                }).then((id: number) => {
                  this.fetchProjectStatuses()
                })
              break
            }

            case 'cancel': {
              break
            }
          }

          dialogInstance.close()
        }
      })
    },

    /**
     * Событие, генерируется при нажатии на кнопку "редактировать статус".
     * @param id идентификатор статуса.
     */
    async onBtnStatusEditClick (id: number) {
      this.processLoadingStatusId = id
      new Projects()
        .getStatusById(id)
        .then(async (response) => {
          const dialogInstance = await this.$dialog.show(AppStatusDialogEditor, {
            waitForResult: false,
            showClose: false,
            persistent: true,
            width: 900,
            // Props
            actions: response.actions,
            name: response.name,
            // Props
            handler: (target: 'save' | 'cancel', data: { name: string; actions: any[] }) => {
              switch (target) {
                case 'save': {
                  new Projects()
                    .editStatus(id, {
                      name: data.name,
                      actions: data.actions
                    }).then(() => {
                      this.fetchProjectStatuses()
                    })
                  break
                }

                case 'cancel': {
                  break
                }
              }

              dialogInstance.close()
            }
          })
        })
        .finally(() => (this.processLoadingStatusId = -1))
    },

    /**
     * Событие, генерируется при нажатии на кнопку "удалить статус".
     * @param id идентификатор статуса.
     */
    onBtnStatusDeleteClick (id: number) {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$tc('Are you sure you want to delete the status?'),
        showClose: false,
        actions: {
          false: this.$tc('Cancel'),
          true: this.$tc('Yes')
        }
      })
        .then((result: boolean) => {
          if (result) {
            new Projects()
              .deleteStatus(id)
              .then(() => {
                this.$toast.success(this.$tc('Status removed.'))
                this.fetchProjectStatuses()
              })
          }
        })
    },

    /**
     * Загрузить новые статусы с сервера.
     */
    fetchProjectStatuses () {
      this.processLoadingData = true
      return new Projects()
        .getStatuses(+this.$route.params.project_id)
        .then((response) => {
          this.$data.statuses = response
        }).finally(() => (this.processLoadingData = false))
    }
  }
})
</script>

<style scoped>

</style>
