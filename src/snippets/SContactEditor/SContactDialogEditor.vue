<template>
  <v-card min-width="450px">
    <div class="d-flex justify-space-between">
      <div>
        <v-card-title class="py-3">
          {{ title }}
        </v-card-title>
      </div>
      <div class="pa-4 px-10">
        <template v-if="value.created_at">
          <span class="grey--text" style="font-size: small">{{ $t('Date of creation {date}', { date: $moment.unix(value.created_at).format('DD.MM.YYYY HH:mm') }) }}</span>
        </template>
      </div>
    </div>

    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-text class="py-0">
        <v-divider />
      </v-card-text>

      <v-card-text class="py-0" style="overflow-y: auto; max-height: 600px">
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center mt-2">
            <v-avatar
              size="55"
              class="grey white--text"
              style="font-size: 20px"
            >
              <v-btn
                color="white"
                height="60"
                width="60"
                icon
              >
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </v-avatar>
          </div>
          <v-row>
            <v-col>
              <v-text-field
                v-model="first_name"
                :rules="[rules.notBlank, rules.lengthMax(255)]"
                label="Имя"
                dense
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="last_name"
                :rules="[rules.notBlank, rules.lengthMax(255)]"
                label="Фамилия"
                dense
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="middle_name"
                :rules="[rules.lengthMax(255)]"
                label="Отчество"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Телефоны -->
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center mt-6">
            <v-icon>mdi-phone</v-icon>
          </div>
          <div class="flex-grow-1">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="phone.value"
                  :rules="[rules.notBlank, rules.phoneNumber]"
                  label="Номер"
                  dense
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="phone.label"
                  :rules="[rules.lengthMax(255)]"
                  color="primary"
                  label="Ярлык"
                  dense
                >
                  <template v-slot:append-outer>
                    <v-btn
                      icon
                      x-small
                      outlined
                      @click="onPhoneAddClick"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row
              v-for="(item, key) in phone.additional"
              :key="key"
            >
              <v-col class="py-0">
                <v-text-field
                  v-model="item.value"
                  :rules="[rules.notBlank, rules.phoneNumber, rules.lengthMax(255)]"
                  label="Номер"
                  dense
                >
                </v-text-field>
              </v-col>
              <v-col class="py-0">
                <v-text-field
                  v-model="item.label"
                  :rules="[rules.lengthMax(255)]"
                  label="Ярлык"
                  dense
                >
                  <template v-slot:append-outer>
                    <v-btn
                      color="red"
                      icon
                      x-small
                      outlined
                      @click="onPhoneRemoveClick(key)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <!-- Адреса электронной почты -->
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center mt-6">
            <v-icon>mdi-email</v-icon>
          </div>
          <div class="flex-grow-1">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="email.value"
                  :rules="[rules.email]"
                  label="Адрес электронной почты"
                  dense
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="email.label"
                  :rules="[rules.lengthMax(255)]"
                  color="primary"
                  label="Ярлык"
                  dense
                >
                  <template v-slot:append-outer>
                    <v-btn
                      icon
                      x-small
                      outlined
                      @click="onEmailAddClick"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row
              v-for="(item, key) in email.additional"
              :key="key"
            >
              <v-col class="py-0">
                <v-text-field
                  v-model="item.value"
                  label="Адрес электронной почты"
                  dense
                >
                </v-text-field>
              </v-col>
              <v-col class="py-0">
                <v-text-field
                  v-model="item.label"
                  label="Ярлык"
                  dense
                >
                  <template v-slot:append-outer>
                    <v-btn
                      color="red"
                      icon
                      x-small
                      outlined
                      @click="onEmailRemoveClick(key)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <!-- Местоположение -->
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center">
            <v-icon>mdi-map-marker</v-icon>
          </div>
          <div class="flex-grow-1">
            <v-row v-show="location.expanded">
              <v-col class="py-0">
                <v-text-field
                  v-model="location.data.region"
                  :rules="[rules.lengthMax(255)]"
                  label="Регион"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="location.expanded">
              <v-col class="py-0">
                <v-text-field
                  v-model="location.data.city"
                  :rules="[rules.lengthMax(255)]"
                  label="Город"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="location.expanded">
              <v-col class="py-0">
                <v-text-field
                  v-model="location.data.address"
                  :rules="[rules.lengthMax(255)]"
                  label="Адрес"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-1">
              <v-col class="py-0 d-flex justify-space-between">
                <div>
                  <span v-show="!location.expanded">{{ locationAddress }}</span>
                </div>
                <div>
                  <v-btn
                    text
                    tile
                    x-small
                    @click="location.expanded = !location.expanded"
                  >
                    {{ location.expanded ? $tc('Свернуть') : $tc('Ещё') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <!-- Заметки -->
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center mt-6">
            <v-icon>mdi-note</v-icon>
          </div>
          <div class="flex-grow-1">
            <v-textarea
              v-model="notes"
              :rules="[rules.lengthMax(3000)]"
              label="Заметки"
              rows="2"
            ></v-textarea>
          </div>
        </v-card-text>

        <!-- Теги -->
        <v-card-text class="d-flex">
          <div class="v-card-text--left d-flex align-start justify-center mt-6">
            <v-icon>mdi-tag</v-icon>
          </div>
          <div class="flex-grow-1">
            <v-autocomplete
              v-model="tags.selected"
              :items="tags.options"
              :search-input.sync="tags.q"
              label="Теги"
              item-text="name"
              item-value="id"
              cache-items
              return-object
              chips
              clearable
              multiple
              @update:search-input="tags.onTagsSearchInput"
              @keydown.enter="onAddTagClick(tags.q)"
            >
              <template v-slot:selection="{ item, attrs, selected }">
                <v-chip
                  v-bind="attrs"
                  :color="item.color"
                  :input-value="selected"
                  small
                  close
                  label
                  outlined
                  @click.stop="onTagClick(item)"
                  @click:close="onRemoveTag(item)"
                >
                  <strong>{{ item.name }}</strong>&nbsp;
                </v-chip>
              </template>

              <template v-slot:no-data>
                <div class="px-2">
                  <template v-if="tags.q">
                    <v-btn
                      text
                      tile
                      small
                      @click="onAddTagClick(tags.q)"
                    >
                      {{ $t('Add a new "{name}" tag?', { name: tags.q }) }}
                    </v-btn>
                  </template>
                  <template v-else>
                    Нет тегов, введите новое название тега и нажмите кнопку добавить тег.
                  </template>
                </div>
              </template>
            </v-autocomplete>
          </div>
        </v-card-text>
      </v-card-text>

      <v-card-text class="py-0">
        <v-divider />
      </v-card-text>

      <v-card-actions class="d-flex justify-end px-4">
        <div>
          <v-btn
            text
            tile
            @click="onCancelClick"
          >
            {{ $tc('Cancel') }}
          </v-btn>
          <v-btn
            :loading="saveLoading"
            text
            tile
            @click="onSaveClick"
          >
            {{ $tc('Save') }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Contacts } from '@/api/Contacts'
import rules from '@/mixins/rules'
import { debounce } from 'vuetify/src/util/helpers'
import SContactDialogColorPicker from './SContactDialogColorPicker.vue'
import { ContactInterface, EmailInterface, EventInterface, PhoneInterface, TagInterface } from './interfaces'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  computed: {
    locationAddress () {
      const stack = []
      if (this.location.data.region) {
        stack.push(this.location.data.region)
      }
      if (this.location.data.city) {
        stack.push(this.location.data.city)
      }
      if (this.location.data.address) {
        stack.push(this.location.data.address)
      }

      if (stack.length === 0) {
        stack.push('Местоположение не определено')
      }

      return stack.join(', ')
    }
  },

  data () {
    return {
      available_tags: [
        {
          color: 'green',
          id: 1,
          name: 'tag1'
        },
        {
          color: 'red',
          id: 2,
          name: 'tag2'
        }
      ] as TagInterface[],
      colorPicker: false,
      email: {
        // Дополнительные адреса электронной почты
        additional: [] as EmailInterface[],
        ...{
          label: '',
          value: ''
        } as EmailInterface
      },
      first_name: '',
      last_name: '',
      location: {
        data: {
          address: '',
          city: '',
          region: ''
        },
        expanded: false
      },
      middle_name: '',
      notes: '',
      phone: {
        // Дополнительные номера
        additional: [] as PhoneInterface[],
        ...{
          label: '',
          value: ''
        } as PhoneInterface
      },
      saveLoading: false,
      tags: {
        loading: false,
        onTagsSearchInput: debounce((q: string) => {
          new Contacts()
            .getTags({ q })
            .then((response) => {
              this.tags.options = response.data
            })
        }, 250),
        options: [] as TagInterface[],
        q: '' as string,
        selected: [] as TagInterface[]
      }
    }
  },

  methods: {
    onAddTagClick (name: string, color = 'grey') {
      // new Contacts().addTag({
      //   color,
      //   name
      // })

      const id = -Math.abs(new Date().getTime())
      this.tags.options.push({
        color,
        id,
        name
      })

      this.tags.selected.push(this.tags.options[this.tags.options.length - 1])
      this.tags.q = ''
    },

    onCancelClick () {
      if (typeof this.on.cancel !== 'function') {
        throw new Error('The handler function is not defined!')
      }

      this.on.cancel()
    },

    onEmailAddClick () {
      this.email.additional.push({
        label: '',
        value: ''
      })
    },

    onEmailRemoveClick (index: number) {
      this.email.additional.splice(index, 1)
    },

    onPhoneAddClick () {
      this.phone.additional.push({
        label: '',
        value: ''
      })
    },

    onPhoneRemoveClick (index: number) {
      this.phone.additional.splice(index, 1)
    },

    onRemoveTag (item: TagInterface) {
      const index = this.tags.selected.findIndex(value => value?.id === item?.id && value?.name === item?.name && value?.color === item?.color)
      if (index > -1) {
        this.tags.selected.splice(index, 1)
      }
    },

    onSaveClick () {
      if (typeof this.on.save !== 'function') {
        throw new Error('The handler function is not defined!')
      }

      if (!this.$refs.form.validate()) {
        return
      }

      const emails: EmailInterface[] = []
      if (this.email.value) {
        emails.push({
          label: this.email.label,
          value: this.email.value
        })
      }

      const phones: PhoneInterface[] = []
      if (this.phone.value) {
        phones.push({
          label: this.phone.label,
          value: this.phone.value
        })
      }

      this.saveLoading = true
      this.on.save({
        address: this.location.data.address,
        city: this.location.data.city,
        emails: [].concat(emails, this.email.additional),
        first_name: this.first_name,
        last_name: this.last_name,
        middle_name: this.middle_name,
        notes: this.notes,
        phones: [].concat(phones, this.phone.additional),
        region: this.location.data.region,
        tags: this.tags.selected.map((value: TagInterface) => {
          return {
            color: value.color,
            id: value.id < 0 ? null : value.id,
            name: value.name
          }
        })
      })
    },

    async onTagClick (item: TagInterface) {
      const index = this.tags.options.findIndex(value => value?.id === item?.id && value?.name === item?.name)
      if (index > -1) {
        const instance = await this.$dialog.show(SContactDialogColorPicker, {
          on: {
            cancel: () => {
              instance.close()
            },
            ok: (value: string) => {
              this.tags.options[index].color = value

              // this.tags.selected.forEach(value1 => {
              //   this.tags.options.forEach(value2 => {
              //     if (value1.id === value2.id)
              //   })
              // })

              instance.close()
            }
          },
          waitForResult: false
        })
      }
    }
  },

  mixins: [rules],

  model: {
    event: 'change',
    prop: 'value'
  },

  mounted () {
    this.first_name = this.value?.first_name
    this.last_name = this.value?.last_name
    this.middle_name = this.value?.middle_name

    // Телефоны
    const phones = this.value.phones?.map(value => value) || []
    const phone = phones.length > 0 ? phones.shift() : { label: '', value: '' }
    this.phone.value = phone.value
    this.phone.label = phone.label
    this.phone.additional = phones.map((value: PhoneInterface) => {
      return {
        label: value.label,
        value: value.value
      }
    }) // Дополнительные номера телефонов

    // Адреса электронной почты
    const emails = this.value.emails?.map(value => value) || []
    const email = emails.length > 0 ? emails.shift() : { label: '', value: '' }
    this.email.value = email.value
    this.email.label = email.label
    this.email.additional = emails.map((value: EmailInterface) => {
      return {
        label: value.label,
        value: value.value
      }
    }) // Дополнительные адреса электронной почты

    // Местоположение
    this.location.data.region = this.value?.region
    this.location.data.city = this.value?.city
    this.location.data.address = this.value?.address

    // Заметки
    this.notes = this.value?.notes

    // Теги
    this.tags.selected = this.value?.tags

    new Contacts()
      .getTags()
      .then((response) => {
        console.log(response)
      })
  },

  name: 'SContactDialogEditor',

  props: {
    on: {
      default: null,
      type: Object as PropType<EventInterface>
    },

    self: {
      default: null,
      type: Object
    },

    title: {
      default: '',
      type: String
    },

    value: {
      default: () => {
        return {
          address: '',
          city: '',
          created_at: 0,
          emails: [],
          first_name: '',
          last_name: '',
          middle_name: '',
          notes: '',
          phones: [],
          region: '',
          tags: []
        } as ContactInterface
      },
      type: Object as PropType<ContactInterface>
    }
  }
})
</script>

<style lang="scss" scoped>
  .v-card-text--left {
    min-width: 100px;
  }
</style>
