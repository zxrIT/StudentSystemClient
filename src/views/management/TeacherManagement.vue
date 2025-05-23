<script setup lang="ts">
import {ITeacher} from "@/typings/interface/teacher";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {
  getTeacherSelectService,
  getTeacherService,
  resetTeacherPasswordService,
  updateTeacherService
} from "@/service/teacherService";
import {TEACHER_COUNSELOR, TEACHER_JOB, TEACHER_SELECT} from "@/typings/enum/user";
import {ElMessage, FormInstance} from "element-plus";
import {useTeacherRules} from "@/rules/user/useTeacherRules";
import {ICollegeName} from "@/typings/interface/college";
import {getCollegeNamesService} from "@/service/collegeService";

const isWatchActive = ref<boolean>(true);
const ruleFormRef = ref<FormInstance>()
const visibleEdit = ref<boolean>(false)
const reRender = ref<boolean>(false);
const pageCount = ref<number>(0)
const search = ref<string>("");
const tablePages = ref<number>(1)
const __VITE_USER_AVATAR__ = computed(() => import.meta.env.VITE_USER_AVATAR)
const tableData = reactive<Array<ITeacher>>([])
const locationOptionsJob: TEACHER_JOB[] = [TEACHER_JOB.LECTURER, TEACHER_JOB.ASSOCIATE_PROFESSOR, TEACHER_JOB.PROFESSOR]
const locationOptionsCounselor: TEACHER_COUNSELOR = [TEACHER_COUNSELOR.COUNSELOR, TEACHER_COUNSELOR.TEACHER]
const collegeSelects = reactive<ICollegeName[]>([])
const disabled = ref<boolean>(false)


const ruleForm = reactive<ITeacher>({
  id: "",
  teacherId: "",
  teacherName: "",
  teacherCollege: "",
  teacherJob: 0,
  isCounselor: false
})

const ruleFromView = reactive<ITeacher>({
  id: "",
  teacherId: "",
  teacherName: "",
  teacherCollege: "",
  teacherJob: "",
  isCounselor: ""
})

watchEffect(() => {
  if (search.value == "" && search.value.length === 0) {
    isWatchActive.value = true;
  }
})

watch([tablePages, reRender, isWatchActive], async () => {
  if (isWatchActive.value) {
    const teacherResponse = await getTeacherService<IBaseResponse<PaginationResponse<ITeacher>>>(
        import.meta.env.VITE_PAGINATION_QUANTITY, tablePages.value
    )
    if (teacherResponse.code === 200) {
      tableData.splice(0, tableData.length, ...teacherResponse.data.records);
      pageCount.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY)
    }
  }
}, {immediate: true})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const closeDrawer = () => {
  visibleEdit.value = false
}

const handleEdit = async (_, row: ITeacher) => {
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
  visibleEdit.value = true
  ruleFromView.id = row.id
  ruleFromView.teacherId = row.teacherId
  ruleFromView.teacherName = row.teacherName
  ruleFromView.teacherCollege = row.teacherCollege
  ruleFromView.teacherJob = row.teacherJob === 0 ? TEACHER_JOB.LECTURER : row.teacherJob === 1
      ? TEACHER_JOB.ASSOCIATE_PROFESSOR : TEACHER_JOB.PROFESSOR
  ruleFromView.isCounselor = row.isCounselor ? TEACHER_COUNSELOR.COUNSELOR : TEACHER_COUNSELOR.TEACHER
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ruleForm.id = ruleFromView.id
      ruleForm.teacherId = ruleFromView.teacherId
      ruleForm.teacherName = ruleFromView.teacherName
      ruleForm.teacherCollege = ruleFromView.teacherCollege
      ruleForm.teacherJob = ruleFromView.teacherJob === TEACHER_JOB.LECTURER ? 0 :
          ruleFromView.teacherJob === TEACHER_JOB.ASSOCIATE_PROFESSOR ? 1 : 2
      ruleForm.isCounselor = ruleFromView.isCounselor === TEACHER_COUNSELOR.COUNSELOR
      const teacherResponse = await updateTeacherService<IBaseResponse<string>>(ruleForm)
      if (teacherResponse.code === 200) {
        reRender.value = !reRender.value
        ElMessage({
          type: 'success',
          message: teacherResponse.data,
        })
      } else {
        ElMessage({
          type: 'error',
          message: teacherResponse.data,
        })
      }
    } else {
      ElMessage({
        type: 'error',
        message: "请按照提示先填写信息后再提交",
      })
    }
  })
}

