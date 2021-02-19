<template>
  <DialogCard
    :actions="actions"
  >
    <template v-slot:title>
      <v-card-title>{{ $t('Create a new task') }}</v-card-title>
    </template>

    <!-- Form -->
    <v-form ref="form">

      <!-- Date and Time -->
      <v-row>
        <!-- Date -->
        <v-col>
          <v-menu
            ref="menuDatePicker"
            v-model="menuDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dDate"
                v-on="on"
                :label="$tc('Date')"
                :rules="[rules.notBlank]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dDate"
              @input="menuDatePicker = false"
              @click="$refs.menuDatePicker.save(dDate)"
              :locale="$i18n.locale"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <!-- Time -->
        <v-col>
          <v-menu
            ref="menuTimePicker"
            v-model="menuTimePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="dTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dTime"
                v-on="on"
                :label="$tc('Time')"
                :rules="[rules.notBlank]"
                readonly
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimePicker"
              v-model="dTime"
              format="24hr"
              :locale="$i18n.locale"
              @click:minute="$refs.menuTimePicker.save(dTime)"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Types -->
      <v-row>
        <v-col>
          <v-select
            v-model="dType"
            :items="types"
            :label="$tc('Type')"
            item-text="title"
            item-value="value"
            :rules="[rules.notBlank]"
            return-object
          >
            <template v-slot:selection="{ item }">
              <v-list-item-title>
                {{ $tc(item.title) }}
              </v-list-item-title>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-title>
                {{ $tc(item.title) }}
              </v-list-item-title>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- Ответственный -->
      <v-row>
        <v-col>
          <s-users
            ref="sUsersAutocomplete"
            v-model="dPerformer"
            :label="$tc('Responsible')"
            :rules="[rules.notBlank]"
            :disabled="responsibleDisabled"
          />
        </v-col>
      </v-row>

      <!-- Описание -->
      <v-row>
        <v-col>
          <v-textarea
            v-model="dDescription"
            rows="4"
            autofocus
          >
            <template v-slot:append>
              <v-btn
                icon
                text
                disabled
              >
                <v-icon>
                  mdi-microphone
                </v-icon>
              </v-btn>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-form>
  </DialogCard>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { UserInterface } from '@/api/Users'

interface RecordInterface {
  title: string;
  value: any;
  [key: string]: any
}

export interface DTaskInterface {
  date: string;
  time: string;
  type: RecordInterface;
  performer_id: number;
  description: string;
  automaticExecution: boolean;
}

interface IProps {
  performerId: string | number;
  performers: any;
  types: any;
  date: Record<string, unknown>;
  time: Record<string, unknown>;
  description: string;
  onSave: () => void;
  onCancel: <T>(scope: T) => void;
}

interface IData {
  menuDatePicker: boolean;
  menuTimePicker: boolean;
  dDate: undefined;
  dTime: undefined;
  dType: string;
  dPerformer?: UserInterface;
  dDescription: undefined;
  dAutomaticExecution: boolean;
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

interface IPropTypeType {
  title: string;
  value: string;
  disabled: boolean
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  components: { SUsers },

  props: {

    // Деактивировать возможность изменять ответственного
    responsibleDisabled: {
      type: Boolean,
      default: false
    },

    // Исполнитель по умолчанию
    performerId: {
      type: [Number, String],
      default: 0
    },

    // Типы задач (по умолчанию опции типов имеются)
    types: {
      type: Array as PropType<IPropTypeType[]>,
      default: (): IPropTypeType[] => {
        return [
          // Данные по умолчанию
          {
            title: 'Call',
            value: 'call',
            disabled: false
          },
          {
            title: 'Task',
            value: 'task',
            disabled: true
          },
          {
            title: 'Meeting',
            value: 'meeting',
            disabled: true
          },
          {
            title: 'Letter',
            value: 'letter',
            disabled: true
          },
          {
            title: 'Other',
            value: 'other',
            disabled: true
          }
        ]
      }
    },

    // Тип задачи
    type: {
      type: String as PropType<string>,
      default: () => 'call'
    },

    // Дата
    date: {
      type: [Object, String] as PropType<string | Date>,
      default: () => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        return date.toISOString().substr(0, 10)
      }
    },

    // Время
    time: {
      type: [Object, String] as PropType<string | Date>,
      default: () => new Date().toTimeString().substr(0, 5)
    },

    // Описание
    description: {
      type: String,
      default: () => ''
    },

    onSave: {
      type: Function as PropType<(scope: DTaskInterface) => boolean>,
      default: undefined
    },

    onCancel: {
      type: Function as PropType<() => void>,
      default: undefined
    }
  },

  data (): IData {
    return {
      menuDatePicker: false,
      menuTimePicker: false,
      dDate: '',
      dTime: '',
      dType: '',
      dPerformer: null,
      dDescription: undefined,
      dAutomaticExecution: false
    }
  },

  computed: {
    actions () {
      return {
        cancel: {
          flat: true,
          text: this.$tc('Cancel'),
          color: 'red',
          handle: () => {
            if (typeof this.$props.onCancel === 'function') {
              this.$props.onCancel()
            }
          }
        },

        save: {
          flat: true,
          text: this.$tc('Save'),
          handle: (): boolean => {
            if (typeof this.$props.onSave === 'function') {
              if (!this.$refs.form.validate()) {
                return false
              }

              return this.$props.onSave({
                date: this.dDate,
                automaticExecution: false,
                time: this.dTime,
                type: this.dType,
                performer_id: this.dPerformer.id,
                description: this.dDescription
              })
            }
          }
        }
      }
    },

    rules () {
      return {
        notBlank: (value: string) => !!value || this.$t('This field should not be blank.')
      }
    }
  },

  mounted () {
    if (this.time instanceof Date) {
      this.dTime = this.time.toTimeString().substr(0, 5)
    } else {
      this.dTime = this.time
    }

    if (this.date instanceof Date) {
      this.dDate = this.date.toTimeString().substr(0, 5)
    } else {
      this.dDate = this.date
    }

    this.dDescription = this.description
    this.dType = this.type

    this.$refs
      .sUsersAutocomplete
      .setDefault(this.performerId)
  }
})
</script>

<style lang="scss">
</style>
