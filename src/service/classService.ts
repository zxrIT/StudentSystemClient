import httpAxios from "@/http";
import {IClass} from "@/typings/interface/class";

export function getClassNamesService<T>(): Promise<T> {
    return httpAxios.get<T, T>(`/user/class/getClassNames`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getClassNamesServiceByCollege<T>(collegeName: string): Promise<T> {
    return httpAxios.get<T, T>(`/user/class/getClassNamesByCollege/` + collegeName).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateClassNamesService<T>(className: IClass): Promise<T> {
    return httpAxios.put<T, T>("/user/class/updateClassName", className).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function deleteClassNameService<T>(classId: string): Promise<T> {
    return httpAxios.delete<T, T>(`/user/class/deleteClassName/${classId}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}
