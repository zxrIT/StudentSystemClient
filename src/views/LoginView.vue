<script setup lang="ts">
import logoImage from "@/assets/icon/logo.png"
import {USER_ROLE} from "@/typings/enum/user";
import {IUser} from "@/typings/interface/base";
import {ElMessage, FormInstance} from "element-plus";
import {useDark, useToggle} from '@vueuse/core'
import {
  adminLoginService,
  captchaService,
  studentLoginService,
  teacherLoginService
} from "@/service/authenticationService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {ILoginResponse, ILoginResponseGenerateCaptcha} from "@/typings/response/entity/loginResponse";
import {useLocalStorage} from "@/hooks/useLocalStorage";
import {useLoginRules} from "@/rules/user/loginRules";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";
import {Router, useRouter} from "vue-router";


const isDark = useDark()
const toggleDark = useToggle(isDark)
const router: Router = useRouter();
const userInfoStore = useUserInfoStore()
const {setStorage} = useLocalStorage()
const imageUrl = ref<string>("")
const loading = computed<boolean>(() => imageUrl.value.length === 0)
const ruleFormRef = ref<FormInstance>()
const reGenerateCaptcha = ref<boolean>(true)
const selectRole = ref<USER_ROLE>(USER_ROLE.STUDENT)
const ruleFrom = ref<IUser>({
  username: "",
  password: "",
  code: ""
})

watchEffect(() => {
  if (isDark.value) {
    toggleDark()
  }
})

const changeImageUrl = () => {
  reGenerateCaptcha.value = !reGenerateCaptcha.value;
}

watch(reGenerateCaptcha, async () => {
  const {loginId, captchaBase64} = (await captchaService<IBaseResponse<ILoginResponseGenerateCaptcha>>()).data
  setStorage("loginId", loginId)
  imageUrl.value = captchaBase64
}, {immediate: true})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          switch (selectRole.value) {
            case USER_ROLE.STUDENT:
              const loginStudentResponse = await studentLoginService<IBaseResponse<ILoginResponse | string>>(ruleFrom.value)
              if (loginStudentResponse.code === 200) {
                setStorage("studentSystem-token", (loginStudentResponse.data as ILoginResponse).token)
                setStorage("studentSystem-userInfo", JSON.stringify(loginStudentResponse.data as ILoginResponse))
                userInfoStore.changeUserInfo(loginStudentResponse.data as ILoginResponse)
                ElMessage.success("登录成功")
                await router.push("/")
              } else {
                reGenerateCaptcha.value = !reGenerateCaptcha.value
                ruleFrom.value.code = ""
                ElMessage.error(loginStudentResponse.data)
              }
              break;
            case USER_ROLE.TEACHER:
              const loginTeacherResponse = await teacherLoginService<IBaseResponse<ILoginResponse | string>>(ruleFrom.value)
              if (loginTeacherResponse.code === 200) {
                setStorage("studentSystem-token", (loginTeacherResponse.data as ILoginResponse).token)
                setStorage("studentSystem-userInfo", JSON.stringify(loginTeacherResponse.data as ILoginResponse))
                userInfoStore.changeUserInfo(loginTeacherResponse.data as ILoginResponse)
                ElMessage.success("登录成功")
                await router.push("/")
              } else {
                reGenerateCaptcha.value = !reGenerateCaptcha.value
                ruleFrom.value.code = ""
                ElMessage.error(loginTeacherResponse.data)
              }
              break;
            case USER_ROLE.ADMIN:
              const loginAdminResponse = await adminLoginService<IBaseResponse<ILoginResponse | string>>(ruleFrom.value)
              if (loginAdminResponse.code === 200) {
                setStorage("studentSystem-token", (loginAdminResponse.data as ILoginResponse).token)
                setStorage("studentSystem-userInfo", JSON.stringify(loginAdminResponse.data as ILoginResponse))
                userInfoStore.changeUserInfo(loginAdminResponse.data as ILoginResponse)
                ElMessage.success("登录成功")
                await router.push("/")
              } else {
                reGenerateCaptcha.value = !reGenerateCaptcha.value
                ruleFrom.value.code = ""
                ElMessage.error(loginAdminResponse.data)
              }
          }
        } else {
          ElMessage({
            type: 'error',
            message: "请按照提示先填写信息后再提交",
          })
        }
      }
  )
}
</script>

<template>
  <div class="login-container">
    <div class="login-header-container">

    </div>
    <div class="login-content-container">
      <div class="box">
        <div class="content-header">
          <el-image :src="logoImage" class="image"/>
          <h1 style="margin-left: 20px">{{ $t("message.login.Unified authentication") }}</h1>
        </div>
        <div class="content-body">
          <el-form ref="ruleFormRef" style="max-width: 99%" label-width="auto" :model="ruleFrom" :rules="useLoginRules">
            <el-form-item :label="$t('message.login.Student number/work number')" prop="username"
                          style="align-items: center">
              <el-input :placeholder="$t('message.login.Student number/work number')" v-model="ruleFrom.username"
                        style="width: 100%"/>
            </el-form-item>
            <el-form-item :label="$t('message.login.Password')" prop="password"
                          style="align-items: center;width: 300px">
              <el-input :placeholder="$t('message.login.Password')" v-model="ruleFrom.password" type="password"
                        show-password/>
            </el-form-item>
            <el-form-item :label="$t('message.login.Verification code')" prop="code"
                          style="align-items: center;width: 300px">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-input v-model="ruleFrom.code" :placeholder="$t('message.login.Verification code')"/>
                </el-col>
                <el-col :span="10">
                  <el-image :src="imageUrl" v-loading="loading" @click="changeImageUrl"
                            style="width: 100%; height: 32px; cursor: pointer"/>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item style="align-items: center;">
              <el-button round plain size="large" style="width: 100%" @click="submitForm(ruleFormRef)">
                {{ $t("message.login.Login") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content-footer">
          <el-radio-group v-model="selectRole" size="large" fill="#ffce00">
            <el-radio-button :label="$t('message.userRole.STUDENT')" :value="USER_ROLE.STUDENT"/>
            <el-radio-button :label="$t('message.userRole.TEACHER')" :value="USER_ROLE.TEACHER"/>
            <el-radio-button :label="$t('message.userRole.ADMIN')" :value="USER_ROLE.ADMIN"/>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="login-footer-container">
      本选课系统由zxrIT@邮箱zengxiangruiit@yeah.net提供技术支持
    </div>
  </div>
</template>

<style scoped lang="less">
.example-showcase .el-loading-mask {
  z-index: 9;
}

.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../assets/icon/login-bg.jpeg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  animation: fadeIn 1.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .login-header-container {
    margin-top: 5px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: right;
  }

  .login-content-container {
    display: flex;
    align-items: center;
    margin-bottom: 150px;
    width: 100%;
    flex: 10;
    animation: slideUp 1s ease-out 1.5s both;

    @keyframes slideUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .box {
      margin-left: 100px;
      width: 400px;
      height: 350px;
      display: flex;
      border-radius: 10px;
      flex-direction: column;
      opacity: 0.99;
      background-color: #ffffff;

      .content-header {
        margin-top: 10px;
        color: #ffce00;
        font-size: 25px;
        font-weight: bold;
        width: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

      }

      .content-body {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex: 5;
      }

      .content-footer {
        width: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
      }
    }
  }

  .login-footer-container {
    color: #ffe98c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    width: 100%;
    flex: 1;
  }
}
</style>