<template>
  <div>
    <v-dialog
      v-model="show"
      max-width="450"
      persistent
      hide-overlay
    >
      <v-card tile>
        <v-card-title>{{ $tc('title') }}</v-card-title>
        <v-card-text class="py-0">
          <v-text-field
            v-model="form.name"
            :label="$tc('label.autodial_name')"
            :error-messages="nameErrors"
            dense
            outlined
            @input="$v.form.name.$touch()"
            @blur="$v.form.name.$touch()"
          />
        </v-card-text>

        <v-card-text class="py-0">
          <v-autocomplete
            v-model="form.project_id"
            :label="$tc('label.autodial_project')"
            :error-messages="projectIdErrors"
            :search-input.sync="project.q"
            :items="project.options"
            item-text="name"
            item-value="id"
            outlined
            dense
            @input="$v.form.project_id.$touch()"
            @blur="$v.form.project_id.$touch()"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            tile
            text
            @click="cancel"
          >
            {{ $tc('Cancel') }}
          </v-btn>
          <v-btn
            :disabled="$v.$invalid"
            small
            tile
            text
            @click="clickCreateEmit"
          >
            {{ $tc('Create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <slot
      name="activator"
      :on="{ click: onClick }"
    />
  </div>
</template>

<script lang="ts">
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue';
import debounce from '@/utils/debounce';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Watch } from 'vue-property-decorator';
import Vuelidate, { validationMixin } from 'vuelidate';
import { maxLength, minValue, numeric, required } from 'vuelidate/lib/validators';

Vue.use(Vuelidate);

interface Project {
  id: number;
  name: string;
}

@Component({
  components: { SmartAutocomplete },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(255)
      },
      project_id: {
        required,
        numeric,
        minValue: minValue(1)
      }
    }
  },
  computed: {
    nameErrors () {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push('message.error.required');
      !this.$v.form.name.maxLength && errors.push('message.error.name_max_length');
      return errors.map((e) => this.$tc(e));
    },
    projectIdErrors () {
      const errors = [];
      if (!this.$v.form.project_id.$dirty) return errors;
      !this.$v.form.project_id.required && errors.push('message.error.required_project');
      !this.$v.form.project_id.numeric && errors.push('message.error.required_project');
      !this.$v.form.project_id.minValue && errors.push('message.error.required_project');
      return errors.map((e) => this.$tc(e));
    }
  }
})
export default class AutoDialerCreateDialog extends Vue {
  show = false
  project = {
    q: '',
    options: [] as Project[]
  }

  form = {
    name: '',
    project_id: 0
  }

  @Emit('click:create')
  clickCreateEmit () {
    this.show = false;
    return this.form;
  }

  @Emit('click:cancel')
  clickCancelEmit () {
    return undefined;
  }

  @Watch('project.q')
  projectQWatch (value: string) {
    this.searchProjectsInServer(value);
  }

  public created () {
    this.searchProjectsInServer = debounce(this.searchProjectsInServer, 350);
  }

  private cancel () {
    this.show = false;
    this.clickCancelEmit();
  }

  private create () {
    if (!this.$v.$invalid) {
      return;
    }
    this.show = false;
    this.clickCreateEmit();
  }

  private onClick () {
    this.show = true;
  }

  /**
   * Поиск на сервере
   * @param q
   * @private
   */
  private searchProjectsInServer (q = '') {
    if (!q && this.project.options.length) {
      return;
    }

    if (this.project.options.findIndex((e) => String(e.name?.toLocaleLowerCase()).indexOf(q.toLocaleLowerCase()) > -1) > -1) {
      return;
    }

    this.$axios
      .get('/projects', { params: { q, count: 100 } })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        let responseItems: Project[] = response.data?.data || [] as Project[];

        if (this.project.options.length === 0) {
          this.project.options = responseItems;
        } else {
          responseItems
            .forEach((e1) => {
              if (this.project.options.findIndex((e2) => e2.id === e1.id) === -1) {
                this.project.options.push(e1);
              }
            });
        }

      });
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "title": "Создание нового автообзвона",
    "label": {
      "autodial_name": "Название",
      "autodial_project": "Проект"
    },
    "message": {
      "error": {
        "required": "Необходимо заполнить",
        "required_project": "Необходимо выбрать проект",
        "name_max_length": "Наименование должно содержать от 1 до 255 символов."
      }
    }
  }
}
</i18n>
