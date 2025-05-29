import axios from "axios"
import type {AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from "axios"

const httpAxios: AxiosInstance = axios.create({
    baseURL: "http://localhost:10000",
    timeout: 5000,
} as CreateAxiosDefaults)

httpAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (window.localStorage.getItem("loginId") !== undefined && window.localStorage.getItem("loginId") != null) {
        config.headers.loginId = window.localStorage.getItem("loginId")
    }
    if (window.localStorage.getItem("studentSystem-token") !== undefined && window.localStorage.getItem("studentSystem-token") != null) {
        config.headers.Authorization = "Bearer " + window.localStorage.getItem("studentSystem-token")
    }
    return config
}, (error: any) => {
    Promise.reject(error)
})

httpAxios.interceptors.response.use((response: AxiosResponse) => {
    return response.data
}, (error: any) => {
    Promise.reject(error)
})

export default httpAxios

