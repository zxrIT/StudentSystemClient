import {defineStore} from "pinia";
import {IUserInfo} from "@/typings/interface/base";

export const useUserInfoStore = defineStore("userInfoStore", () => {
    const userInfoStore = reactive<IUserInfo>({
        name: "",
        id: "",
        token: "",
        roleId: 0,
        icon: "",
        className: "",
        job: "",
        college: ""
    })

    const resetUserInfo = () => {
        userInfoStore.name = ""
        userInfoStore.token = ""
        userInfoStore.roleId = 0;
        userInfoStore.icon = "";
        userInfoStore.className = "";
        userInfoStore.job = "";
        userInfoStore.college = "";
        userInfoStore.id = "";
    }

    const changeUserInfo = (userInfo: IUserInfo) => {
        console.log(userInfo)
        userInfoStore.id = userInfo.id
        userInfoStore.roleId = userInfo.roleId
        userInfoStore.token = userInfo.token
        userInfoStore.name = userInfo.name
        userInfoStore.icon = userInfo.icon
        if (userInfo.className) {
            userInfoStore.className = userInfo.className
        }
        if (userInfo.college) {
            userInfoStore.college = userInfo.college
        }
        if (userInfo.job) {
            userInfoStore.job = userInfo.job
        }
    }

    return {
        userInfoStore,
        changeUserInfo,
        resetUserInfo
    }
})