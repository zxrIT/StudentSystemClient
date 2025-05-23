import {FormRules} from "element-plus";
import {ITeacherRuleFrom} from "@/rules/interface/teacher";

export const useTeacherRules = reactive<FormRules<ITeacherRuleFrom>>({
    teacherId: [
        {required: true, message: '请输入教师序号', trigger: 'change'},
    ],
    teacherName: [
        {required: true, message: '请输入教师名', trigger: 'change'},
    ],
    teacherCollege: [
        {required: true, message: '请输入教师所在学院', trigger: 'change'},
    ],
    teacherJob: [
        {required: true, message: '请输入教师职称', trigger: 'change'},
    ],
    isCounselor:[
        {required: true, message: '请输入教师是否为辅导员', trigger: 'change'},
    ]
})