<script setup lang="ts">
import {useTransition} from '@vueuse/core'
import {
  getCollegeService,
  incrementCollegeService,
  updateCollegeIsExistenceService,
  updateCollegeService
} from "@/service/collegeService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {ICollege} from "@/typings/interface/college";
import {useCollegeRules} from "@/rules/user/useCollegeRules";
import {ElMessage, FormInstance} from 'element-plus'
import SpeedDial from "primevue/speeddial";

const visibleCreate = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>()
const reRender = ref<boolean>(false);
const visibleEdit = ref<boolean>(false)
const tableData = reactive<ICollege[]>([])
const pageCount = ref<number>(0)
const tablePages = ref<number>(1)
const source = ref(0)
const outputValue = useTransition(source, {duration: 1500})
source.value = 172000
const disabled = ref<boolean>(false)

const ruleForm = reactive<ICollege>({
  id: "",
  collegeId: "",
  collegeName: "",
  classCount: 0,
})

const ruleFormCreate = reactive<ICollege>({
  collegeId: "",
  collegeName: "",
  classCount: 0,
})

const tableRowClassName = ({row, rowIndex}: { row: ICollege, rowIndex: number }) => {
  if (!row.isExistence) {
    return 'warning-row'
  }
  return ''
}

watch([tablePages, reRender], async () => {
  const collegeResponse = await getCollegeService<IBaseResponse<PaginationResponse<ICollege>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_COLLEGE, tablePages.value
  )
  if (collegeResponse.code === 200) {
    tableData.splice(0, tableData.length, ...collegeResponse.data.records);
    pageCount.value = Math.ceil(collegeResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_COLLEGE)
  }
}, {immediate: true})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const handleEdit = async (_, row: ICollege) => {
  visibleEdit.value = true
  ruleForm.id = row.id
  ruleForm.collegeId = row.collegeId
  ruleForm.classCount = row.classCount
  ruleForm.collegeName = row.collegeName
}

const closeDrawer = () => {
  visibleEdit.value = false
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          const collegeResponse = await updateCollegeService<IBaseResponse<string>>(ruleForm)
          if (collegeResponse.code === 200) {
            reRender.value = !reRender.value
            ElMessage({
              type: 'success',
              message: collegeResponse.data,
            })
          } else {
            ElMessage({
              type: 'error',
              message: collegeResponse.data,
            })
          }
        } else {
          ElMessage({
            type: 'error',
            message: "请按照提示先填写信息后再提交",
          })
        }
      }
  )
}

const submitFormCreate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          const collegeResponse = await incrementCollegeService<IBaseResponse<string>>(ruleFormCreate)
          if (collegeResponse.code === 200) {
            visibleCreate.value = false
            reRender.value = !reRender.value
            ElMessage({
              type: 'success',
              message: collegeResponse.data,
            })
          } else {
            ElMessage({
              type: 'error',
              message: collegeResponse.data,
            })
          }
        } else {
          ElMessage({
            type: 'error',
            message: "请按照提示先填写信息后再提交",
          })
        }
      }
  )
}

const incrementCollege = () => {
  visibleCreate.value = true
}

const changExistence = async (_, row: ICollege) => {
  const collegeResponse = await updateCollegeIsExistenceService<IBaseResponse<string>>(row.id)
  if (collegeResponse.code === 200) {
    reRender.value = !reRender.value
    ElMessage({
      type: 'success',
      message: collegeResponse.data,
    })
  } else {
    ElMessage({
      type: 'error',
      message: collegeResponse.data,
    })
  }
}
</script>

