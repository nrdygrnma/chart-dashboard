<template>
  <div v-if="isLoading">Loading data...</div>
  <div v-if="error">{{ error }}</div>

  <div v-if="!isLoading && !error">
    <select v-model="symbol" @change="fetchBinanceData">
      <option value="BTCUSDT">BTC/USDT</option>
      <option value="ETHUSDT">ETH/USDT</option>
    </select>

    <select v-model="interval" @change="fetchBinanceData">
      <option value="1m">1 Minute</option>
      <option value="1h">1 Hour</option>
      <option value="1d">1 Day</option>
      <option value="1w">1 Week</option>
      <option value="1M">1 Month</option>
    </select>
  </div>
  <div
    v-if="!isLoading && !error"
    ref="chartContainer"
    class="h-[80%] bg-slate-600 mt-4"
  ></div>
</template>

<script lang="ts" setup>
const { $charts } = useNuxtApp();
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";
import { useChartStore } from "~/stores/chartStore";
import type { ChartOptions } from "lightweight-charts";
import {
  candleStickOptions,
  chartOptions,
  scaleMargins,
  volumeSeriesOptions,
} from "~/config/chartStyles";

const chartStore = useChartStore();

const { fetchBinanceData, fetchLatestBinanceData } = chartStore;
const { chartData, volumeData, isLoading, error, symbol, interval } =
  storeToRefs(chartStore);

const chart = ref<any>(null);
let updateInterval: number | null = 1000;
const chartContainer = ref<HTMLElement>();
const volumeSeries = ref<any>(null);
const candlestickSeries = ref<any>(null);

const setupChart = () => {
  if (
    !chartContainer.value ||
    !chartData.value.length ||
    !volumeData.value.length
  )
    return;

  chart.value = $charts.createChart(
    chartContainer.value,
    chartOptions as ChartOptions,
  );

  candlestickSeries.value =
    chart.value.addCandlestickSeries(candleStickOptions);
  candlestickSeries.value.setData(chartData.value);

  candlestickSeries.value.priceScale().applyOptions({
    scaleMargins: {
      top: scaleMargins.candlestick.top,
      bottom: scaleMargins.candlestick.bottom,
    },
  });

  volumeSeries.value = chart.value.addHistogramSeries(volumeSeriesOptions);
  volumeSeries.value.priceScale().applyOptions({
    scaleMargins: {
      top: scaleMargins.volume.top,
      bottom: scaleMargins.volume.bottom,
    },
  });
  volumeSeries.value.setData(volumeData.value);

  chart.value.timeScale().fitContent();
  document.getElementById("tv-attr-logo")?.remove();
};

const updateChartData = async () => {
  try {
    const newData = await fetchLatestBinanceData();
    if (newData) {
      candlestickSeries.value.update(newData.candlestick);
      volumeSeries.value.update(newData.volume);
    }
  } catch (err) {
    console.error("Error updating chart data:", err);
  }
};

watch([symbol, interval], async () => {
  await fetchBinanceData();
  setupChart();
});

onMounted(async () => {
  await fetchBinanceData();
  setupChart();

  updateInterval = window.setInterval(updateChartData, 1000);
});

onUnmounted(() => {
  if (chart.value) chart.value.remove();
  if (updateInterval) clearInterval(updateInterval);
});
</script>
