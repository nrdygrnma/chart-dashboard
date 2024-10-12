export const chartOptions = {
  layout: {
    textColor: "#9ca3af",
    background: { type: "solid", color: "#1f2937" },
  },
  grid: {
    vertLines: { color: "#374151" },
    horzLines: { color: "#374151" },
  },
};

export const candleStickOptions = {
  upColor: "#0f766e",
  downColor: "#be123c",
  borderUpColor: "#0f766e",
  borderDownColor: "#be123c",
  wickUpColor: "#0f766e",
  wickDownColor: "#be123c",
};

export const volumeSeriesOptions = {
  priceFormat: { type: "volume" },
  priceScaleId: "",
};

export const scaleMargins = {
  candlestick: {
    top: 0.1,
    bottom: 0.25,
  },
  volume: {
    top: 0.75,
    bottom: 0,
  },
};

export const volumeColors = {
  up: "rgba(15, 118, 110, 0.5)",
  down: "rgba(190, 18, 60, 0.5)",
};
