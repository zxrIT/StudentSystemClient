import httpAxios from "@/http";
import {IClass} from "@/typings/interface/class";

export function getClassNamesService<T>(): Promise<T> {
    return httpAxios.get<T, T>(`/class/getClassNames`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateClassNamesService<T>(className: IClass): Promise<T> {
    return httpAxios.put<T, T>("/class/updateClassName", className).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function deleteClassNameService<T>(classId: string): Promise<T> {
    return httpAxios.delete<T, T>(`/class/deleteClassName/${classId}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}
