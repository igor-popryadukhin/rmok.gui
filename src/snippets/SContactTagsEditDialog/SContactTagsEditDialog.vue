<template>
  <v-card width="450">
    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-text class="py-0">
      <v-divider />
    </v-card-text>

    <v-card-text>
      <v-text-field
        v-model="tagName"
        :label="$tc('Name')"
        clearable
        outlined
        dense
        hide-details
      />
    </v-card-text>

    <v-card-text class="pt-0">
      <v-color-picker
        v-model="tagColor"
        mode="hexa"
        width="450px"
        show-swatches
        hide-canvas
        hide-inputs
        hide-sliders
      />
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
          color="primary"
          text
          tile
          @click="onSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Contacts } from '@/api/Contacts'
import { ContactTagInterface } from '@/api/Schemas/ContactInterface'
import Vue, { PropType } from 'vue'

export interface EventInterface {
  /**
   *
   * @param data Данные контакта.
   * @param resolve Разрешает обещание.
   */
  created: (id: number) => void;
  /**
   * Происходит при нажатии кнопки Отмена
   */
  cancel: () => void;
}

export default Vue.extend({
  name: 'SContactTagsEditDialog',

  props: {
    title: {
      type: String,
      default: () => ''
    },

    on: {
      default: null,
      type: Object as PropType<EventInterface>
    },

    value: {
      type: Object as PropType<ContactTagInterface>,
      default: () => {
        return {
          id: -Math.abs(new Date().getTime()),
          name: '',
          color: 'grey'
        }
      }
    }
  },

  data () {
    return {
      saveLoading: false,
      tagId: 0 as number,
      tagName: '' as string,
      tagColor: '' as string
    }
  },

  created () {
    this.tagId = this.value?.id || 0
    this.tagName = this.value?.name || ''
    this.tagColor = this.value?.color || ''
  },

  methods: {
    onSaveClick () {
      new Contacts()
        .addTag({
          name: this.tagName,
          color: this.tagColor
        }).then((id: number) => {
          if (typeof this.on.created === 'function') {
            this.on.created(id)
          }
          this.tagName = ''
          this.tagColor = ''
        })
    },

    onCancelClick () {
      if (typeof this.on.cancel === 'function') {
        this.on.cancel()
      }
    }
  }
})
</script>
