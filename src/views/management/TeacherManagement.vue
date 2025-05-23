<script setup lang="ts">
import {ITeacher} from "@/typings/interface/teacher";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {getTeacherService} from "@/service/teacherService";
import {TEACHER_COUNSELOR, TEACHER_JOB} from "@/typings/enum/user";
import {IStudent} from "@/typings/interface/student";
import {ElMessage, FormInstance} from "element-plus";

const ruleFormRef = ref<FormInstance>()
const visibleEdit = ref<boolean>(false)
const reRender = ref<boolean>(false);
const pageCount = ref<number>(0)
const tablePages = ref<number>(1)
const __VITE_USER_AVATAR__ = computed(() => import.meta.env.VITE_USER_AVATAR)
const tableData = reactive<Array<ITeacher>>([])
const locationOptionsJob: TEACHER_JOB[] = [TEACHER_JOB.LECTURER, TEACHER_JOB.ASSOCIATE_PROFESSOR, TEACHER_JOB.PROFESSOR]
const locationOptionsCounselor: TEACHER_COUNSELOR = [TEACHER_COUNSELOR.COUNSELOR, TEACHER_COUNSELOR.TEACHER]


const ruleForm = reactive<ITeacher>({
  teacherId: "",
  teacherName: "",
  teacherCollege: "",
  teacherJob: 0,
  isCounselor: false
})

const ruleFromView = reactive<ITeacher>({
  teacherId: "",
  teacherName: "",
  teacherCollege: "",
  teacherJob: "",
  isCounselor: ""
})

watch([tablePages, reRender], async () => {
  const teacherResponse = await getTeacherService<IBaseResponse<PaginationResponse<ITeacher>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY, tablePages.value
  )
  if (teacherResponse.code === 200) {
    tableData.splice(0, tableData.length, ...teacherResponse.data.records);
    pageCount.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY)
  }
}, {immediate: true})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const closeDrawer = () => {
  visibleEdit.value = false
}

const handleEdit = async (_, row: IStudent) => {
  visibleEdit.value = true
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
    } else {
      ElMessage({
        type: 'error',
        message: "请按照提示先填写信息后再提交",
      })
    }
  })
}
</script>

<template>
  <div class="teacher-management-container">
    <el-card class="card-container">
      <div class="table-container">
        <el-table :data="tableData"
                  style="width: 99%" height="100%" :fit="true"
                  highlight-current-row>
          <el-table-column align="center" fixed prop="teacherIcon" label="teacherIcon" min-width="15%">
            <template #default="scope">
              <el-avatar :size="50" shape="circle" :src="
                scope.row.teacherIcon===undefined || scope.row.teacherIcon===null||scope.row.teacherIcon.length===0?
                __VITE_USER_AVATAR__:
                scope.row.teacherIcon"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="teacherId" label="teacherId" min-width="13%"/>
          <el-table-column align="center" prop="teacherName" label="teacherName" min-width="14%"/>
          <el-table-column align="center" prop="teacherCollege" label="teacherCollege" min-width="20%"/>
          <el-table-column align="center" label="password" min-width="13%">
            <template #default="scope">
              <el-popconfirm
                  class="box-item"
                  title="确认要重置吗？"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button size="small" type="primary" round>reset</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="teacherJob" label="teacherJob" min-width="13%">
            <template #default="scope">
              <el-tag :type="scope.row.teacherJob === 0?'primary':scope.row.teacherJob === 1?'warning':
              'danger'"
                      size="large">
                {{
                  scope.row.teacherJob === 0 ? TEACHER_JOB.LECTURER : scope.row.teacherJob === 1 ?
                      TEACHER_JOB.ASSOCIATE_PROFESSOR : TEACHER_JOB.PROFESSOR
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="25%">
            <template #header>
              <el-dropdown split-button>
                <el-input v-model="search" size="small" placeholder="请输入关键词"/>
                <template #dropdown>
                  <el-dropdown-menu>

                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                Edit
              </el-button>
              <el-popconfirm
                  class="box-item"
                  title="确认要删除吗？"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button
                      size="small"
                      type="danger"
                  >
                    Delete
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next"
                       :page-count="pageCount"
                       @change="sizeChanged"/>
      </div>
    </el-card>
  </div>
  <el-drawer v-model="visibleEdit" :show-close="false" direction="btt">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">修改教师信息</h4>
      <el-button type="danger" @click="closeDrawer">
        <el-icon class="el-icon--left">
          <IEpCircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form
        :inline="true"
        ref="ruleFormRef"
        style="max-width: 99%"
        :model="ruleFromView"
        label-width="auto"
    >
      <el-form-item label="教师照片" prop="teacherIcon">
        <el-avatar style="width: 200px;height: 200px;margin-left: 50px;" shape="circle" :src="
                ruleForm.teacherIcon===undefined || ruleForm.teacherIcon===null?
                __VITE_USER_AVATAR__:
                ruleForm.teacherIcon"
        />
      </el-form-item>
      <el-form-item label="teacherId" prop="teacherId">
        <el-input v-model="ruleForm.teacherId"/>
      </el-form-item>
      <el-form-item label="teacherName" prop="teacherName">
        <el-input v-model="ruleForm.teacherName"/>
      </el-form-item>
      <el-form-item label="teacherCollege" prop="teacherCollege">
        <el-input v-model="ruleForm.teacherCollege"/>
      </el-form-item>
      <el-form-item label="teacherJob" prop="teacherJob">
        <el-segmented style="width: 100%" v-model="ruleForm.teacherJob" :options="locationOptionsJob"/>
      </el-form-item>
      <el-form-item label="isCounselor" prop="isCounselor">
        <el-segmented style="width: 100%" v-model="ruleForm.isCounselor" :options="locationOptionsCounselor"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round size="large" @click="submitForm(ruleFormRef)">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="less">
.teacher-management-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;

    .table-container {
      width: 100%;
      height: 80%;
    }

    .pagination-container {
      width: 100%;
      height: 20%;
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
}
</style>