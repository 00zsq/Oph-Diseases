import { defineStore } from 'pinia'
import { userLogin, userRegister } from '@/api/login.js'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userId: null,
    username: '',
    role: '',
    email: '',
    token: '',
    recordId: null,
    patientId: null
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await userLogin(username, password)

        if (response.data.code === 1) {
          this.userId = response.data.data.userId
          this.username = response.data.data.username
          this.token = response.data.data.token
          this.email = response.data.data.email
          this.role = response.data.data.role
          return response
        } else {
          throw new Error(response.data.msg || '登录失败')
        }
      } catch (error) {
        console.error('登录失败', error)
        throw error
      }
    },
    async register(username, password, role, email) {
      try {
        const response = await userRegister(username, password, role, email)

        if (response.data.code === 1) {
          this.username = username
          this.role = role
          this.email = email
          this.token = response.data.data.token
          this.userId = response.data.data.userId
          return response
        } else {
          throw new Error(response.data.msg || '注册失败')
        }
      } catch (error) {
        console.error('注册失败', error)
        throw error
      }
    },
    getUserData() {
      const userData = JSON.parse(sessionStorage.getItem('userData'))
      if (userData) {
        this.userId = userData.userId
        this.username = userData.username
        this.token = userData.token
        this.email = userData.email
        this.role = userData.role
      }
      return userData
    },
    clearUserData() {
      this.userId = null
      this.username = ''
      this.token = ''
      this.email = ''
      this.role = ''
      sessionStorage.removeItem('userData')
    }
  }
})