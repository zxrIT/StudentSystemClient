import {defineStore} from "pinia";
import {ISystemInterface} from "@/typings/interface/systemInterface";
import {SYSTEM_ENUM_INTERNATION, SYSTEM_ENUM_TOPIC} from "@/typings/enum/systemEnum";

export const useSystemStore = defineStore("systemStore", () => {
    const systemState = reactive<ISystemInterface>({
        internationalization: SYSTEM_ENUM_INTERNATION.ZH,
        topic: SYSTEM_ENUM_TOPIC.DARK,
    })

    return {
        systemState,
    }
}, {persist: true})