import {FormRules} from "element-plus";
import {studentIdRegex} from "@/regex/user"
import {IStudentRuleForm} from "@/rules/interface/user";

export const useStudentRules = reactive<FormRules<IStudentRuleForm>>({
    studentName: [
        {required: true, message: '请输入学生名', trigger: 'change'},
    ],
    studentClass: [
        {required: true, message: '请输入学生班级', trigger: 'change'},
    ],
    studentId: [
        {required: true, message: '请输入学生学号', trigger: 'change'},
        {pattern: studentIdRegex, message: '学号必须由10位数字组成', trigger: 'change'},
    ],
    studentSex: [
        {required: true, message: '请输入学生年龄', trigger: 'change'},
    ]
})
