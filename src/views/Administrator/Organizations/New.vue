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
              <template v-slot:prepend>
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
            ><template v-slot:append-outer>
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
        <v-row
          v-for="(phone, key) in organization.phones"
          :key="`phone-${key}`"
        >
          <v-col
            cols="3"
            lg="3"
          >
            <v-combobox
              v-model="phone.code"
              :items="countryCodes"
              cache-items
              :return-object="false"
              item-text="name"
              item-value="code"
              :label="$tc('country_code')"
              :rules="[rules.required]"
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
              :rules="[
                rules.required,
                ruleDynamic(/^\d+/i).regex,
                ruleDynamic(10, 'Номер телефона должен содержать более 9 символов').min
                ]"
            >
              <template v-slot:prepend-inner>
                <div style="color: #848484; margin: inherit">{{ phone.code }}</div>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="6"
          >
            <v-text-field
              v-model="phone.label"
              :label="$tc('label')"
              :rules="[rules.max_50]"
            ><template v-slot:append-outer>
              <v-btn
                v-if="(organization.phones.length - 1) === key"
                icon
                @click="onAddPhoneClick"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                color="red"
                @click="onDeletePhoneClick(key)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            </v-text-field>
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
              <template v-slot:prepend>
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
              <template v-slot:prepend>
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
              <template v-slot:prepend v-if="['xs', 'sm'].includes($vuetify.breakpoint.name)">
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
              <template v-slot:prepend>
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
            <v-autocomplete
              v-model="organization.responsible"
              :items="responsibles"
              :loading="responsiblesProcessLoading"
              :search-input.sync="responsiblesSearchQuery"
              no-filter
              hide-no-data
              hide-selected
              persistent-hint
              :rules="[rules.required]"
              :label="$tc('responsible')"
            >
              <template v-slot:prepend>
                <v-icon class="pl-5 pr-9">mdi-account-tie</v-icon>
              </template>
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $tc('start_typing_your_search_term') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:selection="{ attr, on, item, selected }">
                <span>{{ item.first_name }} {{ item.last_name }}</span>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ item.first_name.charAt(0) }}
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="item.role"
                    v-text="item.role.name"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
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
              <template v-slot:prepend>
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
import rules from '@/mixins/rules'
import { isEmpty } from '@/Utils'
import countryCodes from '@/mixins/countryCodes'
import { Organizations, Responsible, TagInterface } from '@/api/Organizations'
import { Users } from '@/api/Users'
import { debounce } from 'vuetify/src/util/helpers'

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
  mixins: [rules, countryCodes],

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
      tags: [] as TagInterface[],
      responsiblesProcessLoading: false,
      responsiblesSearchQuery: '',
      responsiblesSearchDebounce: debounce((q: string) => {
        this.responsiblesProcessLoading = true
        new Users().findUsers(q, this.$store.getters['profile/role_id'])
          .then(({ count, items }) => {
            this.responsibles = items
          }).finally(() => {
          this.responsiblesProcessLoading = false
        })
      }, 350),
      responsibles: [] as Responsible[],
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
            code: '',
            value: '',
            label: ''
          }
        ],
        responsible: {
          first_name: '',
          id: 0,
          last_name: ''
        } as Responsible,
        tags: [] as TagInterface[]
      }
      /* eslint-enable */
    }
  },

  watch: {
    responsiblesSearchQuery (val: string) {
      this.responsiblesSearchDebounce(val)
    }
  },

  created () {
    new Organizations()
      .getTags()
      .then((tags: TagInterface[]) => {
        this.tags = tags
      })
  },

  methods: {

    /**
     * Fired when an clicked on the add email button
     */
    onAddEmailClick () {
      this.organization.emails.push({
        value: '',
        label: ''
      } as Email)
    },

    /**
     * Fired when an clicked on the delete email button
     * @param index
     */
    onDeleteEmailClick (index: number) {
      this.organization.emails.splice(index, 1)
    },

    /**
     * Fired when an clicked on the add phone number button
     */
    onAddPhoneClick () {
      this.organization.phones.push({
        country: null,
        value: '',
        label: ''
      } as Phone)
    },

    /**
     * Fired when an clicked on the delete phone number button
     * @param index
     */
    onDeletePhoneClick (index: number) {
      this.organization.phones.splice(index, 1)
    },

    resetForm () {
      this.$refs.form.reset()
      this.organization.tags = []
      this.organization.emails = []
      this.organization.phones = []

      this.organization.phones.push({ code: '', value: '', label: '' } as Phone)
      this.organization.emails.push({ value: '', label: '' } as Email)
    },

    onSave () {
      if (!this.$refs.form.validate()) {
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
          emails: this.organization.emails
            .filter((e: Email) => !(isEmpty(e.value) && isEmpty(e.label)))
            .map((email: Email) => {
              return {
                label: email.label,
                value: email.value
              }
            }),
          phones: this.organization.phones
            .filter((e: Phone) => !(isEmpty(e.value) && isEmpty(e.label) && isEmpty(e.code)))
            .map((phone: Phone) => { return { code: phone.code, label: phone.label, value: phone.value }}),
          sphere_activity: this.organization.sphere_activity || null,
          tags: this.organization.tags.map((tag: TagInterface | string) => {
            if (typeof tag === 'object') {
              return tag.id
            }
            return tag
          }),
          responsible: this.organization.responsible ? this.organization.responsible.id : 0 // 0 = Без ответсвенного
          /* eslint-enable */
        }).then(() => {
          this.resetForm()
          this.$toast.success(this.$tc('contact_saved_successfully'))
        }).catch((e) => {
          const cause: string = e.statusText || e || 'undefined'
          this.$toast.error(this.$t('error_occurred_while_saving_the_contact', { cause }))
        }).finally(() => {
          this.buttonSave.loading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
