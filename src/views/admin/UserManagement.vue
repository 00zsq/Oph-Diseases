<script setup>
import { ref, onMounted } from 'vue'
import { getFetchUsers, getFetchUserById, getFetchLogs, getFetchRoles, postUpdateUser } from '@/api/admin'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const users = ref([])
const currentPage = ref(1)
const totalUsers = ref(0)
const logsTotal = ref(0)  // 新增日志总数
const pageSize = ref(10)
const userId = ref('')
const userInfo = ref(null)
const logs = ref([])
const roles = ref([])
const showUserDialog = ref(false)
const showUpdateDialog = ref(false)
const selectedUser = ref({})
const loading = ref(false)
const logParams = ref({  // 日志查询参数
  userId: '',
  methodName: '',
  page: 1,
  operateBeginTime: '2001-01-01',
  operateEndTime: ''
})

const fetchUsers = async (page = 1) => {
  try {
    loading.value = true
    const response = await getFetchUsers(page, pageSize.value, userData.token)
    users.value = response.data.data.records
    totalUsers.value = response.data.data.total
  } catch (error) {
    // console.error('获取用户列表错误:', error)
    ElMessage({
      message: '获取用户列表错误' + error.response?.data?.msg,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const fetchUserById = async () => {
  if (!userId.value) return
  try {
    const response = await getFetchUserById(userId.value, userData.token)
    userInfo.value = response.data.data
    showUserDialog.value = true
  } catch (error) {
    // console.error('获取用户信息错误:', error)
    ElMessage({
      message: '获取用户信息错误' + error.response?.data?.msg,
      type: 'error',
    })
  }
}

const fetchLogs = async (page = 1) => {
  try {
    const params = {
      ...logParams.value,
      page,
      pageSize: pageSize.value
    }
    
    const response = await getFetchLogs(params, userData.token)
    logs.value = response.data.data.records
    logsTotal.value = response.data.data.total
  } catch (error) {
    // console.error('获取AOP日志错误:', error)
    ElMessage({
      message: '获取AOP日志错误' + error.response?.data?.msg,
      type: 'error',
    })
  }
}

const fetchRoles = async () => {
  try {
    const response = await getFetchRoles(userData.token)
    roles.value = response.data.data
  } catch (error) {
    // console.error('获取角色列表错误:', error)
    ElMessage({
      message: '获取角色列表错误' + error.response?.data?.msg,
      type: 'error',
    })
  }
}

const updateUser = async () => {
  try {
    const response = await postUpdateUser(selectedUser.value, userData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '用户信息更新成功',
        type: 'success',
      })
      fetchUsers(currentPage.value)
      showUpdateDialog.value = false
    } else {
      ElMessage({
        message: '更新失败: ' + response.data.msg,
        type: 'warning',
      })
    }
  } catch (error) {
    // console.error('更新用户信息错误:', error)
    ElMessage({
      message: '更新用户信息错误' + error.response?.data?.msg,
      type: 'error',
    })
  }
}

const handleUpdateUser = (user) => {
  selectedUser.value = { ...user }
  showUpdateDialog.value = true
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
  fetchLogs()
})
</script>

<template>
  <div class="container">
    <!-- 用户管理模块 -->
    <el-card class="box-card">
      <div class="header">
        <h2>用户管理</h2>
        <div class="search-box">
          <el-input 
            v-model="userId" 
            placeholder="输入用户ID" 
            style="width: 200px; margin-right: 10px;"
            clearable
          />
          <el-button type="primary" @click="fetchUserById">查询用户</el-button>
        </div>
      </div>

      <el-table 
        :data="users" 
        v-loading="loading"
        style="width: 100%"
        height="400"
      >
        <el-table-column prop="id" label="用户ID" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="handleUpdateUser(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="totalUsers"
        :page-size="pageSize"
        @current-change="fetchUsers"
      />
    </el-card>

    <!-- 用户信息弹窗 -->
    <el-dialog v-model="showUserDialog" title="用户详情" width="30%">
      <div v-if="userInfo" class="user-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ userInfo.role }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
              {{ userInfo.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ dayjs(userInfo.createTime).format('YYYY-MM-DD HH:mm') }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showUserDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog v-model="showUpdateDialog" title="修改用户" width="40%">
      <el-form :model="selectedUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="selectedUser.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="selectedUser.email" type="email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectedUser.role" placeholder="请选择角色">
            <el-option 
              v-for="role in roles" 
              :key="role" 
              :label="role" 
              :value="role" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdateDialog = false">取消</el-button>
        <el-button type="primary" @click="updateUser">保存</el-button>
      </template>
    </el-dialog>

    <!-- 日志查询模块 -->
    <el-card class="box-card log-section">
      <div class="header">
        <h2>操作日志</h2>
        <div class="search-box">
          <el-input
            v-model="logParams.userId"
            placeholder="用户ID"
            style="width: 120px; margin-right: 10px;"
            clearable
          />
          <el-input
            v-model="logParams.methodName"
            placeholder="方法名称"
            style="width: 180px; margin-right: 10px;"
            clearable
          />
          <el-button type="primary" @click="fetchLogs(1)">查询</el-button>
        </div>
      </div>

      <el-table :data="logs" height="300">
        <el-table-column prop="operateTime" label="操作时间" width="180">
          <template #default="{row}">
            {{ dayjs(row.operateTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column prop="className" label="类名" width="180" />
        <el-table-column prop="methodName" label="方法名" width="180" />
        <el-table-column prop="methodParams" label="参数" show-overflow-tooltip />
        <el-table-column prop="costTime" label="耗时(ms)" width="100" />
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="logsTotal"
        :page-size="pageSize"
        @current-change="fetchLogs"
      />
    </el-card>

    <!-- 角色列表 -->
    <el-card class="box-card">
      <h2>角色列表</h2>
      <div class="role-list">
        <el-tag
          v-for="role in roles"
          :key="role"
          type="info"
          effect="dark"
          class="role-tag"
        >
          {{ role }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.box-card {
  margin-bottom: 20px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
}

.log-section {
  margin-top: 30px;
}

.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.role-tag {
  font-size: 14px;
  padding: 8px 15px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

.user-info {
  :deep(.el-descriptions__body) {
    background: #f8f9fa;
  }
}
</style>