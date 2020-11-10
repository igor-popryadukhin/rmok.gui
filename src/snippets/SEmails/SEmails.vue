<template>
  <div>
    <v-row
      v-for="(item, key) in emails"
      :key="`item-${key}`"
    >
      <v-col
        cols="6"
        lg="6"
      >
        <v-text-field
          v-model="item.value"
          :label="textEmail"
          :rules="rulesEmail"
        >
          <template
            v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
            v-slot:prepend
          >
            <v-icon v-if="key === 0" class="pl-5 pr-9">mdi-email</v-icon>
            <v-spacer v-else class="pl-10 pr-10"></v-spacer>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="6"
      >
        <v-text-field
          v-model="item.label"
          :label="textLabel"
          :rules="rulesLabel"
          counter
        >
          <template v-slot:append-outer>
            <v-btn
              v-if="(emails.length - 1) === key"
              icon
              @click="onAddClick"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-else
              icon
              color="red"
              @click="onDeleteClick(key)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SEmails',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    textLabel: {
      type: String,
      default: 'Label'
    },
    textEmail: {
      type: String,
      default: 'Email'
    },
    rulesEmail: {
      type: [Array],
      default: undefined
    },
    rulesLabel: {
      type: [Array],
      default: undefined
    },
    value: {
      type: [Array],
      default: undefined
    }
  },

  data () {
    return {
      emails: [] as any[]
    }
  },

  watch: {
    value (value) {
      this.emails = value
    }
  },

  mounted () {
    this.$on('change', this.onChange)
  },

  created () {
    this.emails = this.value
  },

  beforeDestroy () {
    this.$off('change', this.onChange)
  },

  methods: {
    onChange (value: any) {
      this.emails = value
    },

    onAddClick () {
      this.doAddEmail()
    },

    doAddEmail (label = '', value = '') {
      this.emails.push({
        label,
        value
      })
    },

    onDeleteClick (index: number) {
      this.emails.splice(index, 1)
    }
  }
})
</script>

<style scoped>

</style>
