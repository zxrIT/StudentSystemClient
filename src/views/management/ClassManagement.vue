<script setup lang="ts">
import {Router, useRouter} from 'vue-router'
import {deleteClassNameService, getClassNamesService, updateClassNamesService} from "@/service/classService";
import {ElMessage, FormInstance} from 'element-plus'
import {IBaseResponse} from "@/typings/response/baseResponse";
import {IClass} from "@/typings/interface/class";
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";
import {ICollegeName} from "@/typings/interface/college";
import {getCollegeNamesService, updateCollegeService} from "@/service/collegeService";
import {watch} from "vue";
import {ITeacher} from "@/typings/interface/teacher";
import {getAllCounselorService, getAllTeacherService} from "@/service/teacherService";
import {useClassRules} from "@/rules/user/useClassRules";


const router: Router = useRouter();
const centerDialogVisible = ref<boolean>(false)
const college = ref<string>("")
const className = ref<string>("")
const reRender = ref<boolean>(false);
const classNames = reactive<Array<IClass>>([])
const classNamesFilter = reactive<Array<IClass>>([])
const collegeSelects = reactive<ICollegeName[]>([])
const onMountedCounselor = reactive<ITeacher[]>([])
const onMountedCounselorFilter = reactive<ITeacher[]>([])
const onMountedTeacher = reactive<ITeacher[]>([])
const onMountedTeacherFilter = reactive<ITeacher[]>([])
const selectTeacher = ref<string>("")
const selectCounselor = ref<string>("")
const disabled = ref<boolean>(false)
const ruleForm = reactive<IClass>({
  classId: "",
  className: "",
  studentCount: 0,
  college: "",
  counselor: "",
  headTeacher: ""
})
const ruleFormRef = ref<FormInstance>()

watch(selectCounselor, () => {
  if (selectCounselor.value.length === 0) {
    onMountedCounselorFilter.splice(0, onMountedCounselorFilter.length, ...(onMountedCounselor.filter(() => true)))
    return;
  }
  onMountedCounselorFilter.splice(0, onMountedCounselorFilter.length, ...(onMountedCounselor.filter((teacher: ITeacher) =>
      teacher.teacherName.includes(selectCounselor.value))))
})

watch(selectTeacher, () => {
  if (selectTeacher.value.length === 0) {
    onMountedTeacherFilter.splice(0, onMountedTeacherFilter.length, ...(onMountedTeacher.filter(() => true)))
    return;
  }
  onMountedTeacherFilter.splice(0, onMountedTeacherFilter.length, ...(onMountedTeacher.filter((teacher: ITeacher) =>
      teacher.teacherName.includes(selectTeacher.value))))
})

watchEffect(async () => {
  const collegeResponse = await getCollegeNamesService<IBaseResponse<ICollegeName[]>>()
  if (collegeResponse.code === 200) {
    collegeSelects.splice(0, collegeSelects.length, ...collegeResponse.data)
  }
})

watch(reRender, async () => {
  const classResponse = await getClassNamesService<IBaseResponse<IClass[]>>();
  if (classResponse.code === 200) {
    classNames.splice(0, classNames.length, ...classResponse.data)
    classNamesFilter.splice(0, classNamesFilter.length, ...classResponse.data)
  }
}, {immediate: true})

watch([college, className], () => {
  if (college.value.length === 0 && className.value.length === 0) {
    classNamesFilter.splice(0, classNamesFilter.length, ...(classNames.filter(() => true)))
    return;
  }
  classNamesFilter.splice(0, classNamesFilter.length,
      ...(classNames.filter((value: IClass) => {
        if (className.value.length === 0) {
          return value.college === college.value
        }
        if (college.value.length === 0) {
          return value.className.includes(className.value)
        }
        return value.college === college.value && value.className.includes(className.value)
      })))
})

const reset = () => {
  college.value = ''
  className.value = ''
}

const updateClassName = async (classNameParam: IClass) => {
  centerDialogVisible.value = true
  ruleForm.classId = classNameParam.classId
  ruleForm.className = classNameParam.className
  ruleForm.studentCount = classNameParam.studentCount
  ruleForm.college = classNameParam.college
  ruleForm.counselor = classNameParam.counselor
  ruleForm.headTeacher = classNameParam.headTeacher
}

const deleteClassName = async (classId: string) => {
  const classResponse = await deleteClassNameService<IBaseResponse<string>>(classId)
  if (classResponse.code === 200) {
    reRender.value = !reRender.value;
    ElMessage.success(classResponse.data)
  } else {
    ElMessage.error(classResponse.data)
  }
}

