<script setup>
import { ref, onMounted } from 'vue'
import { getFetchFeedbacks } from '@/api/admin'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'

const userStore = useUserStore()
const userData = userStore.getUserData()

const feedbacks = ref([])
const currentPage = ref(1)
const totalFeedbacks = ref(0)
const pageSize = ref(10)
const loading = ref(false) // Loading state

const fetchFeedbacks = async (page = 1) => {
  loading.value = true
  try {
    const response = await getFetchFeedbacks(page, pageSize.value, userData.token)
    feedbacks.value = response.data.data.records
    totalFeedbacks.value = response.data.data.total
  } catch {
    // console.error('获取反馈列表错误:', error)
  } finally {
    loading.value = false
  }
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchFeedbacks(currentPage.value)
  }
}

const handleNextPage = () => {
  if (currentPage.value * pageSize.value < totalFeedbacks.value) {
    currentPage.value++
    fetchFeedbacks(currentPage.value)
  }
}

onMounted(() => {
  fetchFeedbacks(currentPage.value)
})
</script>

<template>
  <div>
    <h2>用户反馈管理</h2>
    <el-table :data="feedbacks" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="反馈ID" width="180"></el-table-column>
      <el-table-column prop="content" label="反馈内容"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-button @click="handlePrevPage" :disabled="currentPage === 1">上一页</el-button>
      <span>第 {{ currentPage }} 页</span>
      <el-button @click="handleNextPage" :disabled="currentPage * pageSize >= totalFeedbacks">下一页</el-button>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination span {
  margin: 0 10px;
}
</style>