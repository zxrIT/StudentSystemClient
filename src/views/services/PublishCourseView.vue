<script setup lang="ts">
import {nanoid} from 'nanoid';
import {webSocketService} from '@/utils/webSocketServiceUtil';
import {IPublishCourse, IPublishCourseView} from "@/typings/interface/publish";
import {
  getPublishCourseService,
  incrementPublishCourseService,
  updatePublishCourseService,
  deletePublishCourseService, getSelectPublishCourseService, publishCourseService, revokePublishedCourseService,
} from "@/service/publishCourse";

import {IBaseResponse} from "@/typings/response/baseResponse";
import {PaginationResponse} from "@/typings/response/pagination";
import {COURSE_TYPE, PUBLISH_STATUS} from "@/typings/enum/course";
import SpeedDial from "primevue/speeddial";
import {ElMessage, FormInstance} from "element-plus";
import {TEACHER_SELECT, USER_GRADE} from "@/typings/enum/user";
import {ICollegeName} from "@/typings/interface/college";
import {getCollegeNamesService} from "@/service/collegeService";
import {ICurriculum} from "@/typings/interface/curriculum";
import {getCurriculumByIdService, getCurriculumService, getSelectCurriculumService} from "@/service/curriculumService";
import {ITeacher} from "@/typings/interface/teacher";
import {getTeacherSelectService, getTeacherService} from "@/service/teacherService";
import {useSystemStore} from "@/store";
import {SYSTEM_ENUM_INTERNATION} from "@/typings/enum/systemEnum";

const publishDialog = ref<boolean>(false);
const visibleEdit = ref<boolean>(false);
const selectCourse = ref<string>("");
const selectTeacher = ref<string>("");
const loading = ref<boolean>(true);
const disabled = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const visibleCreate = ref<boolean>(false);
const reRender = ref<boolean>(false);
const pageCount = ref<number>(0)
const pageCountSelectedTeacher = ref<number>(0)
const pageCountSelected = ref<number>(0)
const isWatchActive = ref<boolean>(true);
const isWatchActiveSelect = ref<boolean>(true);
const isWatchActiveTeacher = ref<boolean>(true);
const incrementItemShowStatus = ref<boolean>(false);
const tablePages = ref<number>(1)
const search = ref<string>("")
const tableDataTeacher = reactive<Array<ITeacher>>([])
const tableDataCurriculum = reactive<ICurriculum[]>([])
const tablePagesSelected = ref<number>(1)
const tablePagesTeacher = ref<number>(1)
const tableData = reactive<Array<IPublishCourse>>([])
const collegeSelects = reactive<ICollegeName[]>([])
const publishChoice = ref<string>("")
const batchBtnShowStatus = ref<boolean>(false)
const batchStatus = ref<boolean>(false);
const publishTimer = ref<[Date, Date]>([
  new Date(),
  new Date((new Date()).getTime() + 86400000),
])
const multipleChoicesPublishCourse = reactive<IPublishCourse[]>([])
const systemStore = useSystemStore()

const locationOptionsGrade: string[] = ["不限", USER_GRADE.ONE, USER_GRADE.TWO, USER_GRADE.THREE, USER_GRADE.FORE]
const locationOptionsCourseType: COURSE_TYPE[] = [COURSE_TYPE.COMPULSORY, COURSE_TYPE.ELECTIVE]
const locationOptionsPublishStatus: PUBLISH_STATUS[] = [PUBLISH_STATUS.UNPUBLISHED]

const ruleFormCreate = reactive<IPublishCourse>({
  courseId: "",
  courseName: "",
  courseType: 1,
  courseCredits: 0,
  courseCreditHour: 0,
  courseLocation: "",
  teacherId: "",
  courseCapacity: 0,
  publishStatus: 0,
  courseGrade: 0,
  courseCollege: ""
})

const ruleFormEdit = reactive<IPublishCourse>({
  id: "",
  courseType: 1,
  teacherId: "",
  courseGrade: 0,
  courseCollege: ""
})

