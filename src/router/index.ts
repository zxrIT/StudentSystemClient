import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import StudentManagement from '@/views/management/StudentManagement.vue';
import MyInformationView from "@/views/services/MyInformationView.vue";
import LoginView from "@/views/LoginView.vue";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";
import {useLocalStorage} from "@/hooks/useLocalStorage"
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";
import {IUserInfo} from "@/typings/interface/base";
import {verificationTokenService} from "@/service/authenticationService";
import {IBaseResponse} from "@/typings/response/baseResponse";

const routes: Array<RouteRecordRaw> = [
    {
        path: SYSTEM_LEFT_NAV.HOME,
        name: "home",
        component: HomeView,
        redirect: SYSTEM_LEFT_NAV.INFORMATION,
        children: [
            {
                path: SYSTEM_LEFT_NAV.INFORMATION,
                name: "information",
                component: MyInformationView,
            },
            {
                path: SYSTEM_LEFT_NAV.MYCOURSES,
                name: "mycourse",
                component: () => import("@/views/services/MyCourse.vue")
            },
            {
                path: SYSTEM_LEFT_NAV.SELECTION,
                name: "selection",
                component: () => import("@/views/services/CourseSelectionView.vue")
            },
            {
                path: SYSTEM_LEFT_NAV.STUDENT,
                name: "student",
                component: StudentManagement,
            },
            {
                path: SYSTEM_LEFT_NAV.TEACHER,
                name: "teacher",
                component: () => import("@/views/management/TeacherManagement.vue")
            },
            {
                path: SYSTEM_LEFT_NAV.CURRICULUM,
                name: "curriculum",
                component: () => import("@/views/management/CurriculumManagement.vue")
            },
            {
                path: SYSTEM_LEFT_NAV.CLASS,
                name: "class",
                component: () => import("@/views/management/ClassManagement.vue"),
            },
            {
                path: SYSTEM_LEFT_NAV.CLASS_DETAILS,
                name: "details",
                component: () => import("@/views/management/ClassDetailsManagement.vue"),
            },
            {
                path: SYSTEM_LEFT_NAV.COLLEGE,
                name: "college",
                component: () => import("@/views/management/CollegeManagement.vue"),
            },
            {
                path: SYSTEM_LEFT_NAV.COURSE,
                name: "course",
                component: () => import("@/views/services/PublishCourseView.vue")
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    if (to.name === "login") {
        next()
    }
    const {getStorage, removeStorage} = useLocalStorage()
    const userInfoStore = useUserInfoStore();
    const user: IUserInfo = JSON.parse(getStorage("studentSystem-userInfo"))
    if (user === undefined || user === null) {
        ElMessage.error('您还没有登录或登录已过期，请重新登录后再使用')
        next("/login")
    }
    userInfoStore.changeUserInfo(user)
    const verificationTokenResponse = await verificationTokenService<IBaseResponse<boolean>>()
    if (verificationTokenResponse.code === 200) {
        if (verificationTokenResponse.data) {
            next()
        } else {
            ElMessage.error('您还没有登录或登录已过期，请重新登录后再使用')
            next("/login")
        }
    } else {
        ElMessage.error('您还没有登录或登录已过期，请重新登录后再使用')
        next("/login")
    }
})

export default router