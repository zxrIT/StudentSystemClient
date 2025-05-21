export interface IStudent {
    studentId: string;
    studentName: string;
    studentClass: string;
    studentSex: number;
    studentIcon: string;
    studentGrade: number;
    roleId: number
}

export interface IStudentView {
    studentId: string;
    studentName: string;
    studentClass: string;
    studentSex: number;
    studentIcon: string;
    studentGrade: string;
    roleId: string
}