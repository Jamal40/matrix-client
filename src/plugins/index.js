/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import i18n from '@/i18n'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(i18n)
    .use(router)
    .use(pinia)
}
