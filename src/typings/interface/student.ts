import {USER_GRADE, USER_ROLE} from "@/typings/enum/user";

export interface IStudent {
    studentId: string;
    studentName: string;
    studentClass: string;
    studentSex: number;
    studentIcon: string;
    studentGrade: number;
    roleId: number;
    college: string,
    id: string;
}

export interface IStudentCreate {
    studentId: string;
    studentName: string;
    studentClass: string
    studentSex: number;
    studentGrade: number,
    roleId: number;
    college: "",
    iconImage: File
}

export interface IStudentCreateView {
    studentId: string;
    studentName: string;
    studentClass: string
    studentSex: number;
    studentGrade: USER_GRADE,
    roleId: USER_ROLE,
    college: "",
    iconImage: File
}

export interface IStudentView {
    studentId: string;
    studentName: string;
    studentClass: string;
    studentSex: number;
    studentIcon: string;
    studentGrade: string;
    roleId: string,
    college: string,
    id: string;
}

export interface IStudentSimple {
    studentId: string;
    studentName: string;
    studentClass: string;
    studentIcon: string;
    studentGrade: string;
    id: string;
}