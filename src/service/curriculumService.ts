import httpAxios from "@/http";
import {ICurriculum} from "@/typings/interface/curriculum";

export function getCurriculumService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getCurriculum/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getCurriculumByIdService<T>(courseId:string): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getCurriculumById/${courseId}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getCurriculumDeleteService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getDeleteCurriculum/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function changIsExistenceService<T>(id: string): Promise<T> {
    return httpAxios.put<T, T>(`/curriculum/changIsExistence/${id}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function changDeleteIsExistenceService<T>(id: string): Promise<T> {
    return httpAxios.put<T, T>(`/curriculum/changDeleteIsExistence/${id}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function removeCurriculumService<T>(id: string): Promise<T> {
    return httpAxios.delete<T, T>(`/curriculum/removeCurriculum/${id}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function moveCurriculumService<T>(id: string): Promise<T> {
    return httpAxios.delete<T, T>(`/curriculum/moveCurriculum/${id}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function incrementCurriculumService<T>(data: ICurriculum): Promise<T> {
    return httpAxios.post<T, T>("/curriculum/incrementCurriculum", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateCurriculumService<T>(data: ICurriculum): Promise<T> {
    return httpAxios.put<T, T>("/curriculum/updateCurriculum", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateDeleteCurriculumService<T>(data: ICurriculum): Promise<T> {
    return httpAxios.put<T, T>("/curriculum/updateDeleteCurriculum", data).then((response: T) => {
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

export function getDeleteSelectCurriculumService<T>(content: string, quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/curriculum/getDeleteSelectCurriculum/${content}/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}