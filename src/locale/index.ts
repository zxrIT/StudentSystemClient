import {createI18n} from 'vue-i18n'
import enMessage from "@/locale/en"
import zhMessage from "@/locale/zh"

const messages = {
    en: {message: enMessage},
    zh: {message: zhMessage}
}

const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'zh',
    messages
})

export default i18n