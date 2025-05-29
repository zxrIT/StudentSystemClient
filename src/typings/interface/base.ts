export interface IUser {
    username: string,
    password: string,
    code: string
}

export interface IUserInfo {
    token: string
    id: string,
    name: string
    roleId: number
    icon: string;
    className?: string;
    job?: string;
    college?: string
}