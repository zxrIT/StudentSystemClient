<script setup lang="ts">
import {ICurriculum} from "@/typings/interface/curriculum";
import {getCurriculumService, getSelectCurriculumService} from "@/service/curriculumService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";

const isWatchActive = ref<boolean>(true);
const tablePages = ref<number>(1)
const pageCount = ref<number>(0)
const reRender = ref<boolean>(false)
const tableData = reactive<ICurriculum[]>([])
const search = ref<string>('')

watch([tablePages, reRender, isWatchActive], async () => {
  const curriculumResponse = await getCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
  )
  if (curriculumResponse.code === 200) {
    tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
    pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
}, {immediate: true})

watchEffect(async () => {
  if (search.value == "" && search.value.length === 0) {
    isWatchActive.value = true;
    return;
  }
})

const searchTableData =async () => {
  isWatchActive.value = false;
  tablePages.value = 1
  console.log(search.value)
  const curriculumResponse = await getSelectCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
      search.value, import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
  )
  console.log(curriculumResponse.data)
  if (curriculumResponse.code === 200) {
    tableData.splice(0, tableData.length, ...curriculumResponse.data.records);
    pageCount.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
}

const handleEdit = () => {
}
const changExistence = () => {
}

const deleteCurriculum = () => {
}

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const tableRowClassName = ({row, rowIndex}: { row: ICurriculum, rowIndex: number }) => {
  if (!row.isExistence) {
    return 'warning-row'
  }
  return ''
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
                      :type="scope.row.isExistence === false ? 'primary':'warning'"
                  >
                    {{ scope.row.isExistence === false ? "启用" : "停用" }}
                  </el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                  @confirm="deleteCurriculum(scope.$index, scope.row)"
                  class="box-item"
                  title="确认要删除吗？"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button
                      size="small"
                      type="danger"
                  >
                    删除
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
</template>

<style scoped lang="less">
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