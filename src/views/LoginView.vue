<script setup lang="ts">
import logoImage from "@/assets/icon/logo.png"
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

        </div>
        <div class="content-footer">

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
      width: 500px;
      height: 500px;
      display: flex;
      flex-direction: column;
      opacity: 0.7;
      background-color: #60A0D9;

      .content-header {
        color: #FFFFFF;
        font-size: 25px;
        font-weight: bold;
        width: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        @keyframes scale {
          from {
            font-size: 50px;
            color: transparent;
          }
          to {
            font-size: 25px;
            color: #FFD700;
          }
        }

        h1 {
          background-image: url("../assets/icon/animation.jpeg");
          background-size: cover;
          background-clip: text;
          color: transparent;
          animation: scale 3s forwards;
        }



        .image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

      }

      .content-body {
        width: 100%;
        flex: 5;
      }

      .content-footer {
        width: 100%;
        flex: 1;
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