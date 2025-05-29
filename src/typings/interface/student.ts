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