const ruleFormCreateView = reactive<IPublishCourseView>({
  courseId: "",
  courseName: "",
  courseType: COURSE_TYPE.COMPULSORY,
  courseCredits: 0,
  courseCreditHour: 0,
  courseLocation: "",
  teacherId: "",
  courseCapacity: 0,
  publishStatus: PUBLISH_STATUS.UNPUBLISHED,
  courseGrade: "不限",
  courseCollege: ""
})

const ruleFormEditView = reactive<IPublishCourseView>({
  id: "",
  courseId: "",
  courseName: "",
  courseType: COURSE_TYPE.COMPULSORY,
  courseCredits: 0,
  courseCreditHour: 0,
  courseLocation: "",
  teacherId: "",
  courseCapacity: 0,
  publishStatus: PUBLISH_STATUS.UNPUBLISHED,
  courseGrade: "不限",
  courseCollege: ""
})

const sizeChanged = (pages: number) => {
  tablePages.value = pages;
}

const handleEdit = (course: IPublishCourse) => {
  visibleEdit.value = true;
  ruleFormEditView.id = course.id
  ruleFormEditView.courseId = course.courseId
  ruleFormEditView.courseName = course.courseName
  ruleFormEditView.courseType = course.courseType === 1 ? COURSE_TYPE.COMPULSORY : COURSE_TYPE.ELECTIVE
  ruleFormEditView.courseCollege = course.courseCollege
  ruleFormEditView.courseLocation = course.courseLocation
  ruleFormEditView.teacherId = course.teacherId
  ruleFormEditView.courseCreditHour = course.courseCreditHour
  ruleFormEditView.courseCredits = course.courseCredits
  ruleFormEditView.courseCapacity = course.courseCapacity
  ruleFormEditView.publishStatus = PUBLISH_STATUS.UNPUBLISHED
  switch (course.courseGrade) {
    case 1:
      ruleFormEditView.courseGrade = USER_GRADE.ONE
      break;
    case 2:
      ruleFormEditView.courseGrade = USER_GRADE.TWO
      break;
    case 3:
      ruleFormEditView.courseGrade = USER_GRADE.THREE
      break;
    case 4:
      ruleFormEditView.courseGrade = USER_GRADE.FORE
      break;
    default:
      ruleFormEditView.courseGrade = "不限"
  }
  console.log(course)
}

const sizeChangedSelect = (pages: number) => {
  tablePagesSelected.value = pages;
}

const sizeChangedSelectTeacher = (pages: number) => {
  tablePagesTeacher.value = pages;
}

const closeDrawerCreate = () => {
  visibleCreate.value = false;
}

watch([reRender, isWatchActive, tablePages], async () => {
  if (isWatchActive.value) {
    const courseResponse = await getPublishCourseService<IBaseResponse<PaginationResponse<IPublishCourse>>>(
        import.meta.env.VITE_PAGINATION_QUANTITY_COURSE, tablePages.value
    )
    if (courseResponse.code === 200) {
      tableData.splice(0, tableData.length, ...courseResponse.data.records);
      pageCount.value = Math.ceil(courseResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_COURSE)
    }
  }
}, {immediate: true})

