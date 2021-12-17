<template>
  <v-sheet>
    <v-simple-table
      :height="height"
      class="contact-list"
      fixed-header
      dense
    >
      <template #default>
        <thead>
          <tr class="contact-list__th">
            <th class="text-left">
              {{ $tc('Operator') }}
            </th>
            <th class="text-left">
              {{ $tc('Status') }}
            </th>
            <th class="text-left">
              {{ $tc('Calls') }}
            </th>
            <th class="text-left">
              {{ $tc('Last call at') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="calls.length > 0">
            <tr
              v-for="(item, key) in calls"
              :key="key"
              class="contact-list__tr"
              @contextmenu="contextMenuShow(item, $event)"
            >
              <td class="contact-list__td_operator-name">
                <v-avatar
                  size="16"
                  color="primary"
                  class="white--text mr-1"
                >
                  <span style="font-size: 8px">{{ item.operator_abbreviation }}</span>
                </v-avatar>
                {{ item.operator_full_name }}
              </td>
              <td class="contact-list__td_online">
                <v-chip
                  v-if="item.operator_online"
                  color="green"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Online') }}
                </v-chip>
                <v-chip
                  v-else
                  color="grey"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Offline') }}
                </v-chip>
              </td>
              <td class="contact-list__td_call-count">
                {{ item.call_count }}
              </td>
              <td class="contact-list__td_next-call-at">
                <template v-if="item.last_call_at">
                  {{ $dayjs(item.last_call_at).format('DD.MM.YYYY HH:mm') }}
                </template>
                <template v-else>
                  —
                </template>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              :style="{ height: `${height - 32}px` }"
              class="text-center fill-height"
            >
              <td colspan="6">
                {{ $tc('No record found') }}
              </td>
            </tr>
          </template>
        </tbody>
      </template>
    </v-simple-table>
    <v-menu
      v-model="contextMenu.visible"
      :position-x="contextMenu.position.x"
      :position-y="contextMenu.position.y"
      min-width="200"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item
          v-for="(item, index) in contextMenuItems"
          :key="index"
          dense
          v-on="item.on"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import AppBase from '@/AppBase'
import { Prop } from 'vue-property-decorator'

@Component
export default class List extends AppBase {
  @Prop({ default: 200 }) readonly height: number;

  contextMenu = {
    visible: false,
    currentItem: null,
    position: {
      x: 0,
      y: 0
    }
  }

  get calls () {
    return this.$store.getters['autodialer/view/operators/items']
  }

  get contextMenuItems () {
    return [
      {
        title: this.$tc('Exclude from the list'),
        on: {
          click: this.excludeUser
        }
      }
    ]
  }

  private contextMenuShow (item: Record<string, any>, e: PointerEvent) {
    e.preventDefault()
    this.contextMenu.currentItem = item
    this.contextMenu.visible = false
    this.contextMenu.position.x = e.x
    this.contextMenu.position.y = e.y
    this.$nextTick(() => {
      this.contextMenu.visible = true
    })
  }

  private excludeUser () {
    const operatorId: number = this.contextMenu.currentItem.operator_id

    this.$dialog.confirm({
      title: this.$tc('Confirmation request'),
      text: this.$t('exclude_user', { user_name: this.contextMenu.currentItem.operator_full_name }).toString(),
      showClose: false,
      actions: {
        false: this.$tc('Cancel'),
        true: this.$tc('Yes')
      }
    }).then((result: boolean) => {
      if (result) {
        this.$store
          .dispatch('autodialer/view/operators/exclude', [operatorId])
          .then(() => {
            this.$toast.success('Success')
          }).catch((reason: Error) => {
            this.$toast.error(reason.message)
          })
      }
    })
  }
}
</script>

<i18n>
{
  "ru" : {
    "exclude_user": "Вы действительно хотите исключить пользователя \"{user_name}\"?"
  }
}
</i18n>

<style lang="scss" scoped>
.contact-list {}
.contact-list__th {
  cursor: pointer;
  user-select: none;
  white-space: nowrap !important;
}
.contact-list__tr {
  color: #5f6060;
  cursor: pointer;
  user-select: none;
  white-space: nowrap !important;
}

.contact-list__tr:nth-child(odd) {background-color: #607d8b17;}
.contact-list__tr:nth-child(even) {background-color: inherit;}
.contact-list__td {
  cursor: pointer;
  user-select: none;
}

.contact-list__td_operator-name {
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap !important;
}
.contact-list__td_calling {
  text-align: center;
  width: 10px;
  white-space: nowrap !important;
}
.contact-list__td_attempts {
  text-align: center;
  width: 10px;
  white-space: nowrap !important;
}
.contact-list__td_last-call-at {
  width: 10px;
  white-space: nowrap !important;
}
.contact-list__td_next-call-at {
  width: 10px;
  white-space: nowrap !important;
}

.contact-list__td_online {
  width: 10px;
  text-align: center;
  white-space: nowrap !important;
}

.contact-list__td_call-count {
  width: 10px;
  text-align: center;
  white-space: nowrap !important;
}

.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 1s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

</style>
