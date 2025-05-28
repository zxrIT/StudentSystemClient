import {defineStore} from "pinia";
import {IUserInfo} from "@/typings/interface/base";

export const useUserInfoStore = defineStore("userInfoStore", () => {
    const userInfoStore = reactive<IUserInfo>({
        name: "",
        id: "",
        token: "",
        roleId: 0,
        icon: "",
        className: ""
    })

    const changeUserInfo = (userInfo: IUserInfo) => {
        userInfoStore.id = userInfo.id
        userInfoStore.roleId = userInfo.roleId
        userInfoStore.token = userInfo.token
        userInfoStore.name = userInfo.name
        userInfoStore.icon = userInfo.icon
        userInfoStore.className = userInfo.className
    }

    return {
        userInfoStore,
        changeUserInfo,
    }
})