const navigateToClassDetails = (className: IClass) => {
  router.push({
    path: SYSTEM_LEFT_NAV.CLASS_DETAILS,
    query: {classObject: JSON.stringify(className)}
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, _) => {
        if (valid) {
          const classNameResponse = await updateClassNamesService<IBaseResponse<string>>(ruleForm)
          if (classNameResponse.code === 200) {
            reRender.value = !reRender.value;
            centerDialogVisible.value = false
            ElMessage.success(classNameResponse.data)
          } else {
            ElMessage.error(classNameResponse.data)
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

onMounted(async () => {
  const teacherResponse = await getAllTeacherService<IBaseResponse<ITeacher[]>>()
  const counselorResponse = await getAllCounselorService<IBaseResponse<ITeacher[]>>()
  if (teacherResponse.code === 200 && counselorResponse.code === 200) {
    onMountedCounselor.splice(0, onMountedCounselor.length, ...counselorResponse.data)
    onMountedCounselorFilter.splice(0, onMountedCounselorFilter.length, ...counselorResponse.data)
    onMountedTeacher.splice(0, onMountedTeacher.length, ...teacherResponse.data)
    onMountedTeacherFilter.splice(0, onMountedTeacherFilter.length, ...teacherResponse.data)
  } else {
    ElMessage.error("获取教师数据错误，请联系管理员解决")
  }
})
</script>

<template>
  <div class="class-management-container">
    <el-card class="card-container">
      <div class="select-container">
        <el-card class="select-card-container">
          <el-row :gutter="40">
            <el-col :span="2">
              <el-icon size="30">
                <IEpSearch/>
              </el-icon>
            </el-col>
            <el-col :span="4">
              <el-button @click="reset">重置</el-button>
            </el-col>
            <el-col :span="9">
              <el-select v-model="college" placeholder="请选择学院" style="width: 200px;">
                <el-option v-for="item in collegeSelects" :key="item.id" :label="item.collegeName"
                           :value="item.collegeName"/>
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-input v-model="className" placeholder="请输入班级关键词"/>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div v-for="item in classNamesFilter" :key="item.classId" class="flex-item">
        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-tag type="warning">{{ item.college }}</el-tag>
              <el-popconfirm
                  @confirm="deleteClassName(item.classId)"
                  class="box-item"
                  title="确认要删除该班级吗？"
                  placement="bottom-start"
              >
                <template #reference>
                  <el-button style="float: right" type="danger" size="small" plain>删除</el-button>
                </template>
              </el-popconfirm>
              <el-button @click="updateClassName(item)" style="float: right;margin-right: 10px" type="primary"
                         size="small" plain>修改
              </el-button>
            </div>
          </template>
          <div>
            <div>
              班级名称
              <el-tag size="large" type="primary" class="left-distance">{{ item.className }}</el-tag>
            </div>
            <div>
              班级辅导员
              <el-tag size="large" type="primary" class="left-distance">{{ item.counselor }}</el-tag>
            </div>
            <div>
              班主任
              <el-tag size="large" type="primary" class="left-distance">{{ item.headTeacher }}</el-tag>
            </div>
            <div>
              班级人数
              <el-tag size="large" type="primary" class="left-distance">{{ item.studentCount }}</el-tag>
            </div>
          </div>
          <template #footer>
            <a href="javascript:void(0)" @click="navigateToClassDetails(item)">
              <div style="float: right;text-align: center;display: flex;
              align-items: center;gap: 4px">
                查看详情
                <el-icon>
                  <IEpDArrowRight/>
                </el-icon>
              </div>
            </a>
          </template>
        </el-card>
      </div>
    </el-card>
  </div>
  <el-dialog v-model="centerDialogVisible" title="修改班级数据" width="650" center>
    <el-form
        :rules="useClassRules"
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        label-width="auto"
    >
      <el-form-item label="className" prop="className">
        <el-input v-model="ruleForm.className"/>
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
              <el-select v-model="ruleForm.college" placeholder="Select" style="width: 200px">
                <el-option v-for="item in collegeSelects"
                           :key="item.id"
                           :label="item.collegeName" :value="item.collegeName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="counselor" prop="counselor">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据教师管理动态关联不可手动修改，请点击右侧的选择按钮选择辅导员"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleForm.counselor" disabled>
            <template #append>
              <el-select v-model="ruleForm.counselor" placeholder="Select" style="width: 200px">
                <template #header>
                  <el-input placeholder="请输入教师名字的关键词" v-model="selectCounselor"/>
                </template>
                <el-option v-for="item in onMountedCounselorFilter" :key="item.id" :label="item.teacherName"
                           :value="item.teacherName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="headTeacher" prop="headTeacher">
        <el-tooltip
            :disabled="disabled"
            content="此字段根据教师管理动态关联不可手动修改，请点击右侧的选择按钮选择教师"
            placement="bottom"
            effect="light"
        >
          <el-input v-model="ruleForm.headTeacher" disabled>
            <template #append>
              <el-select v-model="ruleForm.headTeacher" placeholder="Select" style="width: 200px">
                <template #header>
                  <el-input placeholder="请输入教师名字的关键词" v-model="selectTeacher"/>
                </template>
                <el-option v-for="item in onMountedTeacherFilter" :key="item.id" :label="item.teacherName"
                           :value="item.teacherName"/>
              </el-select>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-tooltip
          :disabled="disabled"
          content="此字段根据学生管理动态关联不可手动修改，如有问题请联系管理员处理"
          placement="bottom"
          effect="light"
      >
        <el-form-item label="studentCount" prop="studentCount">
          <el-input v-model="ruleForm.studentCount" disabled/>
        </el-form-item>
      </el-tooltip>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">

.class-management-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 660px;
    overflow: auto;

    .select-container {
      width: 100%;
      height: 70px;

      .select-card-container {
        width: 100%;
        height: 100%;
      }
    }

    :deep(.el-card__body) {
      height: 100%;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .flex-item {
      width: calc((100% - 20px) / 3);
      height: 300px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .card-item {
        width: 100%;
        height: 95%;
        display: flex;
        flex-direction: column;

        :deep(.el-card__body) {
          flex: 1;
          overflow: auto;
        }

        :deep(.el-card__footer) {
          padding: 10px 20px;
        }
      }
    }
  }
}

.left-distance {
  margin-left: 20px;
}
</style>