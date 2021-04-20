<template>
  <DialogCard
    :actions="actions"
  >
    <template v-slot:title>
      <v-card-title>{{ $t('Removing an employee') }}</v-card-title>
    </template>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col class="py-0">
          {{ text }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="py-0">
          <v-row>
            <v-col
              cols="12"
              md="6"
              lg="6"
              xl="6"
            >
              <v-radio-group v-model="radioGroup.value">
                <v-radio
                  v-for="(opt, key) in radioGroup.options"
                  :key="key"
                  v-bind="opt"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="6"
              lg="6"
              xl="6"
            >
              <s-users
                ref="sUsersAutocomplete"
                v-model="userSelect"
                :disabled="radioGroup.value === 'delete_along_with_contacts'"
                :rules="[rules.notBlank]"
                :error-messages="errorMessages"
                outlined
                dense
                autoload
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </DialogCard>
</template>

<script lang="ts">
import Vue from 'vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { IUser } from './IUser'
import rules from '@/mixins/rules'

interface IProps {
  [key: string]: any;
}

interface IData {
  userSelect: IUser;
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

interface MethodsInterface {
  onConfirm: (value: string) => void
}
export default Vue.extend<IData, MethodsInterface, IComputed, IProps>({
  components: { SUsers },

  computed: {
    actions () {
      return {
        cancel: {
          color: 'red',
          flat: true,
          handle: () => {
            if (typeof this.onCancel === 'function') {
              (this as any).onCancel()
            }
          },
          outlined: true,
          text: this.$tc('Cancel'),
          tile: true
        },

        delete: {
          disabled: this.deleteButtonDisabled,
          flat: true,
          handle: () => {
            if (typeof this.onDelete === 'function') {
              this.deleteButtonDisabled = true // Выключаю кнопку дабы избежать дребезг
              this.errorMessages = []

              setTimeout(() => {
                this.deleteButtonDisabled = false
                this.errorMessages = []
              }, 2000)

              // Полезная нагрузка, которая буде передана в качестве аргумента в метод обратного вызова
              const payload: unknown = {
                option: this.radioGroup.value
              }

              // Если выбрали вариант "Передать контакты сотруднику"
              if (this.radioGroup.value === 'transfer_contacts_to_an_employee') {
                if (!this.assertObjectHasAttribute(this.userSelect, 'id')) {
                  this.errorMessages.push(this.$tc('Select an employee'))
                  return false
                }

                payload.user_id = this.userSelect.id
              } else {
                payload.user_id = this.userDefaultId
              }

              this.onDelete(payload)
            }
          },
          text: this.$tc('Delete'),
          tile: true
        }
      }
    }
  },

  data () {
    return {
      deleteButtonDisabled: false,
      errorMessages: [],
      radioGroup: {
        options: [
          {
            label: 'Передать контакты сотруднику',
            value: 'transfer_contacts_to_an_employee'
          },
          {
            label: 'Удалить вместе с контактами',
            value: 'delete_along_with_contacts'
          }
        ],
        value: 'transfer_contacts_to_an_employee'
      },
      userSelect: null
    }
  },

  mixins: [rules],

  mounted () {
    this.$refs.sUsersAutocomplete.setDefault(this.userDefaultId)
  },

  props: {

    onCancel: {
      default: undefined,
      type: Function
    },

    onDelete: {
      default: undefined,
      type: Function
    },

    text: {
      default: () => {
        return ''
      },
      type: String
    },
    // Идентификатор пользователя по умолчанию
    userDefaultId: {
      default: 0,
      required: true,
      type: [Number, String]
    }
  },

  watch: {
    'radioGroup.value': {
      deep: true,
      handler (value: string) {
        switch (value) {
          case 'delete_along_with_contacts': {
            break
          }
          case 'transfer_contacts_to_an_employee': {
            this.$refs.sUsersAutocomplete.setDefault(this.userDefaultId)
            break
          }
        }
      }
    }
  }

})
</script>

<style lang="scss">
</style>
