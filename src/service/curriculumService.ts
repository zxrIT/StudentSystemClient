import httpAxios from "@/http";

export function getCurriculumService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getCurriculum/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getSelectCurriculumService<T>(content: string, quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getSelectCurriculum/${content}/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}