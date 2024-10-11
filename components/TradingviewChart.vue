<template>
  <div v-if="chartStore.isLoading">Loading data...</div>
  <div v-if="chartStore.error">{{ chartStore.error }}</div>

  <div
    v-if="!chartStore.isLoading && !chartStore.error"
    class="h-[80%] bg-slate-600"
    ref="chartContainer"
  ></div>
</template>

<script lang="ts" setup>
import type { ChartOptions } from 'lightweight-charts'

const { $charts } = useNuxtApp()
const chartStore = useChartStore()
const chart = ref()
const candlestickSeries = ref()
const volumeSeries = ref()
const chartContainer = ref<HTMLElement>()

const candleStickOptions = {
  upColor: '#0f766e',
  downColor: '#be123c',
  borderUpColor: '#0f766e',
  borderDownColor: '#be123c',
  wickUpColor: '#0f766e',
  wickDownColor: '#be123c'
}

let updateInterval: number | null = null

onMounted(async () => {
  await chartStore.fetchBinanceData()

  if (chartContainer.value) {
    chart.value = $charts.createChart(
      chartContainer.value,
      chartStore.chartOptions as ChartOptions
    )

    candlestickSeries.value =
      chart.value.addCandlestickSeries(candleStickOptions)
    candlestickSeries.value.setData(chartStore.chartData)

    candlestickSeries.value.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.2 }
    })

    volumeSeries.value = chart.value.addHistogramSeries({
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: ''
    })

    volumeSeries.value.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0
      }
    })

    volumeSeries.value.setData(chartStore.volumeData)

    chart.value.timeScale().fitContent()

    updateInterval = window.setInterval(async () => {
      const newCandlestickData = await chartStore.fetchLatestBinanceData()
      if (newCandlestickData) {
        candlestickSeries.value.update(newCandlestickData.candlestick)
        volumeSeries.value.update(newCandlestickData.volume)
      }
    }, 1000)

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
