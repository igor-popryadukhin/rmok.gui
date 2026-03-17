<template>
  <v-sheet class="overflow-x-auto">
    <div class="my-2">
      <v-textarea
        v-model="unsavedCallComment"
        rows="4"
        outlined
        hide-details
      />
    </div>
    <div class="mb-2">
      <v-tabs
        v-model="tabStatus"
        height="35"
      >
        <v-tab>
          {{ $tc('All') }}
        </v-tab>
        <v-tab
          v-for="(group, groupIndex) in contactProjectStatuses"
          :key="groupIndex"
        >
          <span :style="{ color: group.color }">{{ group.name }}</span>
        </v-tab>
        <v-spacer />
      </v-tabs>
      <v-divider />
      <v-tabs-items
        v-model="tabStatus"
      >
        <v-tab-item>
          <v-radio-group
            v-model="unsavedCallStatusId"
            column
          >
            <div
              v-for="(group, statusIndex) in contactProjectStatuses"
              :key="`v-row-status-${statusIndex}`"
            >
              <h5
                :key="`v-subheader-${statusIndex}`"
                :style="{ color: group.color }"
              >
                {{ group.name }}
              </h5>
              <v-divider
                :key="`v-divider-${statusIndex}`"
              />
              <v-radio-group
                v-model="unsavedCallStatusId"
                class="mb-3"
                hide-details
                dense
              >
                <div
                  v-for="(childItem, statusChildIndex) in group.children"
                  :key="`s-${statusChildIndex}`"
                  class="ml-2"
                >
                  <v-radio
                    :id="`v-radio-${childItem.id}`"
                    :key="`v-radio-${childItem.id + statusChildIndex}`"
                    :color="group.color"
                    :value="childItem.id"
                    @change="onRadioChange(childItem)"
                  >
                    <template #label>
                      <span>{{ childItem.name }}</span>
                    </template>
                  </v-radio>
                </div>
              </v-radio-group>
            </div>
          </v-radio-group>
        </v-tab-item>
        <v-tab-item
          v-for="(tabItem, tabIndex) in contactProjectStatuses"
          :key="`tab-item-status-${tabIndex}`"
        >
          <v-radio-group
            v-model="unsavedCallStatusId"
            hide-details
            dense
            column
          >
            <div
              v-for="(childItem, statusChildIndex) in tabItem.children"
              :key="`s-${statusChildIndex}`"
              class="ml-2"
            >
              <v-radio
                :id="`v-radio-${childItem.id}`"
                :key="`v-radio-${childItem.id + statusChildIndex}`"
                :color="childItem.color"
                :value="childItem.id"
                @change="onRadioChange(childItem)"
              >
                <template #label>
                  <span :style="{ color: childItem.color }">{{ childItem.name }}</span>
                </template>
              </v-radio>
            </div>
          </v-radio-group>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import StatusGroup from '@/api/interfaces/StatusGroup';
import AppBase from '@/AppBase';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component
export default class ContactsViewStatus extends AppBase {
  tabStatus = 0
  @Prop({ default: 300 }) readonly height!: number

  get contactProjectStatuses (): StatusGroup[] { return this.$store.getters['contacts/view/contact_project_statuses']; }

  get unsavedCallStatusId (): number { return this.$store.getters['contacts/view/unsaved_call/data_status_id']; }
  set unsavedCallStatusId (val: number) { this.$store.commit('contacts/view/unsaved_call/data_status_id', val); }
  get unsavedCallComment (): string { return this.$store.getters['contacts/view/unsaved_call/data_comment']; }
  set unsavedCallComment (val: string) { this.$store.commit('contacts/view/unsaved_call/data_comment', val); }

  private onRadioChange (status: any) {
    this.$emit('change', status.id);
  }
}

</script>

<style lang="scss" scoped>
.tabs {}
.tabs__tab {}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<i18n>
{
  "ru": {
    "delete_confirmation_1": "<b>Удалить {n} контакт?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_2": "<b>Удалить {n} контакта?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_3": "<b>Удалить {n} контактов?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation": "NaN | @:delete_confirmation_1 | @:delete_confirmation_2 | @:delete_confirmation_3",
    "selected_elements": " | Выбран {n} контакт |  Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>
