<script setup lang="ts">
import githubIconLight from "@/assets/icon/github-light.png"
import githubIconDark from "@/assets/icon/github-dark.png"
import {useDark, useToggle} from '@vueuse/core'
import {useSystemStore} from "@/store";
import {SYSTEM_ENUM_INTERNATION, SYSTEM_ENUM_TOPIC} from "@/typings/enum/systemEnum";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {TEACHER_JOB, USER_ROLE} from "@/typings/enum/user";

const {t, locale} = useI18n()
const systemStore = useSystemStore()
const userInfoStore = useUserInfoStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const isEnglish = ref<boolean>(false)

const navigateGithub = () => {
  window.open(import.meta.env.VITE_GITHUB_URL, "_blank")
}

watch(isEnglish, (newValue: boolean) => {
  systemStore.changeInternationalization(newValue ? SYSTEM_ENUM_INTERNATION.EN : SYSTEM_ENUM_INTERNATION.ZH)
  locale.value = newValue ? SYSTEM_ENUM_INTERNATION.EN : SYSTEM_ENUM_INTERNATION.ZH
})

watch(isDark, (newValue: boolean) => {
  systemStore.changeTopic(newValue ? SYSTEM_ENUM_TOPIC.DARK : SYSTEM_ENUM_TOPIC.LIGHT)
})
</script>

<template>
  <div class="header-container">
    <ElCard class="header-card">
      <div class="header-container-box">
        <div class="switches-column">
          <div class="switch-item">
            <span>主题</span>
            <el-switch class="theme-switch" v-model="isDark" @change="toggleDark">
              <template #active-action>
                <el-icon>
                  <IEpMoon/>
                </el-icon>
              </template>
              <template #inactive-action>
                <el-icon>
                  <IEpSunny/>
                </el-icon>
              </template>
            </el-switch>
          </div>
          <div class="switch-item">
            <span>语言</span>
            <el-switch class="language-switch" v-model="isEnglish">
              <template #active-action>
                <span>En</span>
              </template>
              <template #inactive-action>
                <span>中</span>
              </template>
            </el-switch>
          </div>
        </div>
        <el-tooltip content="github仓库" effect="light">
          <el-image class="user-avatar"
                    @click="navigateGithub"
                    :src="systemStore.systemState.topic===SYSTEM_ENUM_TOPIC.LIGHT? githubIconLight:githubIconDark"
                    alt="github"/>
        </el-tooltip>
        <el-tag style=" height: 40px;width: 150px;flex-shrink: 0;" type="warning">
          {{ userInfoStore.userInfoStore.college }}
        </el-tag>
        <el-tag
            v-show="userInfoStore.userInfoStore.loginType===1"
            style=" height: 40px;width: 100px;flex-shrink: 0;">
          {{ userInfoStore.userInfoStore.className }}
        </el-tag>
        <el-tag
            v-show="userInfoStore.userInfoStore.loginType===2"
            style=" height: 40px;width: 100px;flex-shrink: 0;">
          {{
            userInfoStore.userInfoStore.job === 0 ? TEACHER_JOB.LECTURER : userInfoStore.userInfoStore.job === 1 ?
                TEACHER_JOB.ASSOCIATE_PROFESSOR : TEACHER_JOB.PROFESSOR
          }}
        </el-tag>
        <el-tag v-show="userInfoStore.userInfoStore.loginType===1|| userInfoStore.userInfoStore.loginType===3"
                style=" height: 40px;width: 50px;flex-shrink: 0;"
                type="danger">
          {{
            userInfoStore.userInfoStore.roleId === 0 ? USER_ROLE.STUDENT : userInfoStore.userInfoStore.roleId === 1 ?
                USER_ROLE.TEACHER : USER_ROLE.ADMIN
          }}
        </el-tag>
        <el-tag v-show="userInfoStore.userInfoStore.loginType===2" style=" height: 40px;width: 50px;flex-shrink: 0;"
                type="danger">
          教师
        </el-tag>
        <el-avatar class="user-avatar" shape="circle" :src="
                userInfoStore.userInfoStore.icon===undefined ||  userInfoStore.userInfoStore.icon===null?
                __VITE_USER_AVATAR__:
                 userInfoStore.userInfoStore.icon"
        />
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .header-card {
    width: 100%;
    height: 100%;
    overflow: hidden;

    :deep(.el-card__body) {
      height: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;
      padding: 0 16px;
    }
  }

  .header-container-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;

    box-sizing: border-box;
  }

  .switches-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .switch-item {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      width: 40px;
      text-align: right;
    }
  }

  .user-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }

  .theme-switch {
    :deep(.el-switch__core) {
      width: 50px !important;
      height: 24px !important;
    }

    :deep(.el-switch__action) {
      width: 20px !important;
      height: 20px !important;
    }

    :deep(.el-icon) {
      font-size: 14px;
    }

    &.is-checked :deep(.el-switch__core) {
      background-color: #363a3a !important;
      border-color: #363a3a !important;
      background-image: none !important;
    }
  }

  .language-switch {
    :deep(.el-switch__core) {
      width: 50px !important;
      height: 24px !important;
    }

    :deep(.el-switch__action) {
      width: 20px !important;
      height: 20px !important;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 12px;
        line-height: 1;
        display: inline-block;
        vertical-align: middle;
      }
    }

    :deep(.el-icon) {
      font-size: 14px;
    }

  }
}
</style>