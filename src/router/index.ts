import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import StudentManagement from '@/views/management/StudentManagement.vue';
import {SYSTEM_LEFT_NAV} from "@/typings/enum/systemEnum";

const routes: Array<RouteRecordRaw> = [
    {
        path: SYSTEM_LEFT_NAV.HOME,
        name: "home",
        component: HomeView,
        redirect: "/home/student",
        children: [
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
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router