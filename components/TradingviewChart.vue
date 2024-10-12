<template>
  <div v-if="isLoading">Loading data...</div>
  <div v-if="error">{{ error }}</div>

  <div class="h-full flex flex-col -mt-6">
    <div v-if="!isLoading && !error" class="flex justify-end">
      <select v-model="symbol" class="py-1 px-2" @change="fetchBinanceData">
        <option v-for="sym in symbols" :key="sym.value" :value="sym.value">
          {{ sym.display }}
        </option>
      </select>

      <select v-model="interval" class="py-1 px-2" @change="fetchBinanceData">
        <option value="1m">1 Minute</option>
        <option value="1h">1 Hour</option>
        <option value="1d">1 Day</option>
        <option value="1w">1 Week</option>
        <option value="1M">1 Month</option>
      </select>

      <Button
        class="ml-2 hover:bg-pink-600 bg-pink-700"
        @click="drawNewLineSeries()"
        >Draw Lines
      </Button>

      <Button
        class="ml-2 hover:bg-teal-600 bg-teal-700"
        @click="resetAllLineSeries()"
        >Clear Lines
      </Button>
    </div>

    <div
      v-if="!isLoading && !error"
      ref="chartContainer"
      class="h-full bg-slate-600 mt-4"
    ></div>
  </div>
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
const { chartData, volumeData, isLoading, error, symbol, symbols, interval } =
  storeToRefs(chartStore);

const chart = ref<any>(null);
let updateInterval: number | null = 1000;
const chartContainer = ref<HTMLElement>();
const volumeSeries = ref<any>(null);
const candlestickSeries = ref<any>(null);
const lineSeries = ref<any>();
const lineSeriesList = ref<any[]>([]);

const data1 = [
  { value: 59000, time: 1728574080 },
  { value: 63319, time: 1728746880 },
];

const data2 = [
  { value: 62863, time: 1728302411 },
  { value: 59318, time: 1728586811 },
];

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
    autoScale: true,
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
      if (candlestickSeries.value) {
        candlestickSeries.value.update(newData.candlestick);
      }

      if (volumeSeries.value) {
        volumeSeries.value.update(newData.volume);
      }
    }
  } catch (err) {
    console.error("Error updating chart data:", err);
  }
};

// Generate random colors for the lines
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Draw a new line series
const drawNewLineSeries = () => {
  const newLineSeries1 = chart.value.addLineSeries({ color: getRandomColor() });
  const newLineSeries2 = chart.value.addLineSeries({ color: getRandomColor() });

  newLineSeries1.setData(data1);
  newLineSeries2.setData(data2);
  lineSeriesList.value.push(newLineSeries1, newLineSeries2);
};

// Clear all line series
const resetAllLineSeries = () => {
  lineSeriesList.value.forEach((lineSeries) => {
    chart.value.removeSeries(lineSeries);
  });
  lineSeriesList.value = [];
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
