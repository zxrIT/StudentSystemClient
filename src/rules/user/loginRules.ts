import {FormRules} from "element-plus";
import {ILoginRuleForm} from "@/rules/interface/login";

export const useLoginRules = reactive<FormRules<ILoginRuleForm>>({
    username: [
        {required: true, message: '请输入学号/工号', trigger: 'change'},
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'change'},
    ],
    code: [
        {required: true, message: '请输入验证码', trigger: 'change'},
    ]
})