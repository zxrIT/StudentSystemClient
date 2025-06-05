<script setup lang="ts">
import {ICurriculum} from "@/typings/interface/curriculum";
import {
  changIsExistenceService, getCurriculumDeleteService,
  getCurriculumService, getDeleteSelectCurriculumService,
  getSelectCurriculumService,
  incrementCurriculumService, removeCurriculumService,
  updateCurriculumService, moveCurriculumService, changDeleteIsExistenceService, updateDeleteCurriculumService
} from "@/service/curriculumService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {ElMessage, FormInstance} from "element-plus";
import SpeedDial from "primevue/speeddial";
import {useCurriculumRules} from "@/rules/curriculum/curriculumRules";

const ruleFormRef = ref<FormInstance>()
const showStatus = ref<boolean>(true)
const visibleCreate = ref<boolean>(false);
const visibleEdit = ref<boolean>(false);
const isWatchActive = ref<boolean>(true);
const tablePages = ref<number>(1)
const pageCount = ref<number>(0)
const reRender = ref<boolean>(false)
const tableData = reactive<ICurriculum[]>([])
const search = ref<string>('')
const disabled = ref<boolean>(false)

const ruleFormCreate = reactive<ICurriculum>({
  name: "",
  curriculumId: "",
  capacity: 0,
  credits: 0,
  creditHour: 24,
  location: "",
})

const ruleFormEdit = reactive<ICurriculum>({
  id: "",
  name: "",
  curriculumId: "",
  capacity: 0,
  credits: 0,
  creditHour: 24,
  location: "",
})

watch([tablePages, reRender, isWatchActive, showStatus], async () => {
  if (isWatchActive.value) {
    if (showStatus.value) {
      const curriculumResponse = await getCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
          import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
      )
      if (curriculumResponse.code === 200) {
        tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
        pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
      }
    } else {
      const curriculumResponse = await getCurriculumDeleteService<IBaseResponse<PaginationResponse<ICurriculum>>>(
          import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
      )
      if (curriculumResponse.code === 200) {
        tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
        pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
      }
    }
  }
}, {immediate: true})

watchEffect(async () => {
  if (search.value == "" && search.value.length === 0) {
    isWatchActive.value = true;
    return;
  }
})

const searchTableData = async () => {
  isWatchActive.value = false;
  tablePages.value = 1
  if (showStatus.value) {
    const curriculumResponse = await getSelectCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
        search.value, import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
    )
    if (curriculumResponse.code === 200) {
      tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
      pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
    }
  } else {
    const curriculumResponse = await getDeleteSelectCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
        search.value, import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
    )
    if (curriculumResponse.code === 200) {
      tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
      pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
    }
  }
}

const handleEdit = (curriculum: ICurriculum) => {
  ruleFormEdit.id = curriculum.id
  ruleFormEdit.name = curriculum.name
  ruleFormEdit.curriculumId = curriculum.curriculumId
  ruleFormEdit.capacity = curriculum.capacity
  ruleFormEdit.credits = curriculum.credits
  ruleFormEdit.creditHour = curriculum.creditHour
  ruleFormEdit.location = curriculum.location
  visibleEdit.value = true
}

const changExistence = async (id: string) => {
  let curriculumResponse = null
  if (showStatus.value) {
    curriculumResponse = await changIsExistenceService<IBaseResponse<string>>(id)
  } else {
    curriculumResponse = await changDeleteIsExistenceService<IBaseResponse<string>>(id)
  }
  if (curriculumResponse.code === 200) {
    reRender.value = !reRender.value
    ElMessage({
      type: 'success',
      message: curriculumResponse.data,
    })
  } else {
    ElMessage({
      type: 'error',
      message: curriculumResponse.data,
    })
  }
}

