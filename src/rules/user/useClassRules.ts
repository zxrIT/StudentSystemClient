import {FormRules} from "element-plus";
import {IClassRuleForm} from "@/rules/interface/class";

export const useClassRules = reactive<FormRules<IClassRuleForm>>({
    className: [
        {required: true, message: '请输入班级名称', trigger: 'change'},
    ],
    college: [
        {required: true, message: '请输入所在学院', trigger: 'change'},
    ],
    counselor: [
        {required: true, message: '请输入班级辅导员', trigger: 'change'},
    ],
    headTeacher: [
        {required: true, message: '请输入班主任', trigger: 'change'},
    ]
})