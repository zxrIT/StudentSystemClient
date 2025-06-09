export interface IPublishCourse {
    id: string;
    courseId: string;
    courseName: string;
    courseType: number;
    courseCredits: number;
    courseCreditHour: number;
    courseLocation: string;
    teacherId: string;
    courseCapacity: number;
    publishStatus: number;
    courseGrade: number;
    courseCollege: string;
    remainderCourseCapacity: number
}

export interface IPublishCourseView {
    id: string;
    courseId: string;
    courseName: string;
    courseType: string;
    courseCredits: number;
    courseCreditHour: number;
    courseLocation: string;
    teacherId: string;
    courseCapacity: number;
    publishStatus: string;
    courseGrade: string;
    courseCollege: string
}