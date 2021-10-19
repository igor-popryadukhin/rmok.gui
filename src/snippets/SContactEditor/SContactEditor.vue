<template>
  <v-card
    tile
    flat
  >
    <v-card-title class="pa-0 grey--text">
      {{ title }}
    </v-card-title>
    <v-row>
      <v-col
        cols="12"
        lg="4"
        md="4"
      >
        <v-text-field
          v-model="contact.first_name"
          :label="$tc('first_name')"
          persistent-hint
          required
          :rules="[rules.notBlank, rules.lengthMax(255), rules.lengthMin(1)]"
          counter
        >
          <template #prepend>
            <v-avatar
              size="60"
              class="mr-4 primary white--text"
              style="font-size: 20px"
            >
              <v-btn
                color="white"
                height="60"
                width="60"
                icon
              >
                <v-icon>mdi-camera</v-icon>
              </v-btn>
            </v-avatar>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        lg="4"
        md="4"
      >
        <v-text-field
          v-model="contact.last_name"
          :label="$tc('last_name')"
          persistent-hint
          required
          :rules="[rules.notBlank, rules.lengthMax(255), rules.lengthMin(1)]"
        />
      </v-col>
      <v-col
        cols="12"
        lg="4"
        md="4"
      >
        <v-text-field
          v-model="contact.middle_name"
          :label="$tc('middle_name')"
          persistent-hint
          :rules="[rules.lengthMax(256)]"
        />
      </v-col>
    </v-row>

    <!-- Phones -->
    <v-row>
      <v-col>
        <s-contact-editor-phones />
      </v-col>
    </v-row>

    <!-- Emails -->
    <v-row>
      <v-col>
        <s-emails
          v-model="contact.emails"
          :text-label="$t('Label')"
          :text-email="$t('E-mail address')"
          :rules-email="[rules.email]"
          :rules-label="[rules.lengthMax(50)]"
        />
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
          v-model="contact.city"
          :label="$tc('City')"
          :rules="[]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            #prepend
          >
            <v-icon class="pl-5 pr-9">
              mdi-city
            </v-icon>
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
          v-model="contact.region"
          :label="$tc('Region')"
          :rules="[]"
          counter
        />
      </v-col>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="contact.address"
          :label="$tc('Address')"
          :rules="[]"
          counter
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            #prepend
          >
            <v-icon class="pl-10 pr-10">
              mdi-blank
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <v-textarea
          v-model="contact.notes"
          :label="$tc('Note')"
          :rules="[rules.lengthMax(100)]"
          counter
        >
          <template #prepend>
            <v-icon class="pl-5 pr-9">
              mdi-comment-text-outline
            </v-icon>
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
  </v-card>
</template>

<script lang="ts">
import { PhoneInterface } from './interfaces'
import SContactEditorPhones from './SContactEditorPhones.vue'
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import rules from '@/mixins/rules'
import { isEmpty } from '@/Utils'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'
import SEmails from '@/snippets/SEmails/SEmails.vue'

export default Vue.extend({

  name: 'SContactEditor',
  // beforeRouteEnter (to, from, next) {
  //   if (to.params.contact_id) {
  //     new Contacts()
  //       .getById(+to.params.contact_id)
  //       .then(response => {
  //         to.meta.route_breadcrumb_name = `${response.first_name} ${response.last_name}`
  //         next((vm: any) => {
  //           vm.contact.first_name = response.first_name
  //           vm.contact.last_name = response.last_name
  //           vm.contact.middle_name = response.middle_name
  //           vm.contact.phones = response.phones
  //           vm.contact.emails = response.emails
  //           vm.contact.city = response.city
  //           vm.contact.region = response.region
  //           vm.contact.address = response.address
  //         })
  //       })
  //   } else {
  //     next()
  //   }
  // },

  components: {
    SContactEditorPhones,
    SEmails
  },

  mixins: [rules],

  props: {
    title: {
      default: '',
      type: String
    }
  },

  data () {
    return {
      buttonSave: {
        disabled: false,
        loading: false
      },
      contact: {
        address: '',
        city: '',
        emails: [
          {
            label: '',
            value: ''
          }
        ],
        first_name: '',
        last_name: '',
        middle_name: '',
        notes: '',
        phones: [
          {
            country_calling_code: '7',
            country_code: 'RU',
            id: 0,
            label: '',
            raw: ''
          }
        ],
        region: ''
      },
      form: {
        valid: false
      },
      phones: [
        {
          label: 'sex',
          value: '+79256041055'
        },
        {
          label: 'sex2',
          value: '+79256041056'
        }
      ] as PhoneInterface[]
      /* eslint-enable */
    }
  },

  methods: {

    /**
     * Fired when an clicked on the add email button
     */
    onAddEmailClick () {
      this.contact.emails.push({
        label: '',
        value: ''
      })
    },

    /**
     * Fired when an clicked on the add phone number button
     */
    onAddPhoneClick () {
      this.contact.phones.push({
        country_calling_code: '',
        country_code: '',
        id: 0,
        label: '',
        raw: ''
      })
    },

    /**
     * Fired when an clicked on the delete email button
     * @param index
     */
    onDeleteEmailClick (index: number) {
      this.contact.emails.splice(index, 1)
    },

    /**
     * Fired when an clicked on the delete phone number button
     * @param index
     */
    onDeletePhoneClick (index: number) {
      this.contact.phones.splice(index, 1)
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }

      const data: any = {
        emails: this.contact.emails
          .filter((e) => !(isEmpty(e.value) && isEmpty(e.label)))
          .map((email) => ({ label: email.label, value: email.value })),
        first_name: this.contact.first_name,
        last_name: this.contact.last_name,
        middle_name: this.contact.middle_name,
        phones: this.contact.phones
          .filter((e: PhoneNumberInterface) => !(isEmpty(e.raw) && isEmpty(e.label)))
          .map((phone: PhoneNumberInterface) => ({
            country_calling_code: phone.country_calling_code,
            country_code: phone.country_code,
            label: phone.label,
            raw: phone.raw
          }))
      }

      if (this.contact.notes) { data.notes = this.contact.notes }
      if (this.contact.city) { data.city = this.contact.city }
      if (this.contact.region) { data.region = this.contact.region }
      if (this.contact.address) { data.address = this.contact.address }

      this.buttonSave.loading = true
      new Contacts()
        .update(+this.$route.params.contact_id, data)
        .then(() => {
          this.$toast.success(this.$tc('Contact successfully saved.'))
        }).catch((e) => {
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
