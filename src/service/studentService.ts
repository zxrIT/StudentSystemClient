import httpAxios from "@/http";
import {IStudent} from "@/typings/interface/student";

export function getStudentService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/student/getStudent/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getStudentByClassService<T>(quantity: number, page: number, className: string): Promise<T> {
    return httpAxios.get<T, T>(`/student/getStudentByClass/${quantity}/${page}/${className}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getStudentSelectService<T>(payload: number, content: string, quantity: number,
                                           page: number): Promise<T> {
    return httpAxios.get<T, T>(`/student/getSelectStudent/${payload}/${content}/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function resetPasswordService<T>(studentId: string): Promise<T> {
    return httpAxios.post<T, T>("/student/resetPassword", {studentId}).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateStudentService<T>(student: IStudent): Promise<T> {
    return httpAxios.put<T, T>("/student/updateStudent", student).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function deleteStudentService<T>(studentId: string): Promise<T> {
    return httpAxios.delete<T, T>(`/student/deleteStudent/${studentId}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}