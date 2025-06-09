<script setup lang="ts">
import {useSystemStore} from "@/store";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";
import {TEACHER_JOB} from "@/typings/enum/user";

const systemStore = useSystemStore()
const userInfoStore = useUserInfoStore()

const __VITE_USER_AVATAR__ = computed(() => import.meta.env.VITE_USER_AVATAR)
</script>

<template>
  <div class="my-information-container">
    <el-card class="card-container">
      <el-descriptions title="Width horizontal list" border>
        <el-descriptions-item
            :rowspan="2"
            :width="140"
            label="用户照片"
            align="center"
        >
          <el-image
              style="width: 100px; height: 100px"
              :src="
                userInfoStore.userInfoStore.icon===undefined ||  userInfoStore.userInfoStore.icon===null?
                __VITE_USER_AVATAR__:
                 userInfoStore.userInfoStore.icon"
          />
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{ userInfoStore.userInfoStore.name }}</el-descriptions-item>
        <el-descriptions-item label="用户id">{{ userInfoStore.userInfoStore.id }}</el-descriptions-item>
        <el-descriptions-item :label="userInfoStore.userInfoStore.roleId===1? '职称':'所在班级'">
          <el-tag size="large" type="warning">

            {{
              userInfoStore.userInfoStore.roleId === 1 ? (userInfoStore.userInfoStore.job === 0 ? TEACHER_JOB.LECTURER :
                  userInfoStore.userInfoStore.job === 1 ?
                      TEACHER_JOB.ASSOCIATE_PROFESSOR : TEACHER_JOB.PROFESSOR) : userInfoStore.userInfoStore.className
            }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所在学院">
          <el-tag size="large">{{ userInfoStore.userInfoStore.college }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户令牌">
         {{ (userInfoStore.userInfoStore.token as string).substring(0, 100) + "..."}}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.my-information-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;
  }
}
</style>