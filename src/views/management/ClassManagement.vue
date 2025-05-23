<script setup lang="ts">
import {Router, useRouter} from 'vue-router'
import {deleteClassNameService, getClassNamesService} from "@/service/classService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {IClass} from "@/typings/interface/class";
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";
import {ICollegeName} from "@/typings/interface/college";
import {getCollegeNamesService} from "@/service/collegeService";
import {watch} from "vue";

const router: Router = useRouter();
const college = ref<string>("")
const className = ref<string>("")
const reRender = ref<boolean>(false);
const classNames = reactive<Array<IClass>>([])
const classNamesFilter = reactive<Array<IClass>>([])
const collegeSelects = reactive<ICollegeName[]>([])

watchEffect(async () => {
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
})

watch(reRender, async () => {
  const classResponse = await getClassNamesService<IBaseResponse<IClass[]>>();
  if (classResponse.code === 200) {
    classNames.splice(0, classNames.length, ...classResponse.data)
    classNamesFilter.splice(0, classNamesFilter.length, ...classResponse.data)
  }
}, {immediate: true})

watch(college, () => {
  if (college.value.length === 0) {
    classNamesFilter.splice(0, classNamesFilter.length, ...(classNames.filter(() => true)))
    return;
  }
  classNamesFilter.splice(0, classNamesFilter.length,
      ...(classNames.filter((value: IClass) => value.college === college.value)))
})

const reset = () => {
  college.value = ''
  className.value = ''
}

const deleteClassName = async (classId: string) => {
  const classResponse = await deleteClassNameService<IBaseResponse<string>>(classId)
  if (classResponse.code === 200) {
    reRender.value = !reRender.value;
    ElMessage.success(classResponse.data)
  } else {
    ElMessage.error(classResponse.data)
  }
}

const navigateToClassDetails = (className: IClass) => {
  router.push({
    path: SYSTEM_LEFT_NAV.CLASS_DETAILS,
    query: {classObject: JSON.stringify(className)}
  })
}
</script>

<template>
  <div class="class-management-container">
    <el-card class="card-container">
      <div class="select-container">
        <el-card class="select-card-container">
          <el-row :gutter="40">
            <el-col :span="2">
              <el-icon size="30">
                <IEpSearch/>
              </el-icon>
            </el-col>
            <el-col :span="4">
              <el-button @click="reset">重置</el-button>
            </el-col>
            <el-col :span="9">
              <el-select v-model="college" placeholder="请选择学院" style="width: 200px;">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-input v-model="className" placeholder="请输入班级关键词"/>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div v-for="item in classNamesFilter" :key="item.classId" class="flex-item">
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
            <a href="javascript:void(0)" @click="navigateToClassDetails(item)">
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

    .select-container {
      width: 100%;
      height: 70px;

      .select-card-container {
        width: 100%;
        height: 100%;
      }
    }

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