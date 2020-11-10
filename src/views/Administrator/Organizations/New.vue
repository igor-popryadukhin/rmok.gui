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
              :rules="[rules.required, ruleDynamic(regExPatterns.companyName, 'Не соответвует').regex]"
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
        <v-row
          v-for="(email, key) in organization.emails"
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
              <template
                v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
                v-slot:prepend
              >
                <v-icon v-if="key === 0" class="pl-5 pr-9">mdi-email</v-icon>
                <v-spacer v-else class="pl-10 pr-10"></v-spacer>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="6"
          >
            <v-text-field
              v-model="email.label"
              :label="$tc('label')"
              :rules="[rules.max_50]"
            >
              <template v-slot:append-outer>
                <v-btn
                  v-if="(organization.emails.length - 1) === key"
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
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Phones -->
        <s-phone-numbers
          v-model="phoneNumbers"
          :items="organization.phones"
        />

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
                ruleDynamic(9, 'Минимальная длина КПП 9 символов').min,
                ruleDynamic(9, 'Максимальная длина КПП 9 символов').max
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
                ruleDynamic(9, 'Минимальная длина ИНН 9 символов').min,
                ruleDynamic(12, 'Максимальная длина ИНН 12 символов').max
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
              :rules="[rules.required]"
              :label="$tc('responsible')"
              role="r_leader_cc"
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
import { isEmpty } from '@/Utils'
import {
  OrganizationInterface,
  Organizations,
  Responsible,
  OrganizationTagInterface, OrganizationPhoneInterface, OrganizationEmailInterface
} from '@/api/Organizations'
import SAutocompleteUsers from '@/snippets/Autocomplete/SAutocompleteUsers.vue'
import SPhoneNumbers from '@/snippets/SPhoneNumbers/SPhoneNumbers.vue'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'

interface Phone {
  code: string;
  value: string;
  label: string;
}

interface Email {
  value: string;
  label: string;
}

export default Vue.extend({
  mixins: [rules],
  components: {
    SAutocompleteUsers,
    SPhoneNumbers
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
      phoneNumbers: [] as PhoneNumberInterface[],
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
      this.organization.emails = []
      this.organization.phones = []

      this.organization.phones.push({
        id: 0,
        country_code: '',
        country_calling_code: '',
        value: '',
        label: ''
      })
      this.organization.emails.push({ value: '', label: '' })
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
          name: this.organization.name.trim(),
          inn: this.organization.inn.trim(),
          cpp: this.organization.cpp.trim(),
          site: this.organization.site.trim(),
          emails: this.organization.emails || []
            .filter((e: Email) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((email: Email) => {
              return {
                label: email.label,
                value: email.value
              }
            }),
          phones: this.phoneNumbers
            .map((phone) => {
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
          this.$toast.error(e.statusText || e.message || 'undefined')
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
