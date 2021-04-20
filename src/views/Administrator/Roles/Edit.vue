<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
      lg="6"
      xl="6"
    >
      <v-card tile flat>
        <v-card-text>
          <v-form
            ref="form"
          >
            <v-text-field
              v-model="name"
              :label="$tc('Role name')"
              :rules="[rules.notBlank]"
            >
            </v-text-field>
          </v-form>
        </v-card-text>

        <v-card-text class="py-0">
          <v-select
            v-model="role_use.selected"
            :items="role_use.options"
            :label="$tc('The role is used for')"
            item-text="title"
            item-value="value"
          />
        </v-card-text>

<!--        <v-card-title class="grey&#45;&#45;text">{{ $tc('Permissions') }}</v-card-title>-->
        <v-card-text class="py-0">
          <v-expansion-panels tile flat focusable>
            <v-expansion-panel
              v-for="(permission, index) in permissions"
              :key="index"
            >
              <v-expansion-panel-header>
                <span class="font-weight-bold">{{ permission.title }}</span>
              </v-expansion-panel-header>
              <v-divider/>
              <v-expansion-panel-content>
                <v-switch
                  v-for="(attribute, index) in permission.permissions"
                  :key="`v-switch-${index}`"
                  v-model="attribute.granted"
                  :label="attribute.title"
                  dense
                ></v-switch>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="py-5">
          <v-spacer/>
          <v-btn
            v-bind="buttonDelete"
            color="red"
            class="mr-2"
            outlined
            tile
            @click="onBtnDeleteClick"
          >
            {{ $tc('Delete') }}
          </v-btn>
          <v-btn
            text
            tile
            :loading="buttonSave.loading"
            :disabled="buttonSave.disabled"
            @click="onSave"
          >
            {{ $tc('Save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { PermissionGroupInterface, PermissionInterface } from '@/api/Permissions'
import Roles from '@/api/Roles'
import rules from '@/mixins/rules'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface IRefs {
  [key: string]: any;
}

interface IData {
  name: string;
  permissions: string[];
  role_use: unknown & { selected: string | null, options: unknown[] };

  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRefs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({

  beforeRouteEnter (to, from, next) {
    new Roles()
      .getById(+to.params.id)
      .then((response) => {
        next((vm: VInnerInterface) => {
          vm.$data.name = response.name
          vm.$data.permissions = response.permissions
          vm.$data.role_use.selected = response.use
        })
      }).catch(() => {
        next({
          name: 'not_found'
        })
      })
  },

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

  data (): IData {
    return {
      buttonDelete: {
        loading: false
      },
      buttonSave: {
        loading: false
      },
      name: '',
      permissions: [],
      role_use: {
        options: [
          {
            title: this.$tc('For administration'),
            value: 'for_administration'
          },
          {
            title: this.$tc('For calls'),
            value: 'for_calls'
          }
        ],
        selected: null
      }
    }
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
            handle: () => {
              new Roles()
                .delete(+this.$route.params.id)
                .then(() => {
                  this.$toast.success(this.$tc('Role successfully deleted'))
                  this.$router.replace({ name: 'administrator_roles_list' })
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

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

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
        .edit(+this.$route.params.id, request)
        .then(() => {
          this.$store.dispatch('profile/loadProfile')
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
  },

  mixins: [rules]
})
</script>

<style scoped>

</style>
