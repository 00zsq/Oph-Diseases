import { throttle } from 'echarts'

export default {
  mounted(el, binding) {
    if ('IntersectionObserver' in window) {
      const loadImage = () => {
        const observer = new IntersectionObserver((entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            el.src = binding.value // 设置图片的真实路径
            observer.unobserve(el)
          }
        })
        observer.observe(el)
      }

      // 如果图片已经加载过，直接设置 src
      if (el.src) {
        el.src = binding.value
      } else {
        el.src = ''
        loadImage()
      }
    } else {
      const checkVisible = () => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          el.src = binding.value
          window.removeEventListener('scroll', checkVisible)
        }
      }
      window.addEventListener('scroll', throttle(checkVisible, 200))
      checkVisible()
    }
  },
}