const submitFormCreate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ruleFormCreate.courseCredits = ruleFormCreateView.courseCredits
      ruleFormCreate.courseCreditHour = ruleFormCreateView.courseCreditHour
      ruleFormCreate.courseCapacity = ruleFormCreateView.courseCapacity
      ruleFormCreate.courseLocation = ruleFormCreateView.courseLocation
      ruleFormCreate.publishStatus = 0
      ruleFormCreate.courseType = ruleFormCreateView.courseType === COURSE_TYPE.COMPULSORY ? 1 : 2
      ruleFormCreate.courseName = ruleFormCreateView.courseName
      ruleFormCreate.courseId = ruleFormCreateView.courseId
      if (ruleFormCreateView.courseCollege === "不限") {
        ruleFormCreate.courseCollege = "all"
      } else {
        collegeSelects.forEach(college => {
          if (college.collegeName === ruleFormCreateView.courseCollege) {
            ruleFormCreate.courseCollege = college.collegeId
            return
          }
        })
      }
      switch (ruleFormCreateView.courseGrade) {
        case "不限":
          ruleFormCreate.courseGrade = 0
          break;
        case USER_GRADE.ONE:
          ruleFormCreate.courseGrade = 1
          break;
        case USER_GRADE.TWO:
          ruleFormCreate.courseGrade = 2
          break;
        case USER_GRADE.THREE:
          ruleFormCreate.courseGrade = 3
          break;
        case USER_GRADE.FORE:
          ruleFormCreate.courseGrade = 4
          break;
        default:
          ruleFormCreate.courseGrade = 0
      }
      tableDataTeacher.forEach(teacher => {
        if (teacher.teacherName === ruleFormCreateView.teacherId) {
          ruleFormCreate.teacherId = teacher.teacherId
          return
        }
      })
      const publishCourseResponse = await incrementPublishCourseService<IBaseResponse<string>>(ruleFormCreate)
      if (publishCourseResponse.code === 200) {
        reRender.value = !reRender.value
        visibleCreate.value = false
        ElMessage({
          type: "success",
          message: publishCourseResponse.data,
        })
      } else {
        ElMessage({
          type: "error",
          message: publishCourseResponse.data,
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

const submitFormUpdate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ruleFormEdit.id = ruleFormEditView.id
      switch (ruleFormEditView.courseGrade) {
        case "不限":
          ruleFormEdit.courseGrade = 0
          break;
        case USER_GRADE.ONE:
          ruleFormEdit.courseGrade = 1
          break;
        case USER_GRADE.TWO:
          ruleFormEdit.courseGrade = 2
          break;
        case USER_GRADE.THREE:
          ruleFormEdit.courseGrade = 3
          break;
        case USER_GRADE.FORE:
          ruleFormEdit.courseGrade = 4
          break;
        default:
          ruleFormEdit.courseGrade = 0
      }
      tableDataTeacher.forEach(teacher => {
        if (teacher.teacherName === ruleFormEditView.teacherId) {
          ruleFormEdit.teacherId = teacher.teacherId
          return
        }
      })
      if (ruleFormEditView.courseCollege === "不限") {
        ruleFormEdit.courseCollege = "all"
      } else {
        collegeSelects.forEach(college => {
          if (college.collegeName === ruleFormEditView.courseCollege) {
            ruleFormEdit.courseCollege = college.collegeId
            return
          }
        })
      }
      const publishCourseResponse = await updatePublishCourseService<IBaseResponse<string>>(ruleFormEdit)
      if (publishCourseResponse.code === 200) {
        reRender.value = !reRender.value
        visibleEdit.value = false
        ElMessage({
          type: "success",
          message: publishCourseResponse.data,
        })
      } else {
        ElMessage({
          type: "error",
          message: publishCourseResponse.data,
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

const incrementCourse = async () => {
  visibleCreate.value = true
  const curriculumResponse = await getCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePagesSelected.value
  )
  if (curriculumResponse.code === 200) {
    tableDataCurriculum.splice(0, tableDataCurriculum.length, ...curriculumResponse.data.records);
    pageCountSelected.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
}

const searchPublishCourse = async () => {
  isWatchActive.value = false
  tablePages.value = 1
  const courseResponse = await getSelectPublishCourseService<IBaseResponse<PaginationResponse<IPublishCourse>>>(
      search.value, import.meta.env.VITE_PAGINATION_QUANTITY_COURSE, tablePages.value
  )
  if (courseResponse.code === 200) {
    tableData.splice(0, tableData.length, ...courseResponse.data.records);
    pageCount.value = Math.ceil(courseResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_COURSE)
  }
}

const getCourse = async (courseId: string) => {
  loading.value = true
  const curriculumResponse = await getCurriculumByIdService<IBaseResponse<ICurriculum>>(courseId)
  if (curriculumResponse.code === 200) {
    ruleFormCreateView.courseId = curriculumResponse.data.id
    ruleFormCreateView.courseCapacity = curriculumResponse.data.capacity
    ruleFormCreateView.courseLocation = curriculumResponse.data.location
    ruleFormCreateView.courseCreditHour = curriculumResponse.data.creditHour
    ruleFormCreateView.courseCredits = curriculumResponse.data.credits
    incrementItemShowStatus.value = true
    loading.value = false
  } else {
    ElMessage({
      type: 'error',
      message: curriculumResponse.data,
    })
  }
}

watchEffect(() => {
  if (search.value == "" && search.value.length === 0) {
    isWatchActive.value = true
  }
})

watchEffect(() => {
  if (selectCourse.value == "" && selectCourse.value.length === 0) {
    isWatchActiveSelect.value = true;
  }
})

watchEffect(() => {
  if (selectTeacher.value == "" && selectTeacher.value.length === 0) {
    isWatchActiveTeacher.value = true;
  }
})

const handlePublish = (id: string) => {
  publishDialog.value = true
  publishChoice.value = id
}

const handleUnPublish = async (id: string) => {
  console.log(id)
  const dataObject = {
    courseIds: [id]
  }
  const publishCourseResponse = await revokePublishedCourseService<IBaseResponse<string>>(dataObject)
  if (publishCourseResponse.code === 200) {
    reRender.value = !reRender.value
    ElMessage({
      type: "success",
      message: publishCourseResponse.data,
    })
  } else {
    ElMessage({
      type: "error",
      message: publishCourseResponse.data,
    })
  }
}

const publish = async () => {
  const dataObject = {
    startTime: publishTimer.value[0],
    endTime: publishTimer.value[1],
    courseIds: batchStatus.value ? multipleChoicesPublishCourse.map((course: IPublishCourse) => course.id) : [publishChoice.value]
  }
  const publishCourseResponse = await publishCourseService<IBaseResponse<string>>(dataObject)
  console.log(publishCourseResponse)
  if (publishCourseResponse.code === 200) {
    publishDialog.value = false
    reRender.value = !reRender.value
    publishChoice.value = ""
    if (batchStatus.value) {
      batchStatus.value = false
      multipleChoicesPublishCourse.splice(0, multipleChoicesPublishCourse.length)
    }
    ElMessage({
      type: "success",
      message: publishCourseResponse.data,
    })
  } else {
    ElMessage({
      type: "error",
      message: publishCourseResponse.data,
    })
  }
}

const handleDelete = async (id: string) => {
  const publishCourseResponse = await deletePublishCourseService<IBaseResponse<string>>(id)
  if (publishCourseResponse.code === 200) {
    reRender.value = !reRender.value
    ElMessage({
      type: "success",
      message: publishCourseResponse.data,
    })
  } else {
    ElMessage({
      type: "error",
      message: publishCourseResponse.data,
    })
  }
}

const searchTableDataCourse = async () => {
  isWatchActiveSelect.value = false
  tablePagesSelected.value = 1
  const curriculumResponse = await getSelectCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
      selectCourse.value, import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePagesSelected.value
  )
  if (curriculumResponse.code === 200) {
    tableDataCurriculum.splice(0, tableDataCurriculum.length, ...curriculumResponse.data.records);
    pageCountSelected.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
}

const selectTeacherData = async () => {
  isWatchActiveTeacher.value = false
  tablePagesTeacher.value = 1
  const teacherResponse = await getTeacherSelectService<IBaseResponse<PaginationResponse<ITeacher>>>(
      TEACHER_SELECT.NAME, selectTeacher.value, import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePages.value
  )
  if (teacherResponse.code === 200) {
    tableDataTeacher.splice(0, tableDataTeacher.length, ...teacherResponse.data.records);
    pageCountSelectedTeacher.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
}

onMounted(async () => {
  const teacherResponse = await getTeacherService<IBaseResponse<PaginationResponse<ITeacher>>>(
      import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePagesTeacher.value
  )
  if (teacherResponse.code === 200) {
    tableDataTeacher.splice(0, tableDataTeacher.length, ...teacherResponse.data.records);
    pageCountSelectedTeacher.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
  }
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeResponse.data.unshift({id: nanoid(), collegeId: "all", collegeName: "不限"})
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
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

const handleSelectionChange = (value: IPublishCourse[]) => {
  multipleChoicesPublishCourse.splice(0, multipleChoicesPublishCourse.length, ...value)
  batchBtnShowStatus.value = value.length >= 2;
}

const batchPublishCourse = () => {
  publishDialog.value = true
  batchStatus.value = true
}

watch([tablePagesTeacher, isWatchActiveTeacher], async () => {
  if (isWatchActiveTeacher.value) {
    const teacherResponse = await getTeacherService<IBaseResponse<PaginationResponse<ITeacher>>>(
        import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePagesTeacher.value
    )
    if (teacherResponse.code === 200) {
      tableDataTeacher.splice(0, tableDataTeacher.length, ...teacherResponse.data.records);
      pageCountSelectedTeacher.value = Math.ceil(teacherResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
    }
  }
})

watch([tablePagesSelected, isWatchActiveSelect], async () => {
  if (isWatchActiveSelect.value) {
    const curriculumResponse = await getCurriculumService<IBaseResponse<PaginationResponse<ICurriculum>>>(
        import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM, tablePagesSelected.value
    )
    if (curriculumResponse.code === 200) {
      tableDataCurriculum.splice(0, tableDataCurriculum.length, ...curriculumResponse.data.records);
      pageCountSelected.value = Math.ceil(curriculumResponse.data.total / import.meta.env.VITE_PAGINATION_QUANTITY_CURRICULUM)
    }
  }
})
</script>

<template>
  <div class="publish-course-container">
    <el-card class="card-container">
      <el-table :data="tableData" :style="systemStore.systemState.internationalization===SYSTEM_ENUM_INTERNATION.EN?
      'width:1100px':'width:1200px'" @selection-change="handleSelectionChange">
        <el-table-column align="center" fixed type="selection" width="55"/>
        <el-table-column align="center" property="courseId" label="courseId" width="200"/>
        <el-table-column align="center" property="courseName" label="courseName" width="300"/>
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
        <el-table-column align="center" fixed="right" width="200">
          <template #header>
            <el-input v-model="search" @keydown.enter="searchPublishCourse" size="small"
                      placeholder="请输入课程关键字回车确认"/>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              Edit
            </el-button>
            <el-popconfirm
                @confirm="handleDelete(scope.row.id)"
                class="box-item"
                title="确认要删除吗？"
                placement="bottom-start"
            >
              <template #reference>
                <el-button
                    size="small"
                    type="warning"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
                v-if="scope.row.publishStatus!==1"
                size="small"
                type="primary"
                @click="handlePublish(scope.row.id)"
            >
              发布
            </el-button>
            <el-popconfirm
                v-if="scope.row.publishStatus===1"
                @confirm="handleUnPublish(scope.row.id)"
                class="box-item"
                title="确认要撤回吗？"
                placement="bottom-start"
            >
              <template #reference>
                <el-button
                    size="small"
                    type="danger"
                >
                  撤回
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-button v-show="batchBtnShowStatus" color="#626aef" style="margin-right: 40px"
                   @click="batchPublishCourse">批量发布
        </el-button>
        <el-pagination background layout="prev, pager, next"
                       :page-count="pageCount"
                       @change="sizeChanged"/>
      </div>
    </el-card>
  </div>
  <el-drawer v-loading="loading" v-model="visibleCreate" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">新增发布课程</h4>
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
        :model="ruleFormCreateView"
        label-width="auto"
    >
      <el-form-item label="courseName" prop="courseName">
        <el-tooltip
            :disabled="disabled"
            content="禁止随意编写课程名，此字段根据课程管理动态关联请点击右侧按钮选择课程"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormCreateView.courseName" disabled>
            <template #append>
              <el-select v-model="ruleFormCreateView.courseName" :placeholder="null" style="width: 150px">
                <template #header>
                  <el-input @keydown.enter="searchTableDataCourse" placeholder="请输入课程的关键词回车确认"
                            v-model="selectCourse" style="width: 300px"/>
                </template>
                <el-option v-for="item in tableDataCurriculum" :key="item.id" :label="item.name"
                           :value="item.name" @click="getCourse(item.id)" :disabled="!item.isExistence"/>
                <template #footer>
                  <el-pagination style="float: right;margin-bottom: 5px" background layout="prev, pager, next"
                                 :page-count="pageCountSelected"
                                 @change="sizeChangedSelect"/>
                </template>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-show="incrementItemShowStatus" label="courseId" prop="courseId">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据课程管理动态关联,选择课程名后该字段自动生成"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormCreateView.courseId" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseType" prop="courseType">
        <el-segmented style="width: 100%" v-model="ruleFormCreateView.courseType" :options="locationOptionsCourseType"/>
      </el-form-item>
      <el-form-item v-show="incrementItemShowStatus" label="courseCredits" prop="courseCredits">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据课程管理动态关联,选择课程名后该字段自动生成"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormCreateView.courseCredits" :precision="1" :step="0.5" size="large"
                           style="width: 100%" disabled>
            <template #suffix>
              <span>学分</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-show="incrementItemShowStatus" label="courseCreditHour" prop="courseCreditHour">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据课程管理动态关联,选择课程名后该字段自动生成"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormCreateView.courseCreditHour" size="large" style="width: 100%" disabled>
            <template #suffix>
              <span>学时</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-show="incrementItemShowStatus" label="courseLocation" prop="courseLocation">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据课程管理动态关联,选择课程名后该字段自动生成"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormCreateView.courseLocation" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="teacher" prop="teacherId">
        <el-tooltip
            :disabled="disabled"
            content="禁止随意编写教师名，此字段根据教师管理动态关联请点击右侧按钮选择任课教师"
            placement="bottom"
            effect="light">
          <el-input v-model="ruleFormCreateView.teacherId" disabled>
            <template #append>
              <el-select v-model="ruleFormCreateView.teacherId" :placeholder="null" style="width: 150px">
                <template #header>
                  <el-input @keydown.enter="selectTeacherData" placeholder="请输入教师名的关键词回车确认"
                            v-model="selectTeacher" style="width: 300px"/>
                </template>
                <el-option v-for="item in tableDataTeacher" :key="item.id" :label="item.teacherName"
                           :value="item.teacherName"/>
                <template #footer>
                  <el-pagination style="float: right;margin-bottom: 5px" background layout="prev, pager, next"
                                 :page-count="pageCountSelectedTeacher"
                                 @change="sizeChangedSelectTeacher"/>
                </template>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-show="incrementItemShowStatus" label="courseCapacity" prop="courseCapacity">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据课程管理动态关联,选择课程名后该字段自动生成"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormCreateView.courseCapacity" size="large" style="width: 100%" disabled>
            <template #suffix>
              <span>容量</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="publishStatus" prop="publishStatus">
        <el-segmented style="width: 100%" v-model="ruleFormCreateView.publishStatus"
                      :options="locationOptionsPublishStatus"/>
      </el-form-item>
      <el-form-item label="courseGrade" prop="courseGrade">
        <el-segmented style="width: 100%" v-model="ruleFormCreateView.courseGrade" :options="locationOptionsGrade"/>
      </el-form-item>
      <el-form-item label="college" prop="college">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据学院管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的学院"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormCreateView.courseCollege" disabled>
            <template #append>
              <el-select v-model="ruleFormCreateView.courseCollege" :placeholder="null" style="width: 150px">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitFormCreate(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-loading="loading" v-model="visibleEdit" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">新增发布课程</h4>
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
        :model="ruleFormEditView"
        label-width="auto"
    >
      <el-form-item label="courseName" prop="courseName">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormEditView.courseName" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseId" prop="courseId">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormEditView.courseId" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseType" prop="courseType">
        <el-segmented style="width: 100%" v-model="ruleFormEditView.courseType" :options="locationOptionsCourseType"/>
      </el-form-item>
      <el-form-item label="courseCredits" prop="courseCredits">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormEditView.courseCredits" :precision="1" :step="0.5" size="large"
                           style="width: 100%" disabled>
            <template #suffix>
              <span>学分</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseCreditHour" prop="courseCreditHour">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormEditView.courseCreditHour" size="large" style="width: 100%" disabled>
            <template #suffix>
              <span>学时</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseLocation" prop="courseLocation">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormEditView.courseLocation" disabled/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="teacher" prop="teacherId">
        <el-tooltip
            :disabled="disabled"
            content="禁止随意编写教师名，此字段根据教师管理动态关联请点击右侧按钮选择任课教师"
            placement="bottom"
            effect="light">
          <el-input v-model="ruleFormEditView.teacherId" disabled>
            <template #append>
              <el-select v-model="ruleFormEditView.teacherId" :placeholder="null" style="width: 150px">
                <template #header>
                  <el-input @keydown.enter="selectTeacherData" placeholder="请输入教师名的关键词回车确认"
                            v-model="selectTeacher" style="width: 300px"/>
                </template>
                <el-option v-for="item in tableDataTeacher" :key="item.id" :label="item.teacherName"
                           :value="item.teacherName"/>
                <template #footer>
                  <el-pagination style="float: right;margin-bottom: 5px" background layout="prev, pager, next"
                                 :page-count="pageCountSelectedTeacher"
                                 @change="sizeChangedSelectTeacher"/>
                </template>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="courseCapacity" prop="courseCapacity">
        <el-tooltip
            :disabled="disabled"
            content="代发布的课程只能修改任课教师，授课学院以及课程类型"
            placement="bottom"
            effect="light"
        >
          <el-input-number v-model="ruleFormEditView.courseCapacity" size="large" style="width: 100%" disabled>
            <template #suffix>
              <span>容量</span>
            </template>
          </el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="publishStatus" prop="publishStatus">
        <el-segmented style="width: 100%" v-model="ruleFormEditView.publishStatus"
                      :options="locationOptionsPublishStatus"/>
      </el-form-item>
      <el-form-item label="courseGrade" prop="courseGrade">
        <el-segmented style="width: 100%" v-model="ruleFormEditView.courseGrade" :options="locationOptionsGrade"/>
      </el-form-item>
      <el-form-item label="college" prop="college">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据学院管理动态关联不可手动修改，请点击右侧的选择按钮选择存在的学院"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleFormEditView.courseCollege" disabled>
            <template #append>
              <el-select v-model="ruleFormEditView.courseCollege" :placeholder="null" style="width: 150px">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" round plain @click="submitFormUpdate(ruleFormRef)">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-dialog v-model="publishDialog" title="发布课程" width="650" center>
    <el-date-picker
        size="large"
        style="width: 100%;"
        v-model="publishTimer"
        type="datetimerange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="publishDialog = false">取消</el-button>
        <el-button type="primary" @click="publish">
          发布
        </el-button>
      </div>
    </template>
  </el-dialog>
  <SpeedDial @click="incrementCourse" direction="right" :style="{ position: 'absolute', right: 10, bottom: 400 }"
             :buttonProps="{ severity: 'warn', rounded: true }"/>
</template>

<style scoped lang="less">
.publish-course-container {
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