<script setup lang="ts">
import {IStudent, IStudentView, IStudentCreateView, IStudentCreate} from "@/typings/interface/student";
import {
  getStudentSelectService,
  getStudentService,
  resetPasswordService,
  updateStudentService,
  deleteStudentService, incrementStudentService
} from "@/service/studentService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {USER_GRADE, USER_ROLE, USER_SELECT} from "@/typings/enum/user";
import type {FormInstance} from 'element-plus'
import type {IClass} from "@/typings/interface/class";
import {ElMessage} from "element-plus";
import {useStudentRules} from "@/rules/user/useUserRules";
import {getClassNamesServiceByCollege} from "@/service/classService";
import {getCollegeNamesService} from "@/service/collegeService";
import {ICollegeName} from "@/typings/interface/college";
import SpeedDial from 'primevue/speeddial';

const imageUrl = ref<string>("")
const selectDisabledCreate = ref<boolean>(true);
const selectDisabled = ref<boolean>(true);
const collegeSelects = reactive<ICollegeName[]>([])
const disabled = ref<boolean>(false)
const reRender = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>()
const visibleCreate = ref<boolean>(false)
const visibleEdit = ref<boolean>(false)
const isWatchActive = ref<boolean>(true);
const search = ref<string>("");
const classSelects = reactive<Array<IClass>>([]);
let tableData = reactive<Array<IStudent>>([])
const pageCount = ref<number>(0)
const uploadStudentImage = ref(null)
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
  college: "",
  id: "",
})

const ruleFormData = reactive<IStudent>({
  studentId: "",
  studentName: "",
  studentClass: "",
  studentSex: 18,
  studentIcon: "",
  studentGrade: 1,
  roleId: 0,
  college: "",
  id: ""
})

const ruleFormCreate = reactive<IStudentCreateView>({
  studentId: "",
  studentName: "",
  studentClass: "",
  studentSex: 18,
  studentGrade: USER_GRADE.ONE,
  roleId: USER_ROLE.STUDENT,
  college: "",
})

