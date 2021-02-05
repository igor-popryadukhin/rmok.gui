<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="6"
        xl="6"
      >
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
                v-for="(attribute, index) in permission.attributes"
                :key="`v-switch-${index}`"
                v-model="attribute.granted"
                :label="attribute.title"
                @change="onChangePermission(attribute)"
                dense
              ></v-switch>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Permissions, { AttributeInterface, PermissionInterface } from '@/api/Permissions'
import VInterface from '@/VInterface'

interface IData {
  permissions: PermissionInterface[]
}

// Расширяю интерфейс
interface VInnerInterface extends VInterface {
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  data (): IData {
    return {
      permissions: []
    }
  },

  beforeRouteEnter (to, from, next) {
    new Permissions()
      .get(+to.params.user_id)
      .then((permissions) => {
        next((vm: VInnerInterface) => {
          vm.permissions = permissions
        })
      })
  },

  methods: {
    /**
     * Происходит когда пользователь изменил состояние переключателя
     * @param attribute
     */
    onChangePermission (attribute: AttributeInterface) {
      new Permissions()
        .set<{ name: string, granted: boolean }>(+this.$route.params.user_id, {
          name: attribute.name,
          granted: attribute.granted
        }).then(() => {
          this.$toast.success(this.$tc('Permission settings saved successfully'))
          this.$store.dispatch('profile/loadProfile')
        })
        .catch(reason => {
          this.$toast.error(reason.message)
        })
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
