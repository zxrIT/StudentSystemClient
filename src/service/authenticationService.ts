import httpAxios from "@/http";
import {IUser} from "@/typings/interface/base";

export function captchaService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/authentication/captcha").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function studentLoginService<T>(loginParam: IUser): Promise<T> {
    return httpAxios.post<T, T>("/authentication/student/login", loginParam).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function teacherLoginService<T>(loginParam: IUser): Promise<T> {
    return httpAxios.post<T, T>("/authentication/teacher/login", loginParam).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function verificationTokenService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/authentication/verification/token").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}