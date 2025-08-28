import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import lazyLoad from './components/lazyLoad'
// 解决组件样式问题
import 'element-plus/es/components/message/style/css'
import { initPerformanceMonitor } from './utils/performance'

import App from './App.vue'
import router from './router'

// 启动性能监控
initPerformanceMonitor().then((metrics) => {
  console.table({
    'First Contentful Paint (FCP)': `${Math.round(metrics.fcp)}ms`,
    'Largest Contentful Paint (LCP)': `${Math.round(metrics.lcp)}ms`,
    'Cumulative Layout Shift (CLS)': metrics.cls.toFixed(3),
    总加载时间: `${Math.round(metrics.totalLoadTime)}ms`,
  })
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'middle', zIndex: 3000 })
app.directive('lazy', lazyLoad)

app.mount('#app')
