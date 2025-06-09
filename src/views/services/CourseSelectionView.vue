<script setup lang="ts">
import {COURSE_TYPE, PUBLISH_STATUS} from "@/typings/enum/course";
import {getStudentCourse} from "@/service/courseSelectionService";
import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {webSocketService} from "@/utils/webSocketServiceUtil";
import {ElMessage} from "element-plus";
import {ISelectionCourse} from "@/typings/interface/selection";

const tableData = reactive<Array<ISelectionCourse>>([])
const reRender = ref<boolean>(false);
const tablePages = ref<number>(1)
const pageCount = ref<number>(0)

const selectSource = () => {

}

onMounted(() => {
  webSocketService.connect();
  webSocketService.subscribe('/topic/courseUpdates', (data: any) => {
    if (data.action === 'refresh') {
      ElMessage({
        type: "success",
        message: "课程选课状态有更新"
      });
      reRender.value = !reRender.value
    }
  });
})

onUnmounted(() => {
  webSocketService.disconnect();
});

watch([reRender, tablePages], async () => {
  const courseResponse = await getStudentCourse<IBaseResponse<PaginationResponse<ISelectionCourse>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_COURSE, tablePages.value
  )
  if (courseResponse.code === 200) {
    tableData.splice(0, tableData.length, ...courseResponse.data.records);
    pageCount.value = Math.ceil(courseResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_COURSE)
  }
}, {immediate: true});

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}
</script>

<template>
  <div class="course-selection-container">
    <el-card class="card-container">
      <el-table :data="tableData" style="width: 1200px">
        <el-table-column fixed align="center" property="courseName" label="courseName" width="200"/>
        <el-table-column align="center" property="courseType" label="courseType" width="120">
          <template #default="scope">
            <el-tag type="success" size="large">
              {{
                scope.row.courseType === 1 ? COURSE_TYPE.COMPULSORY : COURSE_TYPE.ELECTIVE
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" property="courseCredits" label="courseCredits" width="180"/>
        <el-table-column align="center" property="courseCreditHour" label="courseCreditHour" width="180"/>
        <el-table-column align="center" property="courseLocation" label="courseLocation" width="240"/>
        <el-table-column align="center" property="courseCollege" label="courseCollege" width="240"/>
        <el-table-column align="center" property="teacherId" label="teacherId" width="150"/>
        <el-table-column align="center" property="courseCapacity" label="courseCapacity" width="150">
          <template #default="scope">
            {{ scope.row.remainderCourseCapacity }} / {{ scope.row.courseCapacity }}
          </template>
        </el-table-column>
        <el-table-column align="center" property="publishStatus" label="publishStatus" width="200">
          <template #default="scope">
            <el-tag :type="scope.row.publishStatus===0?'warning':scope.row.publishStatus===1?'success':'danger'"
                    size="large">
              {{
                scope.row.publishStatus === 0 ? PUBLISH_STATUS.UNPUBLISHED : scope.row.publishStatus === 1 ?
                    PUBLISH_STATUS.PUBLISH : PUBLISH_STATUS.EXPIRED
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" property="courseGrade" label="courseGrade" width="120">
          <template #default="scope">
            {{ scope.row.courseGrade === 0 ? "不限年级" : `大学${scope.row.courseGrade}年级` }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="100">
          <template #header>
            操作
          </template>
          <template #default="scope">
            <el-popconfirm
                @confirm="selectSource(scope.row.id)"
                class="box-item"
                title="确认要选此门课吗？"
                placement="bottom-start"
            >
              <template #reference>
                <el-button
                    :disabled="scope.row.publishStatus!==1 || scope.row.remainderCourseCapacity<=0 "
                    size="small"
                    type="primary"
                >
                  选课
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right;margin-top: 10px;margin-right: 50px" background layout="prev, pager, next"
                     :page-count="pageCount"
                     @change="sizeChanged"/>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.course-selection-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;
  }
}
</style>