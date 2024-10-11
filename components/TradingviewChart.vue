<template>
  <div v-if="isLoading">Loading data...</div>
  <div v-if="error">{{ error }}</div>

  <div
    v-if="!isLoading && !error"
    class="h-[80%] bg-slate-600"
    ref="chartContainer"
  ></div>
</template>

<script lang="ts" setup>
import type { ChartOptions } from 'lightweight-charts'

const { $charts } = useNuxtApp()
const chartStore = useChartStore()
const { fetchBinanceData, fetchLatestBinanceData } = chartStore
const { chartOptions, chartData, volumeData, isLoading, error } =
  storeToRefs(chartStore)

const chart = ref()
const volumeSeries = ref()
const candlestickSeries = ref()
const chartContainer = ref<HTMLElement>()
let updateInterval: number = 1000

const candleStickOptions = {
  upColor: '#0f766e',
  downColor: '#be123c',
  borderUpColor: '#0f766e',
  borderDownColor: '#be123c',
  wickUpColor: '#0f766e',
  wickDownColor: '#be123c'
}

const setupSeries = () => {
  candlestickSeries.value = chart.value.addCandlestickSeries(candleStickOptions)
  candlestickSeries.value.setData(chartData.value)
  candlestickSeries.value.priceScale().applyOptions({
    scaleMargins: {
      top: 0.1,
      bottom: 0.2
    }
  })
  volumeSeries.value = chart.value.addHistogramSeries({
    priceFormat: { type: 'volume' },
    priceScaleId: ''
  })
  volumeSeries.value
    .priceScale()
    .applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
  volumeSeries.value.setData(volumeData.value)
}

onMounted(async () => {
  await fetchBinanceData()
  if (chartContainer.value) {
    chart.value = $charts.createChart(
      chartContainer.value,
      chartOptions.value as ChartOptions
    )
    setupSeries()
    chart.value.timeScale().fitContent()
    updateInterval = window.setInterval(async () => {
      try {
        const newCandlestickData = await fetchLatestBinanceData()
        if (newCandlestickData) {
          candlestickSeries.value.update(newCandlestickData.candlestick)
          volumeSeries.value.update(newCandlestickData.volume)
        }
      } catch (err) {
        console.error('Error fetching latest data:', err)
      }
    }, updateInterval)
    document.getElementById('tv-attr-logo')?.remove()
  }
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.remove()
  }
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>
