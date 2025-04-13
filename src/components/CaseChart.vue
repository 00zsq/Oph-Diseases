<script setup>
import { ref, onMounted, watch } from 'vue'
import { useImageStore } from '@/stores/imageStore'
import * as echarts from 'echarts'

const store = useImageStore()
const chartRef = ref(null)

const calculateProportions = (cases, total) => {
  return cases.map(c => (c.count / total).toFixed(2))
}

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  const totalDiseases = store.cases.reduce((sum, c) => sum + c.count, 0)
  const option = {
    title: {
      text: '病例比例数目'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const percentage = ((params[0].value) * 100).toFixed(2)
        return `${params[0].name}: ${params[0].value} (${percentage}%)`
      }
    },
    xAxis: {
      type: 'category',
      data: store.cases.map(c => c.disease)
    },
    yAxis: {
      type: 'value',
      max: 1,
      min: 0
    },
    series: [
      {
        data: calculateProportions(store.cases, totalDiseases),
        type: 'bar'
      }
    ]
  }
  chart.setOption(option)

  watch(store.cases, (newCases) => {
    const totalDiseases = newCases.reduce((sum, c) => sum + c.count, 0)
    chart.setOption({
      xAxis: {
        data: newCases.map(c => c.disease)
      },
      series: [
        {
          data: calculateProportions(newCases, totalDiseases)
        }
      ]
    })
  })
})
</script>

<template>
  <div class="case-chart">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<style scoped>
.case-chart {
  padding: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>