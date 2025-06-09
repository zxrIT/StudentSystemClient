import httpAxios from "@/http";
import {IPublishCourse} from "@/typings/interface/publish";

export function getPublishCourseService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/publish/getCourse/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getSelectPublishCourseService<T>(content: string, quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/publish/getSelectCourse/${content}/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function incrementPublishCourseService<T>(data: IPublishCourse): Promise<T> {
    return httpAxios.post<T, T>("/publish/incrementCourse", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function publishCourseService<T>(data): Promise<T> {
    return httpAxios.post<T, T>("/publish/publishCourse", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function revokePublishedCourseService<T>(data): Promise<T> {
    return httpAxios.put<T, T>("/publish/revokeCourse", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updatePublishCourseService<T>(data: IPublishCourse): Promise<T> {
    return httpAxios.put<T, T>("/publish/updateCourse", data).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function deletePublishCourseService<T>(id: string): Promise<T> {
    return httpAxios.delete<T, T>(`/publish/deleteCourse/${id}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}