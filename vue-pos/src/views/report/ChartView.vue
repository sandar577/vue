<script lang="ts" setup>
import { useOrderStore } from '@/stores/orderStore'
import { onMounted, ref } from 'vue'

const orderStore = useOrderStore()
const orderItemCountByCategoryChartOptions = ref({})
const orderItemCountByCategorySeries = ref<{ name: string; data: number[] }[]>([])

const topSellingItemsChartOptions = ref({})
const topSellingItemsSeries = ref<{ name: string; data: number[] }[]>([])

const saleOverTimeOptions = ref({})
const saleOverTimeSeries = ref<{ name: string; data: number[] }[]>([])
onMounted(() => {
  const orderItemCountByCategory = orderStore.getOrderItemsByCategory()
  orderItemCountByCategoryChartOptions.value = {
    chart: {
      id: 'order_by_category',
    },
    xaxis: {
      categories: Object.keys(orderItemCountByCategory),
    },
  }
  orderItemCountByCategorySeries.value = [
    {
      name: 'Order Item Count',
      data: Object.values(orderItemCountByCategory),
    },
  ]

  const top5BestSellingItems = orderStore.getTopSellingItems(5)
  console.log(top5BestSellingItems)
  topSellingItemsChartOptions.value = {
    chart: {
      id: 'order_by_category',
    },
    xaxis: {
      categories: Object.keys(top5BestSellingItems),
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: true,
      },
    },
  }
  topSellingItemsSeries.value = [
    {
      name: 'Order Item Count',
      data: Object.values(top5BestSellingItems),
    },
  ]
})
</script>
<template>
  <div class="p-4">
    <div class="charts px-3">
      <div>
        <h3 class="chart-title">Top 5 Best Selling Items</h3>
        <apexchart
          width="500"
          height="300"
          type="bar"
          :options="topSellingItemsChartOptions"
          :series="topSellingItemsSeries"
        ></apexchart>
      </div>
      <div>
        <h3 class="chart-title">Sales Over Time</h3>
        <apexchart
          width="500"
          height="300"
          type="bar"
          :options="orderItemCountByCategoryChartOptions"
          :series="orderItemCountByCategorySeries"
        ></apexchart>
      </div>
    </div>
    <div class="charts">
      <div>
        <h3 class="chart-title">Order Item By Category</h3>
        <apexchart
          width="500"
          height="300"
          type="bar"
          :options="orderItemCountByCategoryChartOptions"
          :series="orderItemCountByCategorySeries"
        ></apexchart>
      </div>
      <div>
        <h3 class="chart-title">Top 5 Best Selling Items</h3>
        <apexchart
          width="500"
          height="300"
          type="bar"
          :options="orderItemCountByCategoryChartOptions"
          :series="orderItemCountByCategorySeries"
        ></apexchart>
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference '@/style.css';
.charts {
  @apply grid grid-cols-1 md:grid-cols-2 items-center gap-2 pt-3;
}

.chart-title {
  @apply text-lg font-semibold mb-2;
}
</style>
