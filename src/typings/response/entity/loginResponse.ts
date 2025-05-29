export class ILoginResponseGenerateCaptcha {
    loginId: string;
    captchaBase64: string
}

export interface ILoginResponse {
    token: string;
    id: string;
    name: string;
    roleId: number;
    icon: string;
    className?: string;
    job?: string;
    college?: string
}