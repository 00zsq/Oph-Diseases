import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import lazyLoad from './components/lazyLoad'
// 解决组件样式问题
import 'element-plus/es/components/message/style/css'
// import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'middle', zIndex: 3000 })
app.directive('lazy', lazyLoad)

app.mount('#app')