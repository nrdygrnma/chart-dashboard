import { defineStore } from "pinia";
import { volumeColors } from "~/config/chartStyles";
import type { CandlestickData, VolumeData } from "~/types";

export const useChartStore = defineStore("chart", () => {
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const chartData = ref<CandlestickData[]>([]);
  const volumeData = ref<VolumeData[]>([]);
  const symbols = ref<string[]>([]);
  const symbol = ref<string>("BTCUSDT");
  const interval = ref<string>("1h");
  const apiUrl = "/api/binance";

  const fetchSymbols = async () => {
    try {
      const response: any[] = await $fetch(
        "https://api3.binance.com/api/v3/ticker/price",
      );
      symbols.value = response.map((ticker: any) => ticker.symbol);
    } catch (err) {
      console.error("Error fetching symbols from Binance:", err);
      error.value = "Failed to fetch symbols";
    }
  };

  const fetchBinanceData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response: any[] = await $fetch(apiUrl, {
        params: {
          symbol: symbol.value,
          interval: interval.value,
          limit: 1000,
        },
      });

      chartData.value = response.map((data) => ({
        time: data[0] / 1000,
        open: parseFloat(data[1]),
        high: parseFloat(data[2]),
        low: parseFloat(data[3]),
        close: parseFloat(data[4]),
      }));

      volumeData.value = response.map((data) => ({
        time: data[0] / 1000,
        value: parseFloat(data[5]),
        color:
          parseFloat(data[4]) > parseFloat(data[1])
            ? volumeColors.up
            : volumeColors.down,
      }));
    } catch (err) {
      console.error("Error fetching Binance data:", err);
      error.value = "Failed to fetch Binance data";
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLatestBinanceData = async () => {
    try {
      const response: any[] = await $fetch(apiUrl, {
        params: {
          symbol: symbol.value,
          interval: interval.value,
          limit: 1,
        },
      });
      const latestData = response[0];

      return {
        candlestick: {
          time: latestData[0] / 1000,
          open: parseFloat(latestData[1]),
          high: parseFloat(latestData[2]),
          low: parseFloat(latestData[3]),
          close: parseFloat(latestData[4]),
        },
        volume: {
          time: latestData[0] / 1000,
          value: parseFloat(latestData[5]),
          color:
            parseFloat(latestData[4]) > parseFloat(latestData[1])
              ? volumeColors.up
              : volumeColors.down,
        },
      };
    } catch (err) {
      console.error("Error fetching latest Binance data:", err);
      return null;
    }
  };

  return {
    chartData,
    volumeData,
    isLoading,
    symbol,
    symbols,
    interval,
    error,
    fetchSymbols,
    fetchBinanceData,
    fetchLatestBinanceData,
  };
});
