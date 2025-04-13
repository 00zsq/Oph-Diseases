<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { getFetchDiagnosisRecords } from '@/api/userDiagnosisInfo'

const userStore = useUserStore()
const userData = userStore.getUserData()

const diagnosisRecords = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const loading = ref(false)

const fetchDiagnosisRecords = async (page = 1) => {
  loading.value = true
  try {
    const response = await getFetchDiagnosisRecords(page, pageSize.value, userData.token)
    diagnosisRecords.value = response.data.data.records
    totalRecords.value = response.data.data.total
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchDiagnosisRecords(page)
}

onMounted(() => {
  fetchDiagnosisRecords()
})
</script>

<template>
  <div class="diagnosis-list-container">
    <h2 class="list-title">诊断记录</h2>
    
    <el-table 
      :data="diagnosisRecords" 
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column prop="id" label="记录ID" width="120" align="center"></el-table-column>
      <el-table-column prop="imageId" label="图像ID" width="150" align="center"></el-table-column>
      <el-table-column prop="patientId" label="患者ID" width="150" align="center"></el-table-column>
      <el-table-column prop="diagnosisTime" label="诊断时间" width="180" align="center"></el-table-column>
      
      <!-- 修改后的诊断结果列 -->
      <el-table-column label="诊断结果" min-width="360" align="center">
        <template #default="{ row }">
          <div class="eye-results">
            <!-- 左眼诊断结果盒 -->
            <div class="eye-block left-eye">
              <div class="eye-title">左眼</div>
              <div class="disease-list">
                <template v-if="JSON.parse(row.leftDiseaseResults).length">
                  <span 
                    v-for="(disease, index) in JSON.parse(row.leftDiseaseResults)" 
                    :key="'left-' + index" 
                    class="disease-text">
                    {{ disease }}
                  </span>
                </template>
                <template v-else>
                  <span class="no-data">无异常</span>
                </template>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="divider"></div>

            <!-- 右眼诊断结果盒 -->
            <div class="eye-block right-eye">
              <div class="eye-title">右眼</div>
              <div class="disease-list">
                <template v-if="JSON.parse(row.rightDiseaseResults).length">
                  <span 
                    v-for="(disease, index) in JSON.parse(row.rightDiseaseResults)" 
                    :key="'right-' + index" 
                    class="disease-text">
                    {{ disease }}
                  </span>
                </template>
                <template v-else>
                  <span class="no-data">无异常</span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination-wrapper"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalRecords"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
/* 盒模型及整体容器 */
.diagnosis-list-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.list-title {
  color: #303133;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

/* 诊断结果区域 */
.eye-results {
  display: flex;
  align-items: stretch;
  padding: 8px;
}

/* 每个眼睛盒子：减少内边距 */
.eye-block {
  flex: 1;
  padding: 4px 8px;
  position: relative;
}

/* 左右眼左侧装饰性边条 */
.left-eye {
  border-left: 5px solid #409eff;  /* 左眼蓝色边条 */
  border-radius: 4px;
}
.right-eye {
  border-left: 5px solid #67c23a;    /* 右眼绿色边条 */
  border-radius: 4px;
}

/* 标题调整为靠左，并适当增大字体 */
.eye-title {
  color: #4c80e7;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
  text-align: left;
}

/* 诊断结果列表 */
.disease-list {
  min-height: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

/* 诊断结果文字样式：字体稍大 */
.disease-text {
  font-size: 14px;
  line-height: 1.5;
  padding: 4px 8px;
  border-radius: 4px;
  /* 不再添加背景颜色 */
  background-color: #d6d5d569;
}

.no-data {
  color: #c0c4cc;
  font-size: 12px;
  font-style: italic;
}

/* 分隔线 */
.divider {
  width: 1px;
  background: #ebeef5;
  margin: 0 8px;
  height: 100%;
}

/* 分页区域 */
.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}
</style>