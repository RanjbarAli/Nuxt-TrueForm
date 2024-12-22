import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'
import * as lang from './languages.js'

let langOption = lang.en

export default defineNuxtModule({
  meta: {
    name: 'nuxt-trueform',
    configKey: 'trueform',
  },
  setup(options, nuxt) {
    if (typeof options?.lang == 'object') langOption = options.lang
    else if (typeof options?.lang == 'string') langOption = lang[options.lang]
    nuxt.options.runtimeConfig.public.trueform = {
      lang: langOption,
    }
    const resolver = createResolver(import.meta.url)
    addImports({
      name: 'TrueForm',
      as: 'TrueForm',
      from: resolver.resolve('./validation.js'),
    })
  },
})
