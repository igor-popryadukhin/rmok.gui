<template>
  <v-dialog
    v-model="visible"
    max-width="400"
  >
    <v-card
      tile
      flat
    >
      <v-card-text class="pt-10">
        <v-text-field
          v-model="fieldNameSync"
          :error-messages="nameErrors"
          :label="$tc('Name')"
          dense
          outlined
          @input="$v.fieldNameSync.$touch()"
          @blur="$v.fieldNameSync.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-color-picker
          v-model="fieldColorSync"
          mode="rgba"
          class="ma-2"
          hide-inputs
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          tile
          @click="onBtnRandomColorClick"
        >
          {{ $tc('Random color') }}
        </v-btn>
        <v-btn
          text
          tile
          @click="clickCancelEmit"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="$v.$invalid"
          text
          tile
          @click="clickSaveEmit"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, PropSync, VModel } from 'vue-property-decorator'
import Vuelidate, { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

// eslint-disable-next-line no-use-before-define
@Component({
  mixins: [validationMixin],
  validations: {
    fieldNameSync: { required, maxLength: maxLength(255) }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.fieldNameSync.$dirty) return errors
      !this.$v.fieldNameSync.maxLength && errors.push('Name must be at most 255 characters long')
      !this.$v.fieldNameSync.required && errors.push('Name is required.')
      return errors.map((e) => this.$tc(e))
    }
  }
})
export default class StatusesGroupEditDialog extends AppBase {
  @PropSync('name', { type: String }) fieldNameSync!: string
  @PropSync('color', { type: String }) fieldColorSync!: string

  @VModel({ default: () => false }) visible!: boolean

  @Emit('click:save')
  clickSaveEmit () {
    this.visible = false
    return undefined
  }

  @Emit('click:cancel')
  clickCancelEmit () {
    this.visible = false
    return undefined
  }

  private onBtnRandomColorClick () {
    this.fieldColorSync = this.randomColor()
  }

  private randomColor (): string {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
</script>

<style scoped>

</style>
