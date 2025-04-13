import { createRouter, createWebHistory } from 'vue-router'
// 登录
import LoginPage from '@/views/login/loginPage.vue'
// 游客
import VisitorPage from '@/views/visitor/visitorPage.vue'
// 管理员
import UserManagement from '@/views/admin/UserManagement.vue'
import FeedbackManagement from '@/views/admin/FeedbackManagement.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
// 用户
import HeadPage from '../views/user/headPage.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import AiAssistant from '@/views/user/AiAssistant.vue'
import UserDiagnosis from '@/views/user/userDiagnosis.vue'
import DiagnosisReport from '@/views/user/DiagnosisReport.vue'
import HomePage from '@/views/user/HomePage.vue'
import DiseaseDiagnosis from '../views/user/DiseaseDiagnosis.vue'
import PatientInfo from '@/views/user/PatientInfo.vue'
import PatientList from '@/views/user/PatientList.vue'
import PatientRecords from '@/views/user/PatientRecords.vue'
import DiagnosisInfo from '@/views/user/DiagnosisInfo.vue'
import DiagnosisList from '@/views/user/DiagnosisList.vue'
import DiagnosisPatient from '@/views/user/DiagnosisPatient.vue'
import DiagnosisConfidence from '@/views/user/DiagnosisConfidence.vue'
import AppointmentManagement from '@/views/user/AppointmentManagement.vue'
// 患者
import PatientHome from '@/views/patient/PatientHome.vue'
import patientOwnInfo from '@/views/patient/PatientInfo.vue'
import PatientAppointment from '@/views/patient/PatientAppointment.vue'
import PatientOperate from '@/views/patient/PatientOperate.vue'
import PatientReport from '@/views/patient/PatientReport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/visitor',
      component: VisitorPage
    },
    {
      path: '/user',
      component: HeadPage,
      children: [
        {
          path: 'Home',
          component: HomePage
        },
        {
          path: 'info',
          component: UserInfo
        },
        {
          path: 'ai-assistant',
          component: AiAssistant
        },
        {
          path: 'diseaseDiagnosis',
          component: DiseaseDiagnosis,
          children: [
            {
              path: 'userDiagnosis',
              name: 'userDiagnosis',
              component: UserDiagnosis
            },
            {
              path: 'diagnosisReport',
              name: 'diagnosisReport',
              component: DiagnosisReport
            }
          ]
        },
        {
          path: 'patientInfo',
          component: PatientInfo,
          children: [
            {
              path: 'patientList',
              name: 'patientList',
              component: PatientList
            },
            {
              path: 'patientRecords',
              name: 'patientRecords',
              component: PatientRecords
            },
            {
              path: 'appointmentManagement',
              name: 'appointmentManagement',
              component: AppointmentManagement
            }
          ]
        },
        {
          path: 'diagnosisInfo',
          component: DiagnosisInfo,
          children: [
            {
              path: 'diagnosisList',
              name: 'diagnosisList',
              component: DiagnosisList
            },
            {
              path: 'diagnosisPatient',
              name: 'diagnosisPatient',
              component: DiagnosisPatient
            },
            {
              path: 'diagnosisConfidence',
              name: 'diagnosisConfidence',
              component: DiagnosisConfidence
            }
          ]
        }
      ]
    },
    {
      path: '/admin',
      component: AdminHome,
      children: [
        {
          path: 'user-management',
          component: UserManagement
        },
        {
          path: 'feedback-management',
          component: FeedbackManagement
        }
      ]
    },
    {
      path: '/patient',
      component: PatientHome,
      children: [
        {
          path: 'patientInfo',
          component: patientOwnInfo
        },
        {
          path: 'patientOperate',
          component: PatientOperate,
          // 为什么要写name
          children: [
            {
              path: 'patientAppointment',
              name: 'patientAppointment',
              component: PatientAppointment
            },
            {
              path: 'patientReport',
              name: 'patientReport',
              component: PatientReport
            }
          ]
        }
      ]
    }
  ]
})

export default router