import {createApp} from 'vue'
import i18n from "@/locale";
import "@/assets/less/reset.less"
import 'element-plus/dist/index.css'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import PrimeVue from 'primevue/config';
import {createPinia, Pinia} from "pinia";
import App from './App.vue'
import aura from '@primeuix/themes/aura';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

const pinia: Pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(pinia).use(i18n).use(PrimeVue, {
    theme: {
        preset: aura,
        options: {
            darkModeSelector: false || 'none',
        }
    }
}).mount('#app')
