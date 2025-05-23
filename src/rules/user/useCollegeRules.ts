import {FormRules} from "element-plus";
import {ICollegeRuleForm} from "@/rules/interface/college";

export const useCollegeRules = reactive<FormRules<ICollegeRuleForm>>({
    collegeId: [
        {required: true, message: '请输学院代码', trigger: 'change'},
    ],
    collegeName: [
        {required: true, message: '请输入学院名字', trigger: 'change'},
    ],
    classCount: [
        {required: true, message: '课程数不能为空', trigger: 'change'},
        { type: 'number', message: '课程数只能是数字' }
    ]
})