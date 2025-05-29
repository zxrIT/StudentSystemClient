<script setup lang="ts">
import {IStudent, IStudentView} from "@/typings/interface/student";
import {
  getStudentSelectService,
  getStudentService,
  resetPasswordService,
  updateStudentService,
  deleteStudentService
} from "@/service/studentService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {USER_GRADE, USER_ROLE, USER_SELECT} from "@/typings/enum/user";
import type {FormInstance} from 'element-plus'
import type {IClass} from "@/typings/interface/class";
import {ElMessage} from "element-plus";
import {useStudentRules} from "@/rules/user/useUserRules";
import {getClassNamesService} from "@/service/classService";

const reRender = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>()
const visibleEdit = ref<boolean>(false)
const isWatchActive = ref<boolean>(true);
const search = ref<string>("");
const classSelects = reactive<Array<IClass>>([]);
let tableData = reactive<Array<IStudent>>([])
const pageCount = ref<number>(0)
const tablePages = ref<number>(1)
const locationOptionsGrade: USER_GRADE[] = [USER_GRADE.ONE, USER_GRADE.TWO, USER_GRADE.THREE, USER_GRADE.FORE]
const locationOptionsRole = [USER_ROLE.STUDENT, {
  label: USER_ROLE.TEACHER,
  value: USER_ROLE.TEACHER,
  disabled: true
}, USER_ROLE.ADMIN]
const __VITE_USER_AVATAR__ = computed(() => import.meta.env.VITE_USER_AVATAR)

const ruleForm = reactive<IStudentView>({
  studentId: "",
  studentName: "",
  studentClass: "",
  studentSex: 18,
  studentIcon: "",
  studentGrade: 1,
  roleId: "",
  college: ""
})

const ruleFormData = reactive<IStudent>({
  studentId: "",
  studentName: "",
  studentClass: "",
  studentSex: 18,
  studentIcon: "",
  studentGrade: 1,
  roleId: 0,
  college: ""
})

watchEffect(() => {
  if (search.value == "" && search.value.length === 0) {
    isWatchActive.value = true;
  }
})

watch([isWatchActive, tablePages, reRender], async () => {
  if (isWatchActive.value) {
    const studentResponse = await getStudentService<IBaseResponse<PaginationResponse<IStudent>>>(
        import.meta.env.VITE_PAGINATION_QUANTITY, tablePages.value
    )
    if (studentResponse.code === 200) {
      tableData.splice(0, tableData.length, ...studentResponse.data.records);
      pageCount.value = Math.ceil(studentResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY)
    }
  }
}, {immediate: true})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const command = async (payload: USER_SELECT) => {
  tablePages.value = 1
  isWatchActive.value = false
  const studentResponse = await getStudentSelectService<IBaseResponse<PaginationResponse<IStudent>>>(
      payload, search.value, import.meta.env.VITE_PAGINATION_QUANTITY, tablePages.value
  )
  if (studentResponse.code === 200) {
    tableData.splice(0, tableData.length, ...studentResponse.data.records);
    pageCount.value = Math.ceil(studentResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY)
  }
}

const handleEdit = async (_, row: IStudent) => {
  const classResponse = await getClassNamesService<IBaseResponse<IClass[]>>()
  if (classResponse.code === 200) {
    classSelects.splice(0, classSelects.length, ...classResponse.data)
  }
  visibleEdit.value = true
  ruleForm.studentIcon = row.studentIcon
  ruleForm.studentId = row.studentId
  ruleForm.studentName = row.studentName
  ruleForm.studentClass = row.studentClass
  ruleForm.studentSex = row.studentSex
  ruleForm.college = row.college
  switch (row.studentGrade) {
    case 1:
      ruleForm.studentGrade = USER_GRADE.ONE
      break;
    case 2:
      ruleForm.studentGrade = USER_GRADE.TWO
      break;
    case 3:
      ruleForm.studentGrade = USER_GRADE.THREE
      break;
    default:
      ruleForm.studentGrade = USER_GRADE.FORE
  }
  ruleForm.roleId = row.roleId === 0 ? USER_ROLE.STUDENT : row.roleId === 1 ? USER_ROLE.TEACHER : USER_ROLE.ADMIN
}

