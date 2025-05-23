import httpAxios from "@/http";

export function getTeacherService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/teacher/getTeacher/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}