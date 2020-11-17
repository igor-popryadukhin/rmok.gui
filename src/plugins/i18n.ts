import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const loadedPackages: string[] = [] // our default language that is preloaded

const locale: string | undefined = process.env.VUE_APP_I18N_LOCALE

const i18n = new VueI18n({
  locale,
  silentTranslationWarn: true,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
  pluralizationRules: {
    /**
     * @param choice {number} индекс выбора, переданный в $tc: `$tc('path.to.rule', choiceIndex)`
     * @param choicesLength {number} общее количество доступных вариантов
     * @returns финальный индекс для выбора соответственного варианта слова
     */
    ru (choice: number, choicesLength: number) {
      // this === VueI18n instance, so the locale property also exists here

      if (choice === 0) {
        return 0
      }

      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1

      if (choicesLength < 4) {
        return (!teen && endsWithOne) ? 1 : 2
      }
      if (!teen && endsWithOne) {
        return 1
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
      }

      return (choicesLength < 4) ? 2 : 3
    }
  }
})

class VueI18nPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      i18n: {
        get () {
          return i18n
        }
      }
    })
  }
}

Vue.use(new VueI18nPlugin())

export default i18n

function setI18nLanguage (lang: string) {
  i18n.locale = lang
  // todo: Warning, not working in SSR!
  /* eslint-disable */
  // @ts-ignore
  document.querySelector('html').setAttribute('lang', lang)
  /* eslint-enable */
  return lang
}

/**
 * Lazy loading language packs
 * -------------------------------------------------
 * @param lang
 * @param name
 * @returns {Promise|Promise<any>|*|PromiseLike<any>}
 */
export function loadLanguageAsync (lang: string, name: string) {
  return new Promise((resolve) => {
    const ln = `${lang}-${name}`
    if (loadedPackages.includes(ln)) {
      resolve()
      return
    }
    loadedPackages.push(ln)

    return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}/${name}.json`).then(
      (messages) => {
        resolve()
        i18n.mergeLocaleMessage(lang, messages.default)
        return setI18nLanguage(lang)
      }
    )
  })
}
