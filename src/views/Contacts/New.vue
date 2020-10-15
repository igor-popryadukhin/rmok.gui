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
              :rules="[rules.max_256]"
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

        <!-- Emails -->
        <v-row
          v-for="(email, key) in contact.emails"
          :key="`email-${key}`"
        >
          <v-col
            cols="6"
          >
            <v-text-field
              v-model="email.value"
              :label="$tc('email')"
              persistent-hint
              required
              :rules="[rules.email, rules.max_256]"
            >
              <template v-slot:prepend>
                <v-icon v-if="key === 0" class="pl-5 pr-9">mdi-email</v-icon>
                <v-spacer v-else class="pl-10 pr-10"></v-spacer>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="6"
          >
            <v-combobox
              v-model="email.label"
              :label="$tc('label')"
              :items="contactLabels"
              :return-object="false"
              :rules="[rules.max_50]"
            ><template v-slot:append-outer>
              <v-btn
                v-if="(contact.emails.length - 1) === key"
                icon
                @click="onAddEmailClick()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                color="red"
                @click="onDeleteEmailClick(key)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            </v-combobox>
          </v-col>
        </v-row>

        <!-- Phones -->
        <v-row
          v-for="(phone, key) in contact.phones"
          :key="`phone-${key}`"
        >
          <v-col
            cols="3"
            lg="3"
          >
            <v-combobox
              v-model="phone.code"
              :items="countryCodes"
              item-text="name"
              item-value="code"
              @change="onCountryCodeSelected(phone)"
            >
              <template v-slot:prepend>
                <v-icon v-if="key === 0" class="pl-5 pr-9">mdi-phone</v-icon>
                <v-spacer v-else class="pl-10 pr-10"></v-spacer>
              </template>
            </v-combobox>
          </v-col>
          <v-col
            cols="3"
            lg="3"
          >
            <v-text-field
              v-model="phone.value"
              :label="$tc('phone')"
              :rules="[rules.required, rules.phone_number]"
            >
            </v-text-field>
          </v-col>
          <v-col
            cols="6"
          >
            <v-combobox
              v-model="phone.label"
              :label="$tc('label')"
              :items="contactLabels"
              :return-object="false"
              persistent-hint
              :rules="[rules.max_50]"
            ><template v-slot:append-outer>
              <v-btn
                v-if="key > 0"
                icon
                color="red"
                @click="onDeletePhoneClick(key)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                v-if="key === 0"
                icon
                @click="onAddPhoneClick()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            </v-combobox>
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
              {{ $tc('save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import countryCodes from '@/mixins/countryCodes'
import contactLabels from '@/mixins/contactLabels'
import { Contacts } from '@/api/Contacts'
import { POSITION } from 'vue-toastification'
import rules from '@/mixins/rules'
import { isEmpty } from '@/Utils'

interface Phone {
  code: string;
  value: string;
  label: string;
}

interface Email {
  value: string;
  label: string;
}

interface Contact {
  first_name: string;
  last_name: string;
  middle_name: string;
  notes: string;
  emails: Email[];
  phones: Phone[];
}

export default Vue.extend({
  mixins: [countryCodes, contactLabels, rules],
  data () {
    return {
      buttonSave: {
        disabled: false,
        loading: false
      },
      form: {
        valid: false
      },
      /* eslint-disable */
      contact: {
        first_name: '',
        last_name: '',
        middle_name: '',
        notes: '',
        emails: [
          {
            email: '',
            label: ''
          }
        ],
        phones: [
          {
            code: '',
            value: '',
            label: ''
          }
        ]
      } as Contact
      /* eslint-enable */
    }
  },

  methods: {
    onCountryCodeSelected (phone: Phone) {
      phone.value = phone.code.code
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
        code: '',
        value: '',
        label: ''
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
      if (!this.$refs.form.validate()) {
        return
      }
      this.buttonSave.loading = true
      new Contacts()
        .add({
          /* eslint-disable */
          first_name: this.contact.first_name.trim(),
          last_name: this.contact.last_name.trim(),
          middle_name: this.contact.middle_name.trim(),
          emails: this.contact.emails
            .filter((e: Email) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((email: Email) => {
              return {
                label: email.label,
                value: email.value
              }
            }),
          phones: this.contact.phones
            .filter((e: Phone) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((phone: Phone) => { return { label: phone.label, value: phone.value }}),
          notes: this.contact.notes || null
          /* eslint-enable */
        }).then(() => {
          this.$refs.form.reset()
          this.$toast.success(this.$tc('contact_saved_successfully'), {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: true,
            hideProgressBar: true,
            closeButton: 'button',
            icon: true,
            rtl: false
          })
        }).catch((e) => {
          const cause: string = e.statusText || e || 'undefined'
          this.$toast.error(this.$t('error_occurred_while_saving_the_contact', { cause }), {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: true,
            hideProgressBar: true,
            closeButton: 'button',
            icon: true,
            rtl: false
          })
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
