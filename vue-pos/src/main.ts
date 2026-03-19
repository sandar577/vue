import { Toaster } from '@meforma/vue-toaster'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import VueApexCharts from 'vue3-apexcharts'
import './style.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(VueApexCharts)
app.use(Toaster)

app.mount('#app')
