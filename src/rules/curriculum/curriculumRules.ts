import {FormRules} from "element-plus";
import {ICurriculumRuleForm} from "@/rules/interface/curriculum";

export const useCurriculumRules = reactive<FormRules<ICurriculumRuleForm>>({
    name: [
        {required: true, message: '请输课程名字', trigger: 'change'},
    ],
    curriculumId: [
        {required: true, message: '请输入课程代码', trigger: 'change'},
    ],
    location: [
        {required: true, message: '请输入上课地址', trigger: 'change'},
    ],
    capacity: [
        {required: true, message: '请输入课程容量', trigger: 'change'},
        {type: 'number', message: '课程容量只能是数字', trigger: 'change'}
    ],
    credits: [
        {required: true, message: '请输入课程学分', trigger: 'change'},
        {type: 'number', message: '学分只能是数字', trigger: 'change'}
    ],
    creditHour: [
        {required: true, message: '请输入课程学时', trigger: 'change'},
        {type: 'number', message: '学时只能是数字', trigger: 'change'},
    ]
})