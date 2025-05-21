<script setup lang="ts">
import {Router, useRouter} from 'vue-router'
import {deleteClassNameService, getClassNamesService} from "@/service/classService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {IClass} from "@/typings/interface/class";
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";

const router: Router = useRouter();
const reRender = ref<boolean>(false);
const classNames = reactive<Array<IClass>>([])

watch(reRender, async () => {
  const classResponse = await getClassNamesService<IBaseResponse<IClass[]>>();
  if (classResponse.code === 200) {
    classNames.splice(0, classNames.length, ...classResponse.data)
  }
}, {immediate: true})

const deleteClassName = async (classId: string) => {
  const classResponse = await deleteClassNameService<IBaseResponse<string>>(classId)
  if (classResponse.code === 200) {
    reRender.value = !reRender.value;
    ElMessage.success(classResponse.data)
  } else {
    ElMessage.error(classResponse.data)
  }
}

const navigateToClassDetails = (classId: string) => {
  console.log(classId)
  router.push({path: SYSTEM_LEFT_NAV.CLASS_DETAILS, params: {id: classId}})
}
</script>

<template>
  <div class="class-management-container">
    <el-card class="card-container">
      <div v-for="item in classNames" :key="item.classId" class="flex-item">
        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-tag type="warning">{{ item.college }}</el-tag>
              <el-popconfirm
                  @confirm="deleteClassName(item.classId)"
                  class="box-item"
                  title="确认要删除该班级吗？"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button style="float: right" type="danger" size="small" plain>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
          <div>
            <div>
              班级名称
              <el-tag size="large" type="primary" class="left-distance">{{ item.className }}</el-tag>
            </div>
            <div>
              班级辅导员
              <el-tag size="large" type="primary" class="left-distance">{{ item.counselor }}</el-tag>
            </div>
            <div>
              班主任
              <el-tag size="large" type="primary" class="left-distance">{{ item.headTeacher }}</el-tag>
            </div>
            <div>
              班级人数
              <el-tag size="large" type="primary" class="left-distance">{{ item.studentCount }}</el-tag>
            </div>
          </div>
          <template #footer>
            <a href="javascript:void(0)" @click="navigateToClassDetails(item.classId)">
              <div style="float: right;text-align: center;display: flex;
              align-items: center;gap: 4px">
                查看详情
                <el-icon>
                  <IEpDArrowRight/>
                </el-icon>
              </div>
            </a>
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
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .card-item {
        width: 100%;
        height: 95%;
        display: flex;
        flex-direction: column;

        :deep(.el-card__body) {
          flex: 1;
          overflow: auto;
        }

        :deep(.el-card__footer) {
          padding: 10px 20px;
        }
      }
    }
  }
}

.left-distance {
  margin-left: 20px;
}
</style>