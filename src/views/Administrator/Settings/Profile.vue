<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <div class="text-h6">Профиль</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              :label="$tc('first_name')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              :label="$tc('last_name')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              :label="$tc('middle_name')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
          >
            <v-btn
              text
              tile
            >{{ $tc('Save') }}</v-btn>
          </v-col>
        </v-row>
        <!-- CONTACTS -->
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <div class="text-h6">Контакты</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              :label="$tc('contact_number')"
              persistent-hint
              required
            >
              <template v-slot:append>
                <v-tooltip bottom max-width="400">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
                  </template>
                  <span>{{ $tc('contact_number_tool_tip') }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              :label="$tc('contact_email')"
              persistent-hint
            ><template v-slot:append>
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{ $tc('contact_email_tool_tip') }}</span>
              </v-tooltip>
            </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>

</style>