const resetPassword = async (_, row: ITeacher) => {
  const studentResponse = await resetTeacherPasswordService<IBaseResponse<string>>(row.teacherId)
  if (studentResponse.code === 200) {
    ElMessage({
      type: "success",
      message: studentResponse.data,
    })
  } else {
    ElMessage({
      type: "error",
      message: studentResponse.data,
    })
  }
}

const command = async (payload: TEACHER_SELECT) => {
  tablePages.value = 1
  isWatchActive.value = false
  const teacherResponse = await getTeacherSelectService<IBaseResponse<PaginationResponse<ITeacher>>>(
      payload, search.value, import.meta.env.VITE_PAGINATION_QUANTITY, tablePages.value
  )
  if (teacherResponse.code === 200) {
    tableData.splice(0, tableData.length, ...teacherResponse.data.records);
    pageCount.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY)
  }
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
                  @confirm="resetPassword(scope.$index, scope.row)"
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
              <el-dropdown split-button @command="command">
                <el-input v-model="search" size="small" placeholder="请输入关键词"/>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="TEACHER_SELECT.COLLEGE">按学院</el-dropdown-item>
                    <el-dropdown-item :command="TEACHER_SELECT.ID">按工号</el-dropdown-item>
                    <el-dropdown-item :command="TEACHER_SELECT.NAME">按名字</el-dropdown-item>
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
  <el-drawer v-model="visibleEdit" :show-close="false" direction="btt" size="40%">
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
        ref="ruleFormRef"
        :rules="useTeacherRules"
        style="max-width: 99%"
        :model="ruleFromView"
        label-width="auto"
    >
      <div class="form-container">
        <div class="photo-container">
          <el-form-item label="教师照片" prop="teacherIcon">
            <el-avatar class="teacher-avatar" shape="circle" :src="
                ruleFromView.teacherIcon===undefined || ruleFromView.teacherIcon===null?
                __VITE_USER_AVATAR__:
                ruleFromView.teacherIcon"
            />
          </el-form-item>
        </div>
        <div class="grid-form-items">
          <el-form-item label="teacherId" prop="teacherId" style="align-items: center;">
            <el-input v-model="ruleFromView.teacherId"/>
          </el-form-item>
          <el-form-item label="teacherName" prop="teacherName" style="align-items: center;">
            <el-input v-model="ruleFromView.teacherName"/>
          </el-form-item>
          <el-form-item label="teacherCollege" prop="teacherCollege" style="grid-column: 1 / -1; align-items: center;">
            <el-tooltip
                :disabled="disabled"
                content="此字段根据学院管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的学院"
                placement="bottom"
                effect="light"
            >
              <el-input v-model="ruleFromView.teacherCollege" disabled>
                <template #append>
                  <el-select v-model="ruleFromView.teacherCollege" :placeholder="null" style="width: 300px">
                    <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                               :value="item.collegeName"/>
                  </el-select>
                </template>
              </el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="teacherJob" prop="teacherJob" style="align-items: center;">
            <el-segmented style="width: 100%" v-model="ruleFromView.teacherJob" :options="locationOptionsJob"/>
          </el-form-item>
          <el-form-item label="isCounselor" prop="isCounselor" style="align-items: center;">
            <el-segmented style="width: 100%" v-model="ruleFromView.isCounselor" :options="locationOptionsCounselor"/>
          </el-form-item>
          <el-form-item style="align-items: center;">
            <el-button type="primary" round size="large" @click="submitForm(ruleFormRef)">
              修改
            </el-button>
          </el-form-item>
        </div>
      </div>
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

.form-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.photo-container {
  flex: 0 0 200px 200px;
}

.teacher-avatar {
  width: 200px;
  height: 200px;
}

.grid-form-items {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  row-gap: 40px;
  margin-left: 20px;

  .el-form-item {
    margin-bottom: 0 !important;

    display: flex;
    align-items: center;

    .el-form-item__label {
      display: flex;
      align-items: center;
    }

    .el-form-item__content {
      flex: 1;
      display: flex;
      align-items: center;

      > .el-input, > .el-segmented, > .el-select {
        width: 100%;
        align-self: center;
      }
    }

    .el-form-item__label {
      line-height: normal;
    }
  }
}
</style>