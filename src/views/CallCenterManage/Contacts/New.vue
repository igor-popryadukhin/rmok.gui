<template>
  <div>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
    >
      <v-container>
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
              :rules="[rules.required, rules.max_256]"
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
              :rules="[rules.required, rules.max_256]"
            ></v-text-field>
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
              :rules="[rules.max_256]"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Phones -->
        <v-row>
          <v-col>
            <s-phone-numbers
              v-model="contact.phones"
              :message-error="$t('Invalid phone number format')"
              :rules-number="[rules.required]"
              :rules-label="[rules.required, rules.max_50]"
              :rules-country-code="[rules.required]"
            />
          </v-col>
        </v-row>

        <!-- Emails -->
        <v-row>
          <v-col>
            <s-emails
              v-model="contact.emails"
              :text-label="$t('Label')"
              :text-email="$t('E-mail address')"
              :rules-email="[rules.required, rules.email]"
              :rules-label="[rules.required, rules.max_50]"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
          >
            <v-textarea
              v-model="contact.notes"
              :label="$tc('note')"
              :rules="[rules.max_3000]"
              counter
            >
              <template v-slot:prepend>
                <v-icon class="pl-5 pr-9">mdi-comment-text-outline</v-icon>
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
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import rules from '@/mixins/rules'
import { isEmpty } from '@/Utils'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'
import SPhoneNumbers from '@/snippets/SPhoneNumbers/SPhoneNumbers.vue'
import SEmails from '@/snippets/SEmails/SEmails.vue'

export default Vue.extend({
  mixins: [rules],

  components: {
    SPhoneNumbers,
    SEmails
  },

  data () {
    return {
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      contact: {
        first_name: '',
        last_name: '',
        middle_name: '',
        notes: '',
        emails: [
          {
            value: '',
            label: ''
          }
        ],
        phones: [
          {
            id: 0,
            country_code: 'RU',
            country_calling_code: '7',
            value: '',
            label: ''
          }
        ]
      }
      /* eslint-enable */
    }
  },

  methods: {

    resetForm () {
      this.contact.phones = [
        {
          id: 0,
          country_code: 'RU',
          country_calling_code: '7',
          value: '',
          label: ''
        }
      ]
      this.contact.emails = [
        {
          value: '',
          label: ''
        }
      ];
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
    },

    /**
     * Fired when an clicked on the add email button
     */
    onAddEmailClick () {
      this.contact.emails.push({
        value: '',
        label: ''
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
     * Fired when an clicked on the add phone number button
     */
    onAddPhoneClick () {
      this.contact.phones.push({
        country_calling_code: '',
        country_code: '',
        id: 0,
        label: '',
        value: ''
      })
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
      this.buttonSave.loading = true
      new Contacts()
        .add({
          /* eslint-disable */
          first_name: this.contact.first_name,
          last_name: this.contact.last_name,
          middle_name: this.contact.middle_name,
          emails: this.contact.emails
            .filter((e) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((email) => ({ label: email.label, value: email.value })),
          phones: this.contact.phones
            .filter((e: PhoneNumberInterface) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((phone: PhoneNumberInterface) => ({
              country_code: phone.country_code,
              country_calling_code: phone.country_calling_code,
              label: phone.label,
              value: phone.value
            })),
          notes: this.contact.notes || null
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('contact_saved_successfully'))
        }).catch((e) => {
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
