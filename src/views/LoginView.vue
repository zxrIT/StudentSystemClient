<script setup lang="ts">
import logoImage from "@/assets/icon/logo.png"
import {USER_ROLE} from "@/typings/enum/user";
import {IUser} from "@/typings/interface/base";
import {FormInstance} from "element-plus";

const ruleFormRef = ref<FormInstance>()
const selectRole = ref<USER_ROLE>(USER_ROLE.STUDENT)
const ruleFrom = ref<IUser>({
  username: "",
  password: "",
})
</script>

<template>
  <div class="login-container">
    <div class="login-header-container">
      <el-icon size="30" style="margin-right: 10px" color="#FFD700">
        <IEpSwitch/>
      </el-icon>
      <el-icon size="30" style="margin-right: 10px" color="#FFD700">
        <IEpSunny/>
      </el-icon>
    </div>
    <div class="login-content-container">
      <div class="box">
        <div class="content-header">
          <el-image :src="logoImage" class="image"/>
          <h1 style="margin-left: 20px">学生选课系统统一身份认证</h1>
        </div>
        <div class="content-body">
          <el-form ref="ruleFormRef" style="max-width: 99%" label-width="auto" :model="ruleFrom">
            <el-form-item label="username" prop="username" style="align-items: center">
              <el-input v-model="ruleFrom.username" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="password" prop="password" style="align-items: center">
              <el-input v-model="ruleFrom.password" type="password" show-password/>
            </el-form-item>
            <el-form-item style="align-items: center;">
              <el-tag type="info">Tag 3</el-tag><el-button style="width: 100%" round plain>登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content-footer">
          <el-radio-group v-model="selectRole" size="large" fill="#ffce00">
            <el-radio-button :label="USER_ROLE.STUDENT" :value="USER_ROLE.STUDENT"/>
            <el-radio-button :label="USER_ROLE.TEACHER" :value="USER_ROLE.TEACHER"/>
            <el-radio-button :label="USER_ROLE.ADMIN" :value="USER_ROLE.ADMIN"/>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="login-footer-container ">
      本选课系统由zxrIT@邮箱zengxiangruiit@yeah.net提供技术支持
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../assets/icon/login-bg.jpeg");
  background-size: cover;
  display: flex;
  flex-direction: column;

  .login-header-container {
    margin-top: 5px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: right;
  }

  .login-content-container {
    width: 100%;
    flex: 10;

    .box {
      margin-left: 100px;
      width: 400px;
      height: 300px;
      display: flex;
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