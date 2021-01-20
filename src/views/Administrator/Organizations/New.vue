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
          :rules="[rules.notBlank, ruleDynamic(regExPatterns.companyName, 'Не соответствует').regex]"
        >
          <template v-slot:prepend>
            <v-avatar
              size="60"
              class="mr-4 primary white--text"
              style="font-size: 20px"
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
          :params="{ q: '', roles: 'r_leader_cc' }"
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

    <v-row class="mb-16">
      <v-col
        cols="12"
        class="text-right"
      >
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
  Organizations,
  OrganizationTagInterface,
  OrganizationPhoneInterface,
  OrganizationEmailInterface
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
      form: {
        valid: false
      },
      users: [] as UserInterface[],
      organizationName: '',
      organizationInn: '',
      organizationCpp: '',
      organizationSite: '',
      organizationEmail: '',
      organizationPhone: '',
      organizationSphereActivity: '',
      organizationTags: [] as any[],
      organizationResponsible: {} as unknown as UserInterface,
      organizationCity: '' as string,
      organizationRegion: '' as string,
      organizationAddress: '' as string,
      organizationDescription: '' as string,
      tags: [] as OrganizationTagInterface[]
      /* eslint-enable */
    }
  },

  methods: {

    resetForm () {
      /* eslint-disable */
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
      this.organizationTags = []
      /* eslint-enable */
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      const postData = {
        name: this.organizationName.trim()
      } as any

      if (this.organizationResponsible) {
        postData.phone = this.organizationResponsible.id
      }

      if (this.organizationPhone) {
        postData.phone = this.organizationPhone
      }

      if (this.organizationEmail) {
        postData.email = this.organizationEmail
      }

      if (this.organizationSite) {
        postData.site = this.organizationSite
      }

      if (this.organizationInn) {
        postData.inn = this.organizationInn
      }

      if (this.organizationCpp) {
        postData.cpp = this.organizationCpp
      }

      if (this.organizationSphereActivity) {
        postData.sphere_activity = this.organizationSphereActivity
      }

      if (this.organizationTags) {
        postData.tags = this.organizationTags
      }

      if (this.organizationCity) {
        postData.city = this.organizationCity
      }

      if (this.organizationRegion) {
        postData.region = this.organizationRegion
      }

      if (this.organizationDescription) {
        postData.description = this.organizationDescription
      }

      this.buttonSave.loading = true
      new Organizations()
        .add(postData)
        .then(() => {
          this.resetForm()
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
    }
  }
})
</script>

<style scoped>

</style>
