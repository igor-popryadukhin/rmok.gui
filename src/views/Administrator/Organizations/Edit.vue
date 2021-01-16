<template>
  <v-form
    ref="form"
    v-model="form.valid"
    lazy-validation
  >
    <v-row>
      <v-col
        cols="12"
      >
        <!-- eslint-disable -->
        <v-text-field
          v-model="organizationName"
          :label="$tc('organization_name')"
          persistent-hint
          required
          :rules="[rules.notBlank, ruleDynamic(regExPatterns.companyName, 'Не соответвует').regex]"
        >
          <template v-slot:prepend>
            <v-avatar
              size="60"
              class="mr-4"
              style="background-color: #8d3eb1; color: white"
            >
              AV
            </v-avatar>
          </template>
        </v-text-field>

      </v-col>
    </v-row>

    <!-- Номер телефона и адрес электронной почты -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="organizationEmail"
          :label="$t('E-mail address')"
          :rules="[rules.email]"
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-email</v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="organizationPhone"
          :label="$t('Phone number')"
          :rules="[rules.phoneNumber]"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Site -->
    <v-row>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="organizationSite"
          :label="$tc('site')"
          :placeholder="$tc('site_placeholder')"
          :rules="[ruleDynamic('[a-zа-я._-]+', $t('rule_only', {val: 'a-zа-я._-'} )).regex]"
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-web</v-icon>
          </template>
          <template v-slot:prepend-inner>
            <div style="color: #848484; margin: inherit">http://</div>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        lg="6"
        md="6"
        sm="12"
        xl="12"
      >
        <v-text-field
          v-model="organizationCpp"
          :label="$tc('cpp')"
          :rules="[
                ruleDynamic(9, $t('The minimum length of the CPP is 9 characters')).min,
                ruleDynamic(9, $t('The maximum length of the CPP is 9 characters')).max
                ]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-credit-card-multiple</v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        md="6"
        sm="12"
        xl="12"
      >
        <v-text-field
          v-model="organizationInn"
          :label="$tc('inn')"
          :rules="[
                ruleDynamic(9, $t('Minimum length INN 9 characters')).min,
                ruleDynamic(12, $t('Maximum length ИНН 12 characters')).max,
                ]"
          counter
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Местоположение -->
    <v-row>
      <v-col
        cols="12"
        lg="6"
        md="6"
        sm="12"
        xl="12"
      >
        <v-text-field
          v-model="organizationCity"
          :label="$tc('City')"
          :rules="[]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-city</v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        md="6"
        sm="12"
        xl="12"
      >
        <v-text-field
          v-model="organizationRegion"
          :label="$tc('Region')"
          :rules="[]"
          counter
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="organizationAddress"
          :label="$tc('Address')"
          :rules="[]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-10 pr-10">mdi-blank</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Tags -->
    <v-row>
      <v-col
        cols="12"
      >
        <v-combobox
          v-model="organizationTags"
          :items="tags"
          item-text="name"
          item-value="id"
          :label="$tc('tags')"
          disabled
          chips
          deletable-chips
          return-object
          disable-lookup
          multiple
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-tag-multiple</v-icon>
          </template>
        </v-combobox>
      </v-col>
    </v-row>

    <!-- Responsible -->
    <v-row>
      <v-col
        cols="12"
      >
        <s-users
          ref="sUsers"
          v-model="organizationResponsible"
          :label="$tc('Responsible')"
          :no-data-text="$t('Empty')"
          :params="{ organization_id: organizationId, q: '', roles: 'r_leader_cc' }"
          visible-icon
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <v-textarea
          v-model="organizationDescription"
          :label="$tc('Description')"
          :rules="[rules.lengthMax(3000)]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-10 pr-10">mdi-blank</v-icon>
          </template>
        </v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <v-textarea
          v-model="organizationSphereActivity"
          :label="$tc('sphere_activity')"
          :rules="[rules.lengthMax(3000)]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon class="pl-5 pr-9">mdi-bag-checked</v-icon>
          </template>
        </v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="text-right"
      >
        <v-btn
          v-bind="buttonDelete"
          color="red"
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
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import rules from '@/mixins/rules'
import {
  OrganizationInterface,
  Organizations,
  OrganizationTagInterface
} from '@/api/Organizations'
import ErrorInterface from '@/api/Schemas/ErrorInterface'
import { UserInterface } from '@/api/Users'
import SUsers from '@/snippets/SUsers/SUsers.vue'