const ruleFormDataCreate = reactive<IStudentCreate>({
  studentId: "",
  studentName: "",
  studentClass: "",
  studentSex: 18,
  studentGrade: 1,
  roleId: 0,
  college: "",
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
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
  visibleEdit.value = true
  ruleForm.studentIcon = row.studentIcon
  ruleForm.studentId = row.studentId
  ruleForm.studentName = row.studentName
  ruleForm.studentClass = row.studentClass
  ruleForm.studentSex = row.studentSex
  ruleForm.college = row.college
  ruleForm.id = row.id
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

const collegeChange = async (college: string) => {
  const classResponse = await getClassNamesServiceByCollege<IBaseResponse<IClass[]>>(college)
  if (classResponse.code === 200) {
    selectDisabled.value = false
    ruleForm.studentClass = classResponse.data[0] ? classResponse.data[0].className : ""
    classSelects.splice(0, classSelects.length, ...classResponse.data)
  }
}

const collegeChangeCreate = async (college: string) => {
  const classResponse = await getClassNamesServiceByCollege<IBaseResponse<IClass[]>>(college)
  if (classResponse.code === 200) {
    selectDisabledCreate.value = false
    ruleFormCreate.studentClass = classResponse.data[0] ? classResponse.data[0].className : ""
    classSelects.splice(0, classSelects.length, ...classResponse.data)
  }
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
      ruleFormData.id = ruleForm.id
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
        visibleEdit.value = false
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

const submitFormCreate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ruleFormDataCreate.studentId = ruleFormCreate.studentId
      ruleFormDataCreate.studentName = ruleFormCreate.studentName
      ruleFormDataCreate.studentClass = ruleFormCreate.studentClass
      ruleFormDataCreate.studentSex = ruleFormCreate.studentSex
      ruleFormDataCreate.college = ruleFormCreate.college
      ruleFormDataCreate.id = ruleFormCreate.id
      ruleFormDataCreate.roleId = ruleFormCreate.roleId === USER_ROLE.STUDENT ? 0 : ruleFormCreate.roleId === USER_ROLE.TEACHER ? 1 : 2
      switch (ruleForm.studentGrade) {
        case USER_GRADE.ONE:
          ruleFormDataCreate.studentGrade = 1
          break;
        case USER_GRADE.TWO:
          ruleFormDataCreate.studentGrade = 2
          break;
        case USER_GRADE.THREE:
          ruleFormDataCreate.studentGrade = 3
          break;
        default:
          ruleFormDataCreate.studentGrade = 4
      }
      const fromDataStudent = new FormData()
      fromDataStudent.append(
          "data",
          new Blob([JSON.stringify(ruleFormDataCreate)], {
            type: "application/json",
          })
      );
      fromDataStudent.append("iconImage", uploadStudentImage.value);
      const studentResponse = await incrementStudentService<IBaseResponse<string>>(fromDataStudent)
      if (studentResponse.code === 200) {
        reRender.value = !reRender.value
        visibleCreate.value = false
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

const handleFileChange = (file) => {
  uploadStudentImage.value = file.raw
  imageUrl.value = URL.createObjectURL(file.raw);
};

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

const closeDrawerCreate = () => {
  visibleCreate.value = false
}

const incrementStudent = async () => {
  visibleCreate.value = true
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
}

const validateImageType = (rule, value, callback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ] as string[];
  if (value && !allowedTypes.includes(value.type)) {
    callback(new Error('支持格式：JPG/JPEG、PNG、GIF、BMP、WebP'));
  } else {
    callback();
  }
};

const validateImageSize = (rule, value, callback) => {
  if (value && value.size / 1024 / 1024 > 2) {
    callback(new Error('头像大小不能超过2MB'));
  } else {
    callback();
  }
};

</script>

<template>
  <div class="student-container">
    <el-card style="width: 100%;height: 100%">
      <div class="table-container">
        <el-table :data="tableData"
                  style="width: 99%" height="100%" :fit="true"
                  highlight-current-row>
          <el-table-column align="center" fixed="left" prop="studentIcon" label="studentIcon" min-width="11%">
            <template #default="scope">
              <el-avatar :size="50" shape="circle" :src="
                scope.row.studentIcon===undefined || scope.row.studentIcon===null||scope.row.studentIcon.length===0?
                __VITE_USER_AVATAR__:
                scope.row.studentIcon"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="studentId" label="studentId" min-width="10%"/>
          <el-table-column align="center" prop="studentName" label="studentName" min-width="10%"/>
          <el-table-column align="center" prop="studentClass" label="studentClass" min-width="10%"/>
          <el-table-column align="center" label="password" min-width="8%">
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
          <el-table-column align="center" prop="roleId" label="roleId" min-width="8%">
            <template #default="scope">
              <el-tag :type="scope.row.roleId === 0 ?'primary':scope.row.roleId === 1?'warning':'danger'">
                {{
                  scope.row.roleId === 0 ? USER_ROLE.STUDENT : scope.row.roleId === 1 ? USER_ROLE.TEACHER : USER_ROLE.ADMIN
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="studentGrade" label="studentGrade" min-width="11%">
            <template #default="scope">
              大学{{ scope.row.studentGrade }}年级
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" min-width="20%">
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
      <el-form-item label="id" prop="id">
        <el-tooltip
            :disabled="disabled"
            content="此字段为学生的唯一标识不可修改"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleForm.id" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="ruleForm.studentId"/>
      </el-form-item>
      <el-form-item label="学生名" prop="studentName">
        <el-input v-model="ruleForm.studentName"/>
      </el-form-item>
      <el-form-item label="college" prop="college">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据学院管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的学院"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleForm.college" disabled>
            <template #append>
              <el-select v-model="ruleForm.college" :placeholder="null" style="width: 150px"
                         @change="collegeChange(ruleForm.college)">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="学生班级" prop="studentClass">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据班级管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的班级,请选择学院后再选择班级"
            placement="bottom"
            effect="light">
          <el-input
              disabled
              v-model="ruleForm.studentClass"
              placeholder="Please input"
              class="input-with-select"
          >
            <template #append>
              <el-select :disabled="selectDisabled" v-model="ruleForm.studentClass" placeholder="Select"
                         style="width: 200px">
                <el-option v-for="item in classSelects" :key="item.classId" :label="item.className"
                           :value="item.className"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
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
  <el-drawer v-model="visibleCreate" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">新增学生信息</h4>
      <el-button type="danger" @click="closeDrawerCreate">
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
        :model="ruleFormCreate"
        label-width="auto"
    >

      <el-form-item label="学生照片" :rules="[
          { required: true, message: '请选择头像', trigger: 'change'},
          { validator: validateImageType, trigger: 'change' },
          { validator: validateImageSize, trigger: 'change' },
      ]">
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="handleFileChange">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" alt=""/>
          <el-icon v-else class="avatar-uploader-icon">
            <IEpPlus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="ruleFormCreate.studentId"/>
      </el-form-item>
      <el-form-item label="学生名" prop="studentName">
        <el-input v-model="ruleFormCreate.studentName"/>
      </el-form-item>
      <el-form-item label="college" prop="college">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据学院管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的学院"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormCreate.college" disabled>
            <template #append>
              <el-select v-model="ruleFormCreate.college" :placeholder="null" style="width: 150px"
                         @change="collegeChangeCreate(ruleFormCreate.college)">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="学生班级" prop="studentClass">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据班级管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的班级,请选择学院后再选择班级"
            placement="bottom"
            effect="light">
          <el-input
              disabled
              v-model="ruleFormCreate.studentClass"
              placeholder="Please input"
              class="input-with-select"
          >
            <template #append>
              <el-select :disabled="selectDisabledCreate" v-model="ruleFormCreate.studentClass" placeholder="Select"
                         style="width: 200px">
                <el-option v-for="item in classSelects" :key="item.classId" :label="item.className"
                           :value="item.className"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="学生年龄" prop="studentSex">
        <el-input v-model.number="ruleFormCreate.studentSex"/>
      </el-form-item>
      <el-form-item label="学生年级" prop="studentGrade">
        <el-segmented style="width: 100%" v-model="ruleFormCreate.studentGrade" :options="locationOptionsGrade"/>
      </el-form-item>
      <el-form-item label="级别" prop="location">
        <el-segmented style="width: 100%" v-model="ruleFormCreate.roleId" :options="locationOptionsRole"/>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitFormCreate(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <SpeedDial @click="incrementStudent" direction="right" :style="{ position: 'absolute', right: 10, bottom: 400 }"
             :buttonProps="{ severity: 'warn', rounded: true }"/>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<style scoped lang="less">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.student-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-container {
    width: 99%;
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