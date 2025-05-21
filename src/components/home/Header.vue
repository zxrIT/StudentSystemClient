<script setup lang="ts">
import {useDark, useToggle} from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="header-container">
    <ElCard style="width: 100%;height: 100%">
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
    </ElCard>
  </div>
</template>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
}
</style>