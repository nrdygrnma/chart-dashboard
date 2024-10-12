export default defineEventHandler(async (event): Promise<any> => {
  const { symbol = "BTCUSDT", interval = "1h", limit = 1000 } = getQuery(event);
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    return await $fetch(url);
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    return { error: "Error fetching data from Binance" };
  }
});
