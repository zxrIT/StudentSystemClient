import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import {useSystemStore} from "@/store";
import {SYSTEM_ENUM_INTERNATION, SYSTEM_ENUM_TOPIC} from "@/typings/enum/systemEnum";

export const useInternationalization = () => {
    const systemStore = useSystemStore()
    return systemStore.systemState.internationalization === SYSTEM_ENUM_INTERNATION.ZH ? zhCn : en
}

export const useTopic = () => {
    const systemStore = useSystemStore()
    return systemStore.systemState.topic === SYSTEM_ENUM_TOPIC.LIGHT ?
        SYSTEM_ENUM_TOPIC.LIGHT : SYSTEM_ENUM_TOPIC.DARK
}