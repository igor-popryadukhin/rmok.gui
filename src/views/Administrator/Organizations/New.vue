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
          >
            <!-- eslint-disable -->
            <v-text-field
              v-model="organization.name"
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

        <!-- Emails -->
        <v-row>
          <v-col>
            <s-emails
              v-model="organization.emails"
              :text-label="$t('Label')"
              :text-email="$t('E-mail address')"
              :rules-email="[rules.notBlank, rules.email]"
              :rules-label="[rules.notBlank, rules.max_50]"
            />
          </v-col>
        </v-row>

        <!-- Phones -->
        <v-row>
          <v-col>
            <s-phone-numbers
              v-model="organization.phones"
              :message-error="$t('Invalid phone number format')"
              :rules-number="[rules.notBlank]"
              :rules-label="[rules.notBlank, rules.max_50]"
              :rules-country-code="[rules.notBlank]"
            />
          </v-col>
        </v-row>

        <!-- Site -->
        <v-row>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="organization.site"
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

        <!-- Requisites -->
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="6"
            sm="12"
            xl="12"
          >
            <v-text-field
              v-model="organization.cpp"
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
              v-model="organization.inn"
              :label="$tc('inn')"
              :rules="[
                ruleDynamic(9, $t('Minimum length INN 9 characters')).min,
                ruleDynamic(12, $t('Maximum length ИНН 12 characters')).max,

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
        </v-row>

        <!-- Tags -->
        <v-row>
          <v-col
            cols="12"
          >
            <v-combobox
              v-model="organization.tags"
              :items="tags"
              item-text="name"
              item-value="id"
              :label="$tc('tags')"
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
            <s-autocomplete-users
              v-model="organization.responsible"
              :selected-id="organization.responsible ? organization.responsible.id: 0"
              visible-icon
              :rules="[rules.notBlank]"
              :label="$tc('responsible')"
              roles="r_leader_cc"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
          >
            <v-textarea
              v-model="organization.sphere_activity"
              :label="$tc('sphere_activity')"
              :rules="[rules.max_3000]"
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
import rules from '@/mixins/rules'
import {
  OrganizationInterface,
  Organizations,
  Responsible,
  OrganizationTagInterface, OrganizationPhoneInterface, OrganizationEmailInterface
} from '@/api/Organizations'
import SAutocompleteUsers from '@/snippets/Autocomplete/SAutocompleteUsers.vue'
import SPhoneNumbers from '@/snippets/SPhoneNumbers/SPhoneNumbers.vue'
import SEmails from '@/snippets/SEmails/SEmails.vue'

export default Vue.extend({
  mixins: [rules],
  components: {
    SAutocompleteUsers,
    SPhoneNumbers,
    SEmails
  },
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
      /* eslint-disable */
      organization: {
        name: '',
        site: '',
        inn: '',
        cpp: '',
        sphere_activity: '',
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
        ],
        responsible: {
          first_name: '',
          id: 0,
          last_name: ''
        } as Responsible,
        tags: [] as OrganizationTagInterface[]
      } as OrganizationInterface,
      tags: [] as OrganizationTagInterface[]
      /* eslint-enable */
    }
  },

  created () {
    new Organizations()
      .getTags()
      .then((tags: OrganizationTagInterface[]) => {
        this.tags = tags
      })
  },
  methods: {

    /**
     * Fired when an clicked on the add email button
     */
    onAddEmailClick () {
      if (!this.organization.emails) {
        this.organization.emails = []
      }
      this.organization.emails.push({
        value: '',
        label: ''
      } as OrganizationEmailInterface)
    },

    /**
     * Fired when an clicked on the delete email button
     * @param index
     */
    onDeleteEmailClick (index: number) {
      if (this.organization.emails) {
        this.organization.emails.splice(index, 1)
      }
    },

    /**
     * Fired when an clicked on the add phone number button
     */
    onAddPhoneClick () {
      /* eslint-disable */
      if (!this.organization.phones) {
        this.organization.phones = []
      }
      this.organization.phones.push({
        id: 0,
        country_code: '',
        country_calling_code: '',
        value: '',
        label: ''
      } as OrganizationPhoneInterface)
    },

    /**
     * Fired when an clicked on the delete phone number button
     * @param index
     */
    onDeletePhoneClick (index: number) {
      if (this.organization.phones) {
        this.organization.phones.splice(index, 1)
      }
    },

    resetForm () {
      /* eslint-disable */
      (this.$refs.form as Vue & { reset: () => boolean }).reset()
      this.organization.tags = []
      this.organization.emails = [{ value: '', label: '' }]
      this.organization.phones = [
        {
          id: 0,
          country_code: '',
          country_calling_code: '',
          value: '',
          label: ''
        }
      ]
      /* eslint-enable */
    },

    onSave () {
      if (!(this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        return
      }
      this.buttonSave.loading = true
      new Organizations()
        .add({
          /* eslint-disable */
          name: this.organization.name ? this.organization.name.trim() : '',
          inn: this.organization.inn ? this.organization.inn.trim() : '',
          cpp: this.organization.cpp ? this.organization.cpp.trim() : '',
          site: this.organization.site ? this.organization.site.trim() : '',
          emails: this.organization.emails ? this.organization.emails
            .map((email: OrganizationEmailInterface) => {
              return {
                label: email.label,
                value: email.value
              }
            }) : [],
          phones: this.organization.phones
            ?.map((phone: OrganizationPhoneInterface) => {
              return {
                country_code: phone.country_code,
                country_calling_code: phone.country_calling_code,
                label: phone.label,
                value: phone.value
              }
            }),
          sphere_activity: this.organization.sphere_activity || null,
          tags: this.organization.tags ? this.organization.tags.map((tag: OrganizationTagInterface | string) => {
            if (typeof tag === 'object') {
              return tag.id
            }
            return tag
          }) : [],
          responsible: this.organization.responsible ? this.organization.responsible.id : 0 // 0 = Без ответсвенного
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('organization_saved_successfully'))
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
