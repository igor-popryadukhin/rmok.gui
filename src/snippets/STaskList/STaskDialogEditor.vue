<template>
  <DialogCard
    :actions="actions"
  >
    <template #title>
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
            <template #activator="{ on }">
              <v-text-field
                v-model="dDate"
                :label="$tc('Date')"
                :rules="[rules.notBlank]"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dDate"
              :locale="$i18n.locale"
              :first-day-of-week="1"
              @input="menuDatePicker = false"
              @click="$refs.menuDatePicker.save(dDate)"
            />
          </v-menu>
        </v-col>

        <!-- Time -->
        <v-col>
          <v-text-field
            v-model="dTime"
            type="time"
            :label="$tc('Time')"
            :rules="[rules.notBlank]"
          />
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
            <template #selection="{ item }">
              <v-list-item-title>
                {{ $tc(item.title) }}
              </v-list-item-title>
            </template>
            <template #item="{ item }">
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
            <template #append>
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

interface Props {
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

interface Data {
  menuDatePicker: boolean;
  menuTimePicker: boolean;
  dDate: string;
  dTime: string;
  dType: string;
  dPerformer?: UserInterface;
  dDescription: undefined;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface IPropTypeType {
  title: string;
  value: string;
  disabled: boolean
}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { SUsers },

  data (): Data {
    return {
      dDate: '',
      dDescription: undefined,
      dPerformer: null,
      dTime: '',
      dType: '',
      menuDatePicker: false,
      menuTimePicker: false
    }
  },

  computed: {
    actions () {
      return {
        cancel: {
          color: 'red',
          flat: true,
          handle: () => {
            if (typeof this.$props.onCancel === 'function') {
              this.$props.onCancel()
            }
          },
          text: this.$tc('Cancel')
        },

        save: {
          flat: true,
          handle: (): boolean => {
            if (typeof this.$props.onSave === 'function') {
              if (!this.$refs.form.validate()) {
                return false
              }
              return this.$props.onSave({
                description: this.dDescription,
                performer_id: this.dPerformer.id,

                planned_for: this.$moment(`${this.dDate} ${this.dTime}`, 'YYYY-MM-DD HH:mm').utc().unix(),
                // Unixtime
                type: this.dType
              })
            }
          },
          text: this.$tc('Save')
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
    this.dTime = this.$moment.unix(this.$props.plannedFor).format('HH:mm')
    this.dDate = this.$moment.unix(this.$props.plannedFor).format('YYYY-MM-DD')

    this.dDescription = this.description
    this.dType = this.type

    this.$refs
      .sUsersAutocomplete
      .setDefault(this.performerId)
  },

  props: {

    // Описание
    description: {
      default: () => '',
      type: String
    },

    onCancel: {
      default: undefined,
      type: Function as PropType<() => void>
    },

    onSave: {
      default: undefined,
      type: Function as PropType<(scope: DTaskInterface) => boolean>
    },

    // Исполнитель по умолчанию
    performerId: {
      default: 0,
      type: [Number, String]
    },

    /**
     * Запланировано на (в формате Unixtime)
     */
    plannedFor: {
      default: () => {
        return $moment().add(30, 'minute').unix()
      },
      type: [Number]
    },

    // Деактивировать возможность изменять ответственного
    responsibleDisabled: {
      default: false,
      type: Boolean
    },

    // Тип задачи
    type: {
      default: () => 'call',
      type: String as PropType<string>
    },

    // Типы задач (по умолчанию опции типов имеются)
    types: {
      default: (): IPropTypeType[] => {
        return [
          // Данные по умолчанию
          {
            disabled: false,
            title: 'Call',
            value: 'call'
          },
          {
            disabled: true,
            title: 'Task',
            value: 'task'
          },
          {
            disabled: true,
            title: 'Meeting',
            value: 'meeting'
          },
          {
            disabled: true,
            title: 'Letter',
            value: 'letter'
          },
          {
            disabled: true,
            title: 'Other',
            value: 'other'
          }
        ]
      },
      type: Array as PropType<IPropTypeType[]>
    }
  },

  watch: {
    dTime (v: any) {
      console.log(v)
    }
  }
})
</script>

<style lang="scss">
</style>
