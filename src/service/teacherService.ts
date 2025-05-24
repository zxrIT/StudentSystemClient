import httpAxios from "@/http";
import {ITeacher} from "@/typings/interface/teacher";

export function getTeacherService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/teacher/getTeacher/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getAllTeacherService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/teacher/getAllTeacher").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getAllCounselorService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/teacher/getAllCounselor").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getTeacherSelectService<T>(payload: number, content: string | number, quantity: number,
                                           page: number): Promise<T> {
    return httpAxios.get<T, T>(`/teacher/getSelectTeacher/${payload}/${content}/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateTeacherService<T>(teacher: ITeacher): Promise<T> {
    return httpAxios.put<T, T>("/teacher/updateTeacher", teacher).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function resetTeacherPasswordService<T>(teacherId: string): Promise<T> {
    return httpAxios.post<T, T>(`/teacher/resetPassword/${teacherId}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}