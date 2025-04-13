import { defineStore } from 'pinia'
import { patientLogin, patientRegister } from '@/api/login.js'

export const usePatientDiagnosisStore = defineStore('patientDiagnosis', {
  state: () => ({
    patientData: null
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await patientLogin(username, password)
        if (response.data.code === 1) {
          this.patientData = {
            userId: response.data.data.userId,
            username: response.data.data.username,
            token: response.data.data.token
          }
          sessionStorage.setItem('patientData', JSON.stringify(this.patientData))
          return response
        } else {
          throw new Error(response.data.msg || '登录失败')
        }
      } catch (error) {
        throw new Error(error.message || '登录失败')
      }
    },
    async register(username, password) {
      try {
        const response = await patientRegister(username, password)
        if (response.data.code === 1) {
          return 1
        } else {
          throw new Error(response.data.msg || '注册失败')
        }
      } catch (error) {
        throw new Error(error.message || '注册失败')
      }
    },
    getPatientData() {
      if (!this.patientData) {
        const storedData = sessionStorage.getItem('patientData')
        if (storedData) {
          this.patientData = JSON.parse(storedData)
        }
      }
      return this.patientData
    },
    setPatientData(username) {
      if (this.patientData) {
        this.patientData.username = username
        sessionStorage.setItem('patientData', JSON.stringify(this.patientData))
      }
    },
  }
})