import httpAxios from "@/http";
import {ICollege} from "@/typings/interface/college";

export function getCollegeService<T>(quantity: number, page: number): Promise<T> {
    return httpAxios.get<T, T>(`/user/college/getCollege/${quantity}/${page}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getCollegeNamesService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/user/college/getCollegeNames").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateCollegeService<T>(college: ICollege): Promise<T> {
    return httpAxios.put<T, T>("/user/college/updateCollege", college).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateCollegeIsExistenceService<T>(id: string): Promise<T> {
    return httpAxios.put<T, T>("/user/college/updateCollegeIsExistence", {id}).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}