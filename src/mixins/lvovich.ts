import { incline } from 'lvovich'
import { LvovichPersonT } from 'lvovich/lib/incline'
import { DeclentionStrT } from 'lvovich/lib/inclineRules'
import Vue from 'vue'

export default Vue.mixin({
  methods: {
    $incline (person: LvovichPersonT, declension?: DeclentionStrT): LvovichPersonT {
      return incline(person, declension)
    }
  }
})
