<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Editing a role') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          v-bind="buttonDelete"
          color="red"
          class="mr-2"
          disabled
          outlined
          small
          tile
          @click="onBtnDeleteClick"
        >
          {{ $tc('Delete') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          tile
          small
          outlined
          :loading="buttonSave.loading"
          :disabled="buttonSave.disabled"
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <template v-if="processLoadingData">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <v-row>
        <v-col
          cols="12"
        >
          <v-text-field
            v-model="name"
            :label="$tc('Role name')"
            :rules="[rules.notBlank]"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
        >
          <v-expansion-panels
            tile
            flat
            focusable
          >
            <v-expansion-panel
              v-for="(permission, index) in permissions"
              :key="index"
            >
              <v-expansion-panel-header>
                <span class="font-weight-bold">{{ permission.title }}</span>
              </v-expansion-panel-header>
              <v-divider />
              <v-expansion-panel-content>
                <v-switch
                  v-for="(attribute, attribute_index) in permission.permissions"
                  :key="`v-switch-${attribute_index}`"
                  v-model="attribute.granted"
                  :label="attribute.title"
                  hide-details
                  dense
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { PermissionGroupInterface, PermissionInterface } from '@/api/Permissions'
import Roles from '@/api/Roles'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import rules from '@/mixins/rules'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface Refs {
  [key: string]: any;
}

interface Data {
  name: string;
  permissions: string[];
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Refs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppLoading },
  mixins: [rules],

  beforeRouteLeave (to, from, next) {
    if (this.dataChanged) {
      const answer = window.confirm(this.$tc('Do you want to leave? You have unsaved changes!'))
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },

  data (): Data {
    return {
      buttonDelete: {
        loading: false
      },
      buttonSave: {
        loading: false
      },
      processLoadingData: false,
      name: '',
      permissions: []
    }
  },

  computed: {
    roleId (): number {
      return +this.$route.params.role_id
    }
  },

  mounted () {
    this.processLoadingData = true
    new Roles()
      .getById(this.roleId)
      .then((response) => {
        this.$data.name = response.name
        this.$data.permissions = response.permissions
        this.$data.role_use.selected = response.use
      }).finally(() => (this.processLoadingData = false))
  },

  methods: {

    onBtnDeleteClick () {
      this.$dialog.confirm({
        actions: {
          false: {
            color: 'black',
            text: this.$tc('No')
          },
          true: {
            color: 'red',
            handler: () => {
              new Roles()
                .delete(+this.$route.params.role_id)
                .then(() => {
                  this.$toast.success(this.$tc('Role successfully deleted'))
                  this.$router.replace({ name: 'roles' })
                }).catch((e: APIError) => {
                  this.$toast.error(e.message)
                }).finally(() => {
                  this.buttonSave.loading = false
                })
            },
            text: this.$tc('Yes')
          }
        },
        text: this.$tc('All information about the role and information associated with it will be deleted permanently.'),
        title: this.$tc('Confirmation request')
      })
    },

    onBtnSaveClick () {
      // if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      //   return
      // }

      const request = {
        name: this.name,
        permissions: [] as string[]
      }

      for (let i = 0; i < this.permissions.length; i++) {
        const pg: PermissionGroupInterface = this.permissions[i]
        for (let j = 0; j < pg.permissions.length; j++) {
          const p: PermissionInterface = pg.permissions[j]

          if (p.granted) {
            request.permissions.push(p.name)
          }
        }
      }

      this.buttonSave.loading = true
      new Roles()
        .edit(+this.$route.params.role_id, request)
        .then(() => {
          this.$store.dispatch('profile/load')
          this.$toast.success(this.$tc('Role successfully updated'))
        }).catch((e: APIError) => {
          if (Array.isArray(e.errors)) {
            e.errors.map((e: any) => {
              this.$toast.warning(e.message)
            })
          }
          this.$toast.error(e.message)
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
