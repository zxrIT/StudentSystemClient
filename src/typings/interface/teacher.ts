export interface ITeacher {
    teacherId: string;
    teacherName: string;
    teacherIcon: string;
    teacherCollege: string;
    teacherJob: number;
    isCounselor: boolean;
}

export interface ITeacherView {
    teacherId: string;
    teacherName: string;
    teacherIcon: string;
    teacherCollege: string;
    teacherJob: string;
    isCounselor: string;
}