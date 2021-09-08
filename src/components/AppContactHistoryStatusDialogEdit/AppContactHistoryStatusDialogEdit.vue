<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="450"
  >
    <v-card
      tile
      flat
      elevation="10"
    >
      <v-card-title>
        {{ $tc('Change of status') }}
      </v-card-title>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-card-text>
          <v-select
            v-model="statusValue"
            outlined
            dense
            :items="items"
            :rules="[(val) => !!val && +val > 0 || $tc('Required field') ]"
            item-value="id"
            item-text="name"
            item-color="color"
          />
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          small
          tile
          text
          @click="$emit('btn:cancel')"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="saveAvailable"
          small
          tile
          text
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'AppContactHistoryStatusDialogEdit',

  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    items: {
      type: Array as PropType<Record<any, any>[]>,
      required: true,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: [Number, Object],
      default: () => null
    }
  },

  data () {
    return {
      oldStatusValue: this.value,
      statusValue: this.value,
      dialogVisible: this.visible
    }
  },

  computed: {
    saveAvailable () {
      return this.$data.oldStatusValue === this.$data.statusValue
    }
  },

  watch: {
    value (val: number) {
      this.statusValue = val
    },
    statusValue (val: number) {
      this.$emit('update', val)
    },
    dialogVisible (val: boolean) {
      this.$emit('update:visible', val)
    }
  },

  methods: {
    onBtnSaveClick () {
      if (!this.$refs.form.validate(true)) { return }

      this.$emit('btn:save')
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {}
}
</i18n>
