import { createRouter, createWebHistory } from 'vue-router'
// 使用懒加载动态导入组件
const LoginPage = () => import('@/views/login/loginPage.vue')
const VisitorPage = () => import('@/views/visitor/visitorPage.vue')

// 管理员
const AdminHome = () => import('@/views/admin/AdminHome.vue')
const UserManagement = () => import('@/views/admin/UserManagement.vue')
const FeedbackManagement = () => import('@/views/admin/FeedbackManagement.vue')

// 用户
const HeadPage = () => import('@/views/user/headPage.vue')
const HomePage = () => import('@/views/user/HomePage.vue')
const UserInfo = () => import('@/views/user/UserInfo.vue')
const AiAssistant = () => import('@/views/user/AiAssistant.vue')
const DiseaseDiagnosis = () => import('@/views/user/DiseaseDiagnosis.vue')
const UserDiagnosis = () => import('@/views/user/userDiagnosis.vue')
const DiagnosisReport = () => import('@/views/user/DiagnosisReport.vue')
const PatientInfo = () => import('@/views/user/PatientInfo.vue')
const PatientList = () => import('@/views/user/PatientList.vue')
const PatientRecords = () => import('@/views/user/PatientRecords.vue')
const AppointmentManagement = () => import('@/views/user/AppointmentManagement.vue')
const DiagnosisInfo = () => import('@/views/user/DiagnosisInfo.vue')
const DiagnosisList = () => import('@/views/user/DiagnosisList.vue')
const DiagnosisPatient = () => import('@/views/user/DiagnosisPatient.vue')
const DiagnosisConfidence = () => import('@/views/user/DiagnosisConfidence.vue')

// 患者
const PatientHome = () => import('@/views/patient/PatientHome.vue')
const patientOwnInfo = () => import('@/views/patient/PatientInfo.vue')
const PatientOperate = () => import('@/views/patient/PatientOperate.vue')
const PatientAppointment = () => import('@/views/patient/PatientAppointment.vue')
const PatientReport = () => import('@/views/patient/PatientReport.vue')

// 路由性能监控
let routeMetrics = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/visitor',
      component: VisitorPage,
    },
    {
      path: '/user',
      component: HeadPage,
      children: [
        {
          path: 'Home',
          component: HomePage,
        },
        {
          path: 'info',
          component: UserInfo,
        },
        {
          path: 'ai-assistant',
          component: AiAssistant,
        },
        {
          path: 'diseaseDiagnosis',
          component: DiseaseDiagnosis,
          children: [
            {
              path: 'userDiagnosis',
              name: 'userDiagnosis',
              component: UserDiagnosis,
            },
            {
              path: 'diagnosisReport',
              name: 'diagnosisReport',
              component: DiagnosisReport,
            },
          ],
        },
        {
          path: 'patientInfo',
          component: PatientInfo,
          children: [
            {
              path: 'patientList',
              name: 'patientList',
              component: PatientList,
            },
            {
              path: 'patientRecords',
              name: 'patientRecords',
              component: PatientRecords,
            },
            {
              path: 'appointmentManagement',
              name: 'appointmentManagement',
              component: AppointmentManagement,
            },
          ],
        },
        {
          path: 'diagnosisInfo',
          component: DiagnosisInfo,
          children: [
            {
              path: 'diagnosisList',
              name: 'diagnosisList',
              component: DiagnosisList,
            },
            {
              path: 'diagnosisPatient',
              name: 'diagnosisPatient',
              component: DiagnosisPatient,
            },
            {
              path: 'diagnosisConfidence',
              name: 'diagnosisConfidence',
              component: DiagnosisConfidence,
            },
          ],
        },
      ],
    },
    {
      path: '/admin',
      component: AdminHome,
      children: [
        {
          path: 'user-management',
          component: UserManagement,
        },
        {
          path: 'feedback-management',
          component: FeedbackManagement,
        },
      ],
    },
    {
      path: '/patient',
      component: PatientHome,
      children: [
        {
          path: 'patientInfo',
          component: patientOwnInfo,
        },
        {
          path: 'patientOperate',
          component: PatientOperate,
          // 为什么要写name
          children: [
            {
              path: 'patientAppointment',
              name: 'patientAppointment',
              component: PatientAppointment,
            },
            {
              path: 'patientReport',
              name: 'patientReport',
              component: PatientReport,
            },
          ],
        },
      ],
    },
  ],
})

if ('requestIdleCallback' in window) {
  requestIdleCallback(
    () => {
      HeadPage()
      AdminHome()
    },
    {
      timeout: 2000,
    },
  )
} else {
  // 如果浏览器不支持 requestIdleCallback，则使用 setTimeout 作为降级方案
  setTimeout(() => {
    HeadPage()
    AdminHome()
  }, 3000)
}

// 添加路由性能监控
router.beforeEach((to, from, next) => {
  window._routeStartTime = performance.now()
  next()
})

router.afterEach(() => {
  const routeTime = performance.now() - window._routeStartTime
  routeMetrics.push(routeTime)

  // 只保留最近10次切换的数据
  if (routeMetrics.length > 10) {
    routeMetrics.shift()
  }

  // 计算平均值
  const avgTime = routeMetrics.reduce((a, b) => a + b, 0) / routeMetrics.length

  console.log(`路由切换时间: ${Math.round(routeTime)}ms (平均: ${Math.round(avgTime)}ms)`)
})

export default router
