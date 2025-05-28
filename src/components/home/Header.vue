<script setup lang="ts">
import {useDark, useToggle} from '@vueuse/core'
import {useSystemStore} from "@/store";
import {SYSTEM_ENUM_TOPIC} from "@/typings/enum/systemEnum";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";

const systemStore = useSystemStore()
const userInfoStore = useUserInfoStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)

watch(isDark, (newValue: boolean) => {
  systemStore.changeTopic(newValue ? SYSTEM_ENUM_TOPIC.DARK : SYSTEM_ENUM_TOPIC.LIGHT)
})
</script>

<template>
  <div class="header-container">
    <ElCard style="width: 100%;height: 100%">
      <div class="header-container-box">
        <el-avatar style="width: 35px;height: 35px" shape="circle" :src="
                userInfoStore.userInfoStore.icon===undefined ||  userInfoStore.userInfoStore.icon===null?
                __VITE_USER_AVATAR__:
                 userInfoStore.userInfoStore.icon"
        />
        <el-switch v-model="isDark" @change="toggleDark">
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
    </ElCard>
  </div>
</template>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;

  .header-container-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: right;
    align-items: center;
  }
}
</style>