export default Vue.extend({
  components: { SUsers },

  mixins: [rules],

  data () {
    return {
      regExPatterns: {
        companyName: /[A-zА-я0-9"&\s+]+/
      },
      buttonSave: {
        disabled: false,
        loading: false
      },
      buttonDelete: {
        disabled: false,
        loading: false,
        class: 'mr-2'
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      dataChanged: false,
      organizationId: 0,
      organizationName: '',
      organizationInn: '',
      organizationCpp: '',
      organizationSite: '',
      organizationEmail: '',
      organizationPhone: '',
      organizationSphereActivity: '',
      organizationTags: [] as any[],
      organizationResponsible: null as unknown as UserInterface,
      organizationCity: '' as string,
      organizationRegion: '' as string,
      organizationAddress: '' as string,
      organizationDescription: '' as string,
      tags: [] as OrganizationTagInterface[]
      /* eslint-enable */
    }
  },

  beforeRouteEnter (to, from, next) {
    new Organizations()
      .getById(+to.params.id)
      .then((organization: OrganizationInterface) => {
        next(vm => {
          vm.organizationId = organization.id
          vm.organizationName = organization.name
          vm.organizationEmail = organization.email
          vm.organizationPhone = organization.phone
          vm.organizationSite = organization.site
          vm.organizationCpp = organization.cpp
          vm.organizationInn = organization.inn
          vm.organizationTags = organization.tags
          vm.organizationResponsible = organization.responsible ? organization.responsible : null
          vm.organizationCity = organization.city
          vm.organizationRegion = organization.region
          vm.organizationAddress = organization.address
          vm.organizationDescription = organization.description
          vm.organizationSphereActivity = organization.sphere_activity

          vm.$watch('organizationName', vm.onChanged)
          vm.$watch('organizationEmail', vm.onChanged)
          vm.$watch('organizationPhone', vm.onChanged)
          vm.$watch('organizationSite', vm.onChanged)
          vm.$watch('organizationCpp', vm.onChanged)
          vm.$watch('organizationInn', vm.onChanged)
          vm.$watch('organizationTags', vm.onChanged)
          vm.$watch('organizationResponsible', vm.onChanged)
          vm.$watch('organizationCity', vm.onChanged)
          vm.$watch('organizationRegion', vm.onChanged)
          vm.$watch('organizationAddress', vm.onChanged)
          vm.$watch('organizationDescription', vm.onChanged)
          vm.$watch('organizationSphereActivity', vm.onChanged)

          // Загрузка доступных ответственных
          vm.$refs.sUsers.fetchData({
            q: organization.responsible ? organization.responsible.first_name : '',
            organization_id: organization.id
          })
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

  methods: {
    onChanged () {
      this.dataChanged = true
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      const putData = {
        name: this.organizationName.trim()
      } as any

      if (this.organizationPhone) {
        putData.phone = this.organizationPhone
      }

      if (this.organizationEmail) {
        putData.email = this.organizationEmail
      }

      if (this.organizationSite) {
        putData.site = this.organizationSite
      }

      if (this.organizationInn) {
        putData.inn = this.organizationInn
      }

      if (this.organizationCpp) {
        putData.cpp = this.organizationCpp
      }

      if (this.organizationSphereActivity) {
        putData.sphere_activity = this.organizationSphereActivity
      }

      if (this.organizationTags) {
        putData.tags = this.organizationTags
      }

      if (this.organizationCity) {
        putData.city = this.organizationCity
      }

      if (this.organizationRegion) {
        putData.region = this.organizationRegion
      }

      if (this.organizationAddress) {
        putData.address = this.organizationAddress
      }

      if (this.organizationDescription) {
        putData.description = this.organizationDescription
      }

      if (this.organizationResponsible) {
        putData.responsible = this.organizationResponsible.id
      }

      this.buttonSave.loading = true
      new Organizations()
        .update(+this.$route.params.id, putData)
        .then(() => {
          this.dataChanged = false
          this.$toast.success(this.$tc('The organization was successfully saved.'))
        }).catch((e: ErrorInterface | any) => {
          if (Array.isArray(e.errors)) {
            e.errors.map((e: any) => {
              this.$toast.warning(e.message)
            })
          }
          this.$toast.error(e.statusText || e.error_message || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    },

    onBtnDeleteClick () {
      console.log('onBtnDeleteClick')
    }
  }
})
</script>

<style scoped>

</style>
