export interface ITeacher {
    id: string;
    teacherId: string;
    teacherName: string;
    teacherIcon: string;
    teacherCollege: string;
    teacherJob: number;
    isCounselor: boolean;
}

export interface ITeacherView {
    id: string;
    teacherId: string;
    teacherName: string;
    teacherIcon: string;
    teacherCollege: string;
    teacherJob: string;
    isCounselor: string;
}