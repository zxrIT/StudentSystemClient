import httpAxios from "@/http";

export function getClassNamesService<T>(): Promise<T> {
    return httpAxios.get<T, T>(`/class/getClassNames`).then((response: T) => {
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
