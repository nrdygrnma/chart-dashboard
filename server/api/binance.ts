export default defineEventHandler(async (event): Promise<any> => {
  const symbol = 'BTCUSDT'
  const interval = '1h'
  const limit = 1000

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

  try {
    const response: any = await $fetch(url)
    return response
  } catch (error) {
    console.error('Error fetching Binance data:', error)
    return { error: 'Error fetching data from Binance' }
  }
})
