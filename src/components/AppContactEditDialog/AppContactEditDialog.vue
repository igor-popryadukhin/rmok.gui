<template>
  <v-dialog
    v-model="visibleSync"
    :width="width"
  >
    <v-card>
      <div class="d-flex justify-space-between">
        <div>
          <v-card-title class="py-3">
            {{ title }}
          </v-card-title>
        </div>
      </div>

      <v-card-text class="py-0">
        <v-divider />
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="fieldFirstNameSync"
              label="Имя"
              dense
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="fieldLastNameSync"
              label="Фамилия"
              dense
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="fieldMiddleNameSync"
              label="Отчество"
              dense
            />
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Телефоны -->
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              label="Номер"
              dense
            />
          </v-col>
          <v-col>
            <v-text-field
              color="primary"
              label="Ярлык"
              dense
            >
              <template #append-outer>
                <v-btn
                  icon
                  x-small
                  outlined
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Адреса электронной почты -->
      <v-card-text class="d-flex">
        <v-row>
          <v-col>
            <v-text-field
              label="Адрес электронной почты"
              dense
            />
          </v-col>
          <v-col>
            <v-text-field
              color="primary"
              label="Ярлык"
              dense
            >
              <template #append-outer>
                <v-btn
                  icon
                  x-small
                  outlined
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Местоположение -->
      <v-card-text>
        <v-row>
          <v-col class="py-0">
            <v-text-field
              label="Регион"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-text-field
              label="Город"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-text-field
              label="Адрес"
              dense
            />
          </v-col>
        </v-row>

        <!--      <v-row class="mt-1">-->
        <!--        <v-col class="py-0 d-flex justify-space-between">-->
        <!--          <div>-->
        <!--            <span v-show="!location.expanded">{{ locationAddress }}</span>-->
        <!--          </div>-->
        <!--          <div>-->
        <!--            <v-btn-->
        <!--              text-->
        <!--              tile-->
        <!--              x-small-->
        <!--              @click="location.expanded = !location.expanded"-->
        <!--            >-->
        <!--              {{ location.expanded ? $tc('Свернуть') : $tc('Ещё') }}-->
        <!--            </v-btn>-->
        <!--          </div>-->
        <!--        </v-col>-->
        <!--      </v-row>-->
      </v-card-text>

      <!-- Заметки -->
      <v-card-text>
        <v-textarea
          label="Заметки"
          rows="2"
        />
      </v-card-text>

      <!-- Теги -->
      <v-card-text>
        tags
      </v-card-text>

      <v-card-text class="py-0">
        <v-divider />
      </v-card-text>

      <v-card-actions class="d-flex justify-end px-4">
        <v-btn
          text
          tile
          small
          @click="actionCancel"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          text
          tile
          small
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop, PropSync, Emit } from 'vue-property-decorator'

@Component
export default class AppContactEditDialog extends Vue {
  @Prop({ default: null }) readonly title: string
  @Prop({ default: false }) readonly showClose: boolean
  @Prop({ default: 850 }) readonly width: number
  @PropSync('visible', { type: Boolean }) visibleSync!: boolean
  /// ////////////////////////////////////////////////////////////////////
  @PropSync('fieldFirstName', { type: String }) fieldFirstNameSync!: string
  @PropSync('fieldLastName', { type: String }) fieldLastNameSync!: string
  @PropSync('fieldMiddleName', { type: String }) fieldMiddleNameSync!: string
  @PropSync('fieldPhones', { type: Array }) fieldPhonesSync!: Array<Record<string, any>>

  @Emit('action:cancel')
  private actionCancel () {
    this.visibleSync = false
  }
}
</script>

<style scoped>

</style>
