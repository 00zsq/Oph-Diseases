import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patientStore', {
  state: () => ({
    patients: []
  }),
  actions: {
    // 添加新患者
    addPatient(patient) {
      this.patients.push(patient)
    },
    updatePatient(patientId, recordId) {
      // 如果有这个患者了，就更新他的recordId
      const patient = this.patients.find(p => p.patientId === patientId)
      if (patient) {
        patient.recordId = recordId
      }
    },

    // 根据身份证号查找患者
    findPatientByIdCard(idCard) {
      return this.patients.find(p => p.idCard === idCard)
    },
    clearPatients() {
      this.patients = []
    }
  }
})