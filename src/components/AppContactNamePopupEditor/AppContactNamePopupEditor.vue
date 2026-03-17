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
          v-model="form.first_name"
          :label="$tc('First name')"
          :error-messages="fieldFirstNameErrors"
          dense
          outlined
          flat
          @input="$v.form.first_name.$touch()"
          @blur="$v.form.first_name.$touch()"
        />

        <v-text-field
          v-model="form.last_name"
          :label="$tc('Last name')"
          :error-messages="fieldLastNameErrors"
          dense
          outlined
          flat
          @input="$v.form.last_name.$touch()"
          @blur="$v.form.last_name.$touch()"
        />

        <v-text-field
          v-model="form.middle_name"
          :label="$tc('Middle name')"
          :error-messages="fieldMiddleNameErrors"
          dense
          outlined
          flat
          @input="$v.form.middle_name.$touch()"
          @blur="$v.form.middle_name.$touch()"
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

import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import Vuelidate, { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

Vue.use(Vuelidate);

@Component({
  mixins: [validationMixin],
  validations: {
    form: {
      first_name: { required, maxLength: maxLength(255) },
      last_name: { required, maxLength: maxLength(255) },
      middle_name: { maxLength: maxLength(255) }
    }
  },
  computed: {
    fieldFirstNameErrors () {
      const errors = [];

      if (!this.$v.form.first_name.$dirty) return errors;
      !this.$v.form.first_name.maxLength && errors.push('First name must be at most 255 characters long.');
      !this.$v.form.first_name.required && errors.push('First name is required.');
      return errors.map((e) => this.$tc(e));
    },
    fieldLastNameErrors () {
      const errors = [];

      if (!this.$v.form.last_name.$dirty) return errors;
      !this.$v.form.last_name.maxLength && errors.push('Last name must be at most 255 characters long.');
      !this.$v.form.last_name.required && errors.push('Last name is required.');
      return errors.map((e) => this.$tc(e));
    },
    fieldMiddleNameErrors () {
      const errors = [];

      if (!this.$v.form.middle_name.$dirty) return errors;
      !this.$v.form.middle_name.maxLength && errors.push('Middle name must be at most 255 characters long.');
      return errors.map((e) => this.$tc(e));
    }
  }
})
export default class AppContactNamePopupEditor extends Vue {
  @Prop({ type: String }) readonly firstName!: string
  @Prop({ type: String }) readonly lastName!: string
  @Prop({ type: String }) readonly middleName!: string

  menuVisible = false
  oldForm = {
    first_name: '',
    last_name: '',
    middle_name: ''
  }
  form = {
    first_name: '',
    last_name: '',
    middle_name: ''
  }

  get newFrom () {
    return this.form;
  }

  get isEditable() {
    return JSON.stringify(this.form) === JSON.stringify(this.newFrom);
  }

  @Emit('click:btn:cancel')
  private clickBtnCancel () {
    for(const k in this.oldForm) this.form[k]=this.oldForm[k];
    return;
  }

  @Emit('click:btn:save')
  private clickBtnSave () {
    this.menuVisible = false;
    return { ...this.form };
  }

  @Watch('menuVisible')
  private menuVisibleWatch(value: boolean) {
    if (value) {
      this.readProps();
    }
  }

  public created () {
    this.readProps();
  }

  private readProps () {
    this.form.first_name = this.firstName;
    this.form.last_name = this.lastName;
    this.form.middle_name = this.middleName;

    for(const k in this.form) this.oldForm[k]=this.form[k];
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "Last name is required.": "Требуется фамилия.",
    "First name is required.": "Имя обязательно!",
    "First name must be at most 255 characters long.": "Имя должно содержать не более 255 символов.",
    "Last name must be at most 255 characters long.": "Длина фамилии не должна превышать 255 символов.",
    "Middle name must be at most 255 characters long.": "Отчество должно содержать не более 255 символов."
  }
}
</i18n>
