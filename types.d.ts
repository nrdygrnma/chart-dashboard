export interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
}

export interface VolumeData {
  time: number;
  value: number;
  color: string;
}

export interface SymbolData {
  symbol: string;
  price: string;
}
