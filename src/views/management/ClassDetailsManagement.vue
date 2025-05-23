<script setup lang="ts">
import {useRoute} from "vue-router";
import {IClass} from "@/typings/interface/class";
import {getStudentByClassService} from "@/service/studentService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {IStudentSimple} from "@/typings/interface/student";

const pageCount = ref<number>(0)
const tablePages = ref<number>(1)
const tableData = reactive<IStudentSimple[]>([])
const className = ref<IClass>({})
const route = useRoute();

watchEffect(() => {
  className.value = JSON.parse(route.query.classObject) as IClass
})

watch([tablePages], async () => {
  const studentResponse = await getStudentByClassService<IBaseResponse<PaginationResponse<IStudentSimple>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_DETAILS, tablePages.value, className.value.className)
  if (studentResponse.code === 200) {
    tableData.splice(0, tableData.length, ...studentResponse.data.records)
    pageCount.value = Math.ceil(studentResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_DETAILS)
  }
}, {immediate: true})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

</script>

<template>
  <div class="class-details-management-container">
    <el-card class="card-container ">
      <el-table :data="tableData" style="width: 99%;height: 100%">
        <el-table-column align="center" prop="studentClass" :label="className.className" min-width="15%"/>
        <el-table-column align="center" :label="className.college">
          <el-table-column align="center" prop="studentName" label="学生名" min-width="15%"/>
          <el-table-column align="center" :label="`班主任: ${className.headTeacher} 辅导员: ${className.counselor}`">
            <el-table-column align="center" prop="studentIcon" label="学生照片" min-width="15%">
              <template #default="scope">
                <el-avatar :size="50" shape="circle" :src="
                scope.row.studentIcon===undefined || scope.row.studentIcon===null||scope.row.studentIcon.length===0?
                __VITE_USER_AVATAR__:
                scope.row.studentIcon"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="studentId" label="学生学号" min-width="15%"/>
            <el-table-column align="center" prop="studentGrade" label="学生年级" min-width="15%"/>
            <el-table-column align="center" label="操作" min-width="15%">
              <template #default="scope">
                <el-popconfirm
                    class="box-item"
                    title="确认要移除吗？"
                    placement="bottom-start"
                >
                  <template #reference>
                    <el-button
                        size="small"
                        type="danger"
                    >
                      移除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next"
                       :page-count="pageCount"
                       @change="sizeChanged"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.class-details-management-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;

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