const closeDrawer = () => {
  visibleEdit.value = false
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ruleFormData.studentId = ruleForm.studentId
      ruleFormData.studentName = ruleForm.studentName
      ruleFormData.studentClass = ruleForm.studentClass
      ruleFormData.studentSex = ruleForm.studentSex
      ruleFormData.college = ruleForm.college
      ruleFormData.roleId = ruleForm.roleId === USER_ROLE.STUDENT ? 0 : ruleForm.roleId === USER_ROLE.TEACHER ? 1 : 2
      switch (ruleForm.studentGrade) {
        case USER_GRADE.ONE:
          ruleFormData.studentGrade = 1
          break;
        case USER_GRADE.TWO:
          ruleFormData.studentGrade = 2
          break;
        case USER_GRADE.THREE:
          ruleFormData.studentGrade = 3
          break;
        default:
          ruleFormData.studentGrade = 4
      }
      const studentResponse = await updateStudentService<IBaseResponse<string>>(ruleFormData)
      if (studentResponse.code === 200) {
        reRender.value = !reRender.value
        ElMessage({
          type: 'success',
          message: studentResponse.data,
        })
      } else {
        ElMessage({
          type: 'error',
          message: studentResponse.data,
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

const deleteStudent = async (_, row: IStudent) => {
  const studentResponse = await deleteStudentService<IBaseResponse<string>>(row.studentId)
  if (studentResponse.code === 200) {
    reRender.value = !reRender.value
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

const resetPassword = async (_, row: IStudent) => {
  const studentResponse = await resetPasswordService<IBaseResponse<string>>(row.studentId)
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
</script>

<template>
  <div class="student-container">
    <el-card style="width: 100%;height: 100%">
      <div class="table-container">
        <el-table :data="tableData"
                  style="width: 99%" height="100%" :fit="true"
                  highlight-current-row>
          <el-table-column align="center" fixed prop="studentIcon" label="studentIcon" width="150">
            <template #default="scope">
              <el-avatar :size="50" shape="circle" :src="
                scope.row.studentIcon===undefined || scope.row.studentIcon===null||scope.row.studentIcon.length===0?
                __VITE_USER_AVATAR__:
                scope.row.studentIcon"
              />
            </template>
          </el-table-column>
          <el-table-column fixed align="center" prop="college" label="college" width="150"/>
          <el-table-column align="center" prop="studentId" label="studentId" width="150"/>
          <el-table-column align="center" prop="studentName" label="studentName" width="150"/>
          <el-table-column align="center" prop="studentClass" label="studentClass" width="150"/>
          <el-table-column align="center" label="password" width="150">
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
          <el-table-column align="center" prop="roleId" label="roleId" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.roleId === 0 ?'primary':scope.row.roleId === 1?'warning':'danger'">
                {{
                  scope.row.roleId === 0 ? USER_ROLE.STUDENT : scope.row.roleId === 1 ? USER_ROLE.TEACHER : USER_ROLE.ADMIN
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="studentGrade" label="studentGrade" width="150">
            <template #default="scope">
              大学{{ scope.row.studentGrade }}年级
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" width="150">
            <template #header>
              <el-dropdown split-button @command="command">
                <el-input v-model="search" size="small" placeholder="请输入关键词"/>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="USER_SELECT.CLASS">按班级</el-dropdown-item>
                    <el-dropdown-item :command="USER_SELECT.GRADES">按年级</el-dropdown-item>
                    <el-dropdown-item :command="USER_SELECT.ID">按学号</el-dropdown-item>
                    <el-dropdown-item :command="USER_SELECT.NAME">按名字</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                Edit
              </el-button>
              <el-popconfirm
                  @confirm="deleteStudent(scope.$index, scope.row)"
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
          </el-table-column >
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next"
                       :page-count="pageCount"
                       @change="sizeChanged"/>
      </div>
    </el-card>
  </div>
  <el-drawer v-model="visibleEdit" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">修改学生信息</h4>
      <el-button type="danger" @click="closeDrawer">
        <el-icon class="el-icon--left">
          <IEpCircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :rules="useStudentRules"
        :model="ruleForm"
        label-width="auto"
    >

      <el-form-item label="学生照片" prop="studentIcon">
        <el-avatar style="width: 200px;height: 200px;margin-left: 50px;" shape="circle" :src="
                ruleForm.studentIcon===undefined || ruleForm.studentIcon===null?
                __VITE_USER_AVATAR__:
                ruleForm.studentIcon"
        />
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="ruleForm.studentId"/>
      </el-form-item>
      <el-form-item label="学生名" prop="studentName">
        <el-input v-model="ruleForm.studentName"/>
      </el-form-item>
      <el-form-item label="学生班级" prop="studentClass">
        <el-input
            v-model="ruleForm.studentClass"
            placeholder="Please input"
            class="input-with-select"
        >
          <template #append>
            <el-select v-model="ruleForm.studentClass" placeholder="Select" style="width: 200px">
              <el-option v-for="item in classSelects" :key="item.classId" :label="item.className"
                         :value="item.className"/>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生年龄" prop="studentSex">
        <el-input v-model.number="ruleForm.studentSex"/>
      </el-form-item>
      <el-form-item label="学生年级" prop="studentGrade">
        <el-segmented style="width: 100%" v-model="ruleForm.studentGrade" :options="locationOptionsGrade"/>
      </el-form-item>
      <el-form-item label="级别" prop="location">
        <el-segmented style="width: 100%" v-model="ruleForm.roleId" :options="locationOptionsRole"/>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitForm(ruleFormRef)">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="less">
.student-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
</style>