<template>
  <v-form
    ref="form"
    v-model="form.valid"
    lazy-validation
  >
    <!-- FLM -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <!-- eslint-disable -->
        <v-text-field
          ref="groupName"
          v-model="group.name"
          :label="$tc('Group name')"
          :rules="[rules.notBlank]"
          persistent-hint
          @keydown.enter="$refs.sOrganizations.focus"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Users -->
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <s-users
          ref="sUsers"
          v-model="group.responsible"
          :label="$tc('Responsible group')"
          @change="selectedUser"
          :rules="[]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
        class="text-right"
      >
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
      </v-col>
    </v-row>

    <div class="pa-16"/>
  </v-form>
</template>

<script lang="ts">
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import Groups, { GroupInterface, GroupOrganizationInterface, GroupResponsibleInterface } from '@/api/Groups'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { UserInterface } from '@/api/Users'
import { NavigationGuardNext } from 'vue-router/types/router'
import APIError from '@/api/classes/APIError'

interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SUsers
  },

  mixins: [rules],

  data () {
    return {
      buttonSave: {
        disabled: false,
        loading: false
      },
      buttonDelete: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      userSelected: 0,

      group: {
        name: null,
        organization: null as unknown as GroupOrganizationInterface,
        responsible: null as unknown as GroupResponsibleInterface
      }
    }
  },

  beforeRouteEnter (to, from, next: NavigationGuardNext<any>) {
    new Groups()
      .getById(+to.params.id)
      .then(async (response: GroupInterface) => {
        next(vm => {
          vm.group.name = response.name

          if (vm.assertObjectHasAttribute(vm.$refs, 'sUsers')) {
            if (vm.assertObjectHasAttribute(response.responsible, 'id')) {
              vm.$refs.sUsers.setDefault(response.responsible?.id)
            }
          }
        })
      }).catch(() => {
        next({
          name: 'not_found'
        })
      })
  },

  // watch: {
  //   organizationSelected (val: OrganizationInterface) {
  //     if (val && this.firstLoad) {
  //       this.$refs.sUsers.focus()
  //       this.$refs.sUsers.fetchData({ organization_id: val.id })
  //     }
  //   }
  // },

  methods: {

    selectedUser (user: UserInterface) {
      this.userSelected = user.id
    },

    onBtnDeleteClick () {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$tc('All information about the group and information associated with it will be deleted permanently.'),
        actions: {
          false: {
            color: 'black',
            text: this.$tc('No')
          },
          true: {
            color: 'red',
            text: this.$tc('Yes'),
            handle: () => {
              new Groups()
                .delete(+this.$route.params.id)
                .then(() => {
                  this.$toast.success(this.$tc('The group was successfully deleted.'))
                  this.$router.back()
                }).catch((e: APIError) => {
                  this.$toast.error(e.message)
                })
            }
          }
        }
      })
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true

      const putData = {
        name: this.group.name,
        responsible_id: this.userSelected ? this.userSelected : 0
      }
      if (this.assertObjectHasAttribute(this.group.responsible, 'id')) {
        putData.responsible_id = this.group.responsible.id
      }

      new Groups()
        .update(+this.$route.params.id, putData)
        .then(() => {
          this.$toast.success(this.$tc('Group updated successfully.'))
        }).catch((e) => {
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