const removeCurriculum = async (id: string) => {
  if (showStatus.value) {
    const curriculumResponse = await removeCurriculumService<IBaseResponse<string>>(id)
    if (curriculumResponse.code === 200) {
      reRender.value = !reRender.value
      ElMessage({
        type: 'success',
        message: curriculumResponse.data,
      })
    } else {
      ElMessage({
        type: 'error',
        message: curriculumResponse.data,
      })
    }
  } else {
    const curriculumResponse = await moveCurriculumService<IBaseResponse<string>>(id)
    if (curriculumResponse.code === 200) {
      reRender.value = !reRender.value
      ElMessage({
        type: 'success',
        message: curriculumResponse.data,
      })
    } else {
      ElMessage({
        type: 'error',
        message: curriculumResponse.data,
      })
    }
  }
}

const closeDrawer = () => {
  visibleCreate.value = false
}

const closeDrawerEdit = () => {
  visibleEdit.value = false
}

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const submitFormCreate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          const curriculumResponse = await incrementCurriculumService<IBaseResponse<string>>(ruleFormCreate)
          if (curriculumResponse.code === 200) {
            reRender.value = !reRender.value
            visibleCreate.value = false
            ElMessage({
              type: 'success',
              message: curriculumResponse.data,
            })
          } else {
            ElMessage({
              type: 'error',
              message: curriculumResponse.data,
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

const submitFormEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          let curriculumResponse = null
          if (showStatus.value) {
            curriculumResponse = await updateCurriculumService<IBaseResponse<string>>(ruleFormEdit)
          } else {
            curriculumResponse = await updateDeleteCurriculumService<IBaseResponse<string>>(ruleFormEdit)
          }
          if (curriculumResponse.code === 200) {
            reRender.value = !reRender.value
            visibleEdit.value = false
            ElMessage({
              type: 'success',
              message: curriculumResponse.data,
            })
          } else {
            ElMessage({
              type: 'error',
              message: curriculumResponse.data,
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

const tableRowClassName = ({row, rowIndex}: { row: ICurriculum, rowIndex: number }) => {
  if (!row.isExistence) {
    return 'warning-row'
  }
  return ''
}

const incrementCurriculum = () => {
  visibleCreate.value = true
}

const goDelete = () => {
  showStatus.value = false
  isWatchActive.value = true
  tablePages.value = 1
  search.value = ''
}

const goCurriculum = () => {
  showStatus.value = true
  isWatchActive.value = true
  tablePages.value = 1
  search.value = ''
}
</script>
<template>
  <div class="curriculum-management-container">
    <el-card style="width: 100%;height: 100%">
      <div class="table-container">
        <el-table :data="tableData" style="width: 99%" :row-class-name="tableRowClassName">
          <el-table-column align="center" prop="curriculumId" label="curriculumId" min-width="20%"/>
          <el-table-column align="center" prop="name" label="name" min-width="20%"/>
          <el-table-column align="center" prop="capacity" label="capacity" min-width="10%"/>
          <el-table-column align="center" prop="credits" label="credits" min-width="10%"/>
          <el-table-column align="center" prop="creditHour" label="creditHour" min-width="10%"/>
          <el-table-column align="center" prop="location" label="location" min-width="10%"/>
          <el-table-column align="center" min-width="20%">
            <template #header>
              <el-input v-model="search" size="small" placeholder="请输入课程关键词回车确认"
                        @keyup.enter="searchTableData"/>
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                Edit
              </el-button>
              <el-popconfirm
                  @confirm="changExistence(scope.row.id)"
                  class="box-item"
                  :title="scope.row.isExistence === false ?'确认要启用吗？':'确认要停用吗?'"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button
                      size="small"
                      :type="scope.row.isExistence === false ? 'primary':'warning'"
                  >
                    {{ scope.row.isExistence === false ? "启用" : "停用" }}
                  </el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                  @confirm="removeCurriculum(scope.row.id)"
                  class="box-item"
                  :title="showStatus?'确认要移除至回收站吗？':'确认要移回吗？'"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button
                      size="small"
                      type="danger"
                  >
                    {{ showStatus ? "移除" : "移回" }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-tooltip
            v-if="showStatus"
            :disabled="disabled"
            content="点击前往课程回收站"
            placement="bottom"
            effect="light"
        >
          <el-icon @click="goDelete" v-if="showStatus" size="35" style="margin-right: 50px">
            <IEpDelete/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            v-if="!showStatus"
            :disabled="disabled"
            content="点击前往课程页"
            placement="bottom"
            effect="light"
        >
          <el-icon @click="goCurriculum" v-if="!showStatus" size="35" style="margin-right: 50px">
            <IEpHomeFilled/>
          </el-icon>
        </el-tooltip>
        <el-pagination background layout="prev, pager, next"
                       :page-count="pageCount"
                       @change="sizeChanged"/>
      </div>
    </el-card>
  </div>
  <el-drawer v-model="visibleCreate" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">添加课程信息</h4>
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
        :rules="useCurriculumRules"
        :model="ruleFormCreate"
        label-width="auto"
    >
      <el-form-item label="curriculumId" prop="curriculumId">
        <el-input v-model="ruleFormCreate.curriculumId" size="large"/>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="ruleFormCreate.name" size="large"/>
      </el-form-item>
      <el-form-item label="capacity" prop="capacity">
        <el-input-number v-model="ruleFormCreate.capacity" size="large" style="width: 100%">
          <template #suffix>
            <span>容量</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="credits" prop="credits">
        <el-input-number v-model="ruleFormCreate.credits" :precision="1" :step="0.5" size="large" style="width: 100%">
          <template #suffix>
            <span>学分</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="creditHour" prop="creditHour">
        <el-input-number v-model="ruleFormCreate.creditHour" size="large" style="width: 100%">
          <template #suffix>
            <span>学时</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="location" prop="location">
        <el-input v-model="ruleFormCreate.location" size="large"/>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitFormCreate(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="visibleEdit" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">添加课程信息</h4>
      <el-button type="danger" @click="closeDrawerEdit">
        <el-icon class="el-icon--left">
          <IEpCircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :rules="useCurriculumRules"
        :model="ruleFormEdit"
        label-width="auto"
    >
      <el-tooltip
          :disabled="disabled"
          content="课程唯一标识由系统自动生成禁止修改"
          placement="bottom"
          effect="light"
      >
        <el-form-item label="id" prop="id">
          <el-input v-model="ruleFormEdit.id" size="large" disabled/>
        </el-form-item>
      </el-tooltip>
      <el-form-item label="curriculumId" prop="curriculumId">
        <el-input v-model="ruleFormEdit.curriculumId" size="large"/>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="ruleFormEdit.name" size="large"/>
      </el-form-item>
      <el-form-item label="capacity" prop="capacity">
        <el-input-number v-model="ruleFormEdit.capacity" size="large" style="width: 100%">
          <template #suffix>
            <span>容量</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="credits" prop="credits">
        <el-input-number v-model="ruleFormEdit.credits" :precision="1" :step="0.5" size="large" style="width: 100%">
          <template #suffix>
            <span>学分</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="creditHour" prop="creditHour">
        <el-input-number v-model="ruleFormEdit.creditHour" size="large" style="width: 100%">
          <template #suffix>
            <span>学时</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="location" prop="location">
        <el-input v-model="ruleFormEdit.location" size="large"/>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitFormEdit(ruleFormRef)">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <SpeedDial v-if="showStatus" @click="incrementCurriculum" direction="right"
             :style="{ position: 'absolute', right: 10, bottom: 400 }"
             :buttonProps="{ severity: 'warn', rounded: true }"/>
</template>

<style scoped lang="less">
:deep(.warning-row) {
  background-color: var(--el-color-danger-light-7) !important;
}

.curriculum-management-container {
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
</style>