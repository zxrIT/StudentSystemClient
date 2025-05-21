<script setup lang="ts">
import {getClassNamesService} from "@/service/classService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {IClass} from "@/typings/interface/class";

const classNames = reactive<Array<IClass>>([])

watch(async () => {
  const classResponse = await getClassNamesService<IBaseResponse<IClass[]>>();
  if (classResponse.code === 200) {
    console.log(classResponse.data);
    classNames.splice(0, classNames.length, ...classResponse.data)
  }
}, {immediate: true})
</script>

<template>
  <div class="class-management-container">
    <el-card class="card-container">
      <div v-for="item in classNames" :key="item.classId" class="flex-item">
        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-tag type="warning">{{ item.college }}</el-tag>
              <el-button style="float: right" type="danger" size="small" plain>删除</el-button>
            </div>
          </template>
          <div>

          </div>
          <template #footer>
            <div>
              查看详情
            </div>
          </template>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">

.class-management-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 660px;
    overflow: auto;

    :deep(.el-card__body) {
      height: 100%;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .flex-item {
      width: calc((100% - 20px) / 3);
      height: 300px;
      background-color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .card-item {
        width: 100%;
        height: 95%;
      }
    }
  }
}
</style>