<template>
  <div class="college-management-container">
    <el-card class="card-container">
      <div class="card-container-header">
        <el-card class="card">
          <el-row>
            <el-col :span="4">
              <el-tag type="warning" style="margin-bottom: 2px">电气信息工程学院</el-tag>
              <el-tag type="primary">你好：曾祥瑞</el-tag>
            </el-col>
            <el-col :span="4">
              <el-statistic title="学院教师人数" :value="268"/>
            </el-col>
            <el-col :span="4">
              <el-statistic :value="138">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    授课数量
                    <el-icon style="margin-left: 4px" :size="12">
                      <IEpCollection/>
                    </el-icon>
                  </div>
                </template>
                <template #suffix>/100</template>
              </el-statistic>
            </el-col>
            <el-col :span="4">
              <el-statistic title="学院学生人数" :value="outputValue"/>
            </el-col>
            <el-col :span="4">
              <el-statistic title="班级数" :value="562">
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em">
                    <IEpChatLineRound/>
                  </el-icon>
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="card-container-table">
        <el-card class="card">
          <el-table :data="tableData" style="width: 99%" :row-class-name="tableRowClassName">
            <el-table-column align="center" prop="collegeId" label="collegeId" min-width="24%"/>
            <el-table-column align="center" prop="collegeName" label="collegeName" min-width="24%"/>
            <el-table-column align="center" prop="classCount" label="classCount" min-width="24%"/>
            <el-table-column align="center" min-width="24%">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                  Edit
                </el-button>
                <el-popconfirm
                    @confirm="changExistence(scope.$index, scope.row)"
                    class="box-item"
                    :title="scope.row.isExistence === false ?'确认要启用吗？':'确认要停用吗?'"
                    placement="bottom-start"
                >
                  <template #reference>
                    <el-button
                        size="small"
                        :type="scope.row.isExistence === false ? 'primary':'danger'"
                    >
                      {{ scope.row.isExistence === false ? "启用" : "停用" }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div class="pagination-container">
          <el-pagination background layout="prev, pager, next"
                         :page-count="pageCount"
                         @change="sizeChanged"/>
        </div>
      </div>
    </el-card>
  </div>
  <el-drawer v-model="visibleEdit" :show-close="false" direction="ttb">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">修改学院信息</h4>
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
        :model="ruleForm"
        :rules="useCollegeRules"
        label-width="auto"
    >
      <el-form-item label="collegeId" prop="collegeId">
        <el-input v-model="ruleForm.collegeId"/>
      </el-form-item>
      <el-form-item label="collegeName" prop="collegeName">
        <el-input v-model="ruleForm.collegeName"/>
      </el-form-item>
      <el-tooltip
          :disabled="disabled"
          content="此字段根据课程管理动态关联不可手动修改，如有问题请联系管理员处理"
          placement="bottom"
          effect="light"
      >
        <el-form-item label="classCount" prop="classCount">
          <el-input v-model.number="ruleForm.classCount" disabled/>
        </el-form-item>
      </el-tooltip>
      <el-form-item>
        <el-button type="primary" round size="large" @click="submitForm(ruleFormRef)">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="visibleCreate" :show-close="false" direction="ttb">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">添加学院信息</h4>
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
        :model="ruleFormCreate"
        :rules="useCollegeRules"
        label-width="auto"
    >
      <el-form-item label="collegeId" prop="collegeId">
        <el-input v-model="ruleFormCreate.collegeId"/>
      </el-form-item>
      <el-form-item label="collegeName" prop="collegeName">
        <el-input v-model="ruleFormCreate.collegeName"/>
      </el-form-item>
      <el-tooltip
          :disabled="disabled"
          content="此字段根据课程管理动态关联不可手动修改，如有问题请联系管理员处理"
          placement="bottom"
          effect="light"
      >
        <el-form-item label="classCount" prop="classCount">
          <el-input v-model.number="ruleFormCreate.classCount" disabled/>
        </el-form-item>
      </el-tooltip>
      <el-form-item>
        <el-button type="primary" round size="large" @click="submitFormCreate(ruleFormRef)">
          添加
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <SpeedDial @click="incrementCollege" direction="right" :style="{ position: 'absolute', right: 10, bottom: 400 }"
             :buttonProps="{ severity: 'warn', rounded: true }"/>
</template>

<style scoped lang="less">

:deep(.warning-row) {
  background-color: var(--el-color-danger-light-7) !important;
}

.college-management-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .card-container-header {
      width: 100%;
      flex-grow: 3;
      margin-bottom: 10px;

      .card {
        width: 100%;
        height: 100%;
      }
    }

    .card-container-table {
      width: 100%;
      flex-grow: 7;

      .pagination-container {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: right;
        margin-top: 20px;
      }

      .card {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>