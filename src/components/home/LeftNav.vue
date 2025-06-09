<script setup lang="ts">
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";

const userInfoStore = useUserInfoStore()
</script>

<template>
  <div class="left-nav-container">
    <el-card class="card">
      <el-row class="tac">
        <el-col style="width: 100%">
          <el-menu
              :default-active="SYSTEM_LEFT_NAV.INFORMATION"
              router
          >
            <el-menu-item :index="SYSTEM_LEFT_NAV.INFORMATION">
              <el-icon>
                <IEpSetting/>
              </el-icon>
              <span>{{ $t("message.leftNav.MyInformation") }}</span>
            </el-menu-item>
            <el-menu-item :index="SYSTEM_LEFT_NAV.SELECTION"
                          v-if="userInfoStore.userInfoStore.loginType===1&& userInfoStore.userInfoStore.roleId===0">
              <el-icon>
                <IEpBox/>
              </el-icon>
              <span>{{ $t("message.leftNav.SelfSelectedCourses") }}</span>
            </el-menu-item>
            <el-menu-item :index="SYSTEM_LEFT_NAV.MYCOURSES">
              <el-icon>
                <IEpBriefcase/>
              </el-icon>
              <span>{{ $t("message.leftNav.MyCourse") }}</span>
            </el-menu-item>
            <el-sub-menu v-if="userInfoStore.userInfoStore.loginType===3&& userInfoStore.userInfoStore.roleId===2"
                         :index="SYSTEM_LEFT_NAV.HOME">
              <template #title>
                <el-icon>
                  <IEpUser/>
                </el-icon>
                <span>{{ $t("message.leftNav.PersonnelManagement") }}</span>
              </template>
              <el-menu-item :index="SYSTEM_LEFT_NAV.STUDENT">{{
                  $t("message.leftNav.StudentManagement")
                }}
              </el-menu-item>
              <el-menu-item :index="SYSTEM_LEFT_NAV.TEACHER">{{
                  $t("message.leftNav.TeacherManagement")
                }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-if="userInfoStore.userInfoStore.loginType===3&& userInfoStore.userInfoStore.roleId===2"
                          :index="SYSTEM_LEFT_NAV.CURRICULUM">
              <el-icon>
                <IEpCollection/>
              </el-icon>
              <span>{{ $t("message.leftNav.CurriculumManagement") }}</span>
            </el-menu-item>
            <el-menu-item v-if="userInfoStore.userInfoStore.loginType===3&& userInfoStore.userInfoStore.roleId===2"
                          :index="SYSTEM_LEFT_NAV.CLASS">
              <el-icon>
                <IEpCoin/>
              </el-icon>
              <span>{{ $t("message.leftNav.ClassManagement") }}</span>
            </el-menu-item>
            <el-menu-item v-if="userInfoStore.userInfoStore.loginType===3&& userInfoStore.userInfoStore.roleId===2"
                          :index="SYSTEM_LEFT_NAV.COLLEGE">
              <el-icon>
                <IEpReading/>
              </el-icon>
              <span>{{ $t("message.leftNav.CollegeManagement") }}</span>
            </el-menu-item>
            <el-menu-item v-if="userInfoStore.userInfoStore.loginType===3&& userInfoStore.userInfoStore.roleId===2"
                          :index="SYSTEM_LEFT_NAV.COURSE">
              <el-icon>
                <IEpPromotion/>
              </el-icon>
              <span>{{ $t("message.leftNav.CoursePublish") }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.left-nav-container {
  width: 100%;
  height: 100%;

  .card {
    width: 99%;
    height: 99%;
  }
}
</style>