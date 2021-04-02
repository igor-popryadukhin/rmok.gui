<template>
  <DialogCard
    :actions="actions"
  >
    <template v-slot:title>
      <v-card-title>{{ $t('Редактор задач') }}</v-card-title>
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
              :first-day-of-week="1"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <!-- Time -->
        <v-col>
          <v-text-field
            v-model="dTime"
            type="time"
            :label="$tc('Time')"
            :rules="[rules.notBlank]"
          ></v-text-field>
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
import { $moment } from '@/plugins/moment'
import Vue, { PropType } from 'vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { UserInterface } from '@/api/Users'

interface RecordInterface {
  title: string;
  value: any;
  [key: string]: any
}

export interface DTaskInterface {
  /**
   * Unixtime
   **/
  planned_for: number;
  /**
   * Тип задачи
   **/
  type: RecordInterface;
  /**
   * Идентификатор исполнителя
   **/
  performer_id: number;
  /**
   * Описание
   **/
  description: string;
}

interface IProps {
  performerId: string | number;
  performers: any;
  types: any;
  plannedForUnixtime: number;
  date: Record<string, unknown>;
  time: Record<string, unknown>;
  description: string;
  onSave: () => void;
  onCancel: <T>(scope: T) => void;
}

interface IData {
  menuDatePicker: boolean;
  menuTimePicker: boolean;
  dDate: string;
  dTime: string;
  dType: string;
  dPerformer?: UserInterface;
  dDescription: undefined;
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
    /**
     * Запланировано на (в формате Unixtime)
     */
    plannedFor: {
      type: [Number],
      default: () => {
        return $moment().add(30, 'minute').unix()
      }
    },

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
      dDescription: undefined
    }
  },

  watch: {
    dTime (v: any) {
      console.log(v)
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
              console.log(`${this.dDate} ${this.dTime}`)
              console.log(this.$moment(`${this.dDate} ${this.dTime}`, 'YYYY-MM-DD hh:mm'))
              return this.$props.onSave({
                planned_for: this.$moment(`${this.dDate} ${this.dTime}`, 'YYYY-MM-DD hh:mm').unix(), // Unixtime
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
    this.dTime = this.$moment.unix(this.$props.plannedFor).format('hh:mm')
    this.dDate = this.$moment.unix(this.$props.plannedFor).format('YYYY-MM-DD')

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
