import httpAxios from "@/http";

export function getStudentCourse<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/selection/getStudentCourse/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}