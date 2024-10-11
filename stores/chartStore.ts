import { defineStore } from 'pinia'

interface CandlestickData {
  open: number
  high: number
  low: number
  close: number
  time: number
}

interface VolumeData {
  time: number
  value: number
  color: string
}

export const useChartStore = defineStore('chart', () => {
  const apiUrl = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT'
  const chartData = ref<CandlestickData[]>([])
  const volumeData = ref<VolumeData[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const colorUpVolume = 'rgba(15, 118, 110, 0.5)'
  const colorDownVolume = 'rgba(190, 18, 60, 0.5)'

  const chartOptions = ref({
    layout: {
      textColor: '#9ca3af',
      background: { type: 'solid', color: '#1f2937' }
    },
    grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } }
  })

  const fetchBinanceData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response: any[] = await $fetch(`${apiUrl}&interval=1m&limit=100`)
      chartData.value = response.map((data: any) => ({
        time: data[0] / 1000,
        open: parseFloat(data[1]),
        high: parseFloat(data[2]),
        low: parseFloat(data[3]),
        close: parseFloat(data[4])
      }))

      volumeData.value = response.map((data: any) => ({
        time: data[0] / 1000,
        value: parseFloat(data[5]),
        color:
          parseFloat(data[4]) > parseFloat(data[1])
            ? colorUpVolume
            : colorDownVolume
      }))
    } catch (err) {
      console.error('Error fetching Binance data:', err)
      error.value = 'Failed to fetch Binance data'
    } finally {
      isLoading.value = false
    }
  }

  const fetchLatestBinanceData = async (): Promise<{
    candlestick: CandlestickData | null
    volume: VolumeData | null
  } | null> => {
    const latestApiUrl = `${apiUrl}&interval=1m&limit=1`

    try {
      const response: any[] = await $fetch(latestApiUrl)

      const latestData = response[0]

      const latestCandlestick: CandlestickData = {
        time: latestData[0] / 1000,
        open: parseFloat(latestData[1]),
        high: parseFloat(latestData[2]),
        low: parseFloat(latestData[3]),
        close: parseFloat(latestData[4])
      }

      const latestVolume: VolumeData = {
        time: latestData[0] / 1000,
        value: parseFloat(latestData[5]),
        color:
          parseFloat(latestData[4]) > parseFloat(latestData[1])
            ? colorUpVolume
            : colorDownVolume
      }

      return { candlestick: latestCandlestick, volume: latestVolume }
    } catch (err) {
      console.error('Error fetching latest Binance data:', err)
      return null
    }
  }

  return {
    chartData,
    volumeData,
    isLoading,
    error,
    chartOptions,
    fetchBinanceData,
    fetchLatestBinanceData
  }
})
