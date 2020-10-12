import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const loadedPackages: string[] = [] // our default language that is preloaded

const locale: string = process.env.VUE_APP_I18N_LOCALE

const i18n = new VueI18n({
  locale,
  silentTranslationWarn: true,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru'
})

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
