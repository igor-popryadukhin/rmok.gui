<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    offset-x
    nudge-width="280"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
    </template>

    <v-card>
      <v-card-text class="pb-0">
        <v-text-field
          v-model="form.city"
          :label="$tc('City')"
          :error-messages="fieldCityErrors"
          dense
          outlined
          flat
          @input="$v.form.city.$touch()"
          @blur="$v.form.city.$touch()"
        />

        <v-text-field
          v-model="form.region"
          :label="$tc('Region')"
          :error-messages="fieldRegionErrors"
          dense
          outlined
          flat
          @input="$v.form.region.$touch()"
          @blur="$v.form.region.$touch()"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          small
          tile
          @click="clickBtnCancel"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          :disabled="isEditable && $v.$invalid"
          color="primary"
          text
          small
          tile
          @click="clickBtnSave"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit, Prop, Watch } from 'vue-property-decorator'
import Vuelidate, { validationMixin } from 'vuelidate'
import { maxLength } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

@Component({
  mixins: [validationMixin],
  validations: {
    form: {
      city: { maxLength: maxLength(255) },
      region: { maxLength: maxLength(255) }
    }
  },
  computed: {
    fieldCityErrors () {
      const errors = []

      if (!this.$v.form.city.$dirty) return errors
      !this.$v.form.city.maxLength && errors.push('The city name cannot contain more than 255 characters.')
      return errors.map((e) => this.$tc(e))
    },
    fieldRegionErrors () {
      const errors = []

      if (!this.$v.form.region.$dirty) return errors
      !this.$v.form.region.maxLength && errors.push('The region name cannot contain more than 255 characters.')
      return errors.map((e) => this.$tc(e))
    }
  }
})
export default class AppContactLocationPopupEditor extends Vue {
  @Prop({ type: String }) readonly city!: string
  @Prop({ type: String }) readonly region!: string

  menuVisible = false
  oldForm = {
    city: '',
    region: ''
  }
  form = {
    city: '',
    region: ''
  }

  get newFrom () {
    return this.form
  }

  get isEditable() {
    return JSON.stringify(this.form) === JSON.stringify(this.newFrom)
  }

  @Watch('menuVisible')
  private menuVisibleWatch(value: boolean) {
    if (value) {
      this.readProps()
    }
  }

  @Emit('click:btn:cancel')
  private clickBtnCancel () {
    for(const k in this.oldForm) this.form[k]=this.oldForm[k];
    return
  }

  @Emit('click:btn:save')
  private clickBtnSave () {
    this.menuVisible = false
    return { ...this.form }
  }

  public created () {
    this.readProps()
  }

  private readProps () {
    this.form.city= this.city
    this.form.region = this.region

    for(const k in this.form) this.oldForm[k]=this.form[k];
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "The city name cannot contain more than 255 characters.": "Название города не может содержать более 255 символов.",
    "The region name cannot contain more than 255 characters.": "Название региона не может содержать более 255 символов."
  }
}
</i18n>
