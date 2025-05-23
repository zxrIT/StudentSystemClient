<script setup lang="ts">
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="left-nav-container">
    <el-card class="card">
      <el-row class="tac">
        <el-col style="width: 100%">
          <el-menu
              default-active="1"
              @open="handleOpen"
              @close="handleClose"
              router
          >
            <el-sub-menu :index="SYSTEM_LEFT_NAV.HOME">
              <template #title>
                <el-icon>
                  <IEpUser/>
                </el-icon>
                <span>{{ $t("message.PersonnelManagement") }}</span>
              </template>
              <el-menu-item :index="SYSTEM_LEFT_NAV.STUDENT">{{ $t("message.StudentManagement") }}</el-menu-item>
              <el-menu-item :index="SYSTEM_LEFT_NAV.TEACHER">{{ $t("message.TeacherManagement") }}</el-menu-item>
            </el-sub-menu>
            <el-menu-item :index="SYSTEM_LEFT_NAV.CURRICULUM">
              <el-icon>
                <IEpCollection/>
              </el-icon>
              <span>{{ $t("message.CurriculumManagement") }}</span>
            </el-menu-item>
            <el-menu-item :index="SYSTEM_LEFT_NAV.CLASS">
              <el-icon>
                <IEpCoin/>
              </el-icon>
              <span>{{ $t("message.ClassManagement") }}</span>
            </el-menu-item>
            <el-menu-item :index="SYSTEM_LEFT_NAV.COLLEGE">
              <el-icon>
                <IEpReading/>
              </el-icon>
              <span>{{ $t("message.CollegeManagement") }}</span>
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