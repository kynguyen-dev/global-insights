// ── Gold Price API Service ──
// Uses vang.today free API — no key required, CORS enabled
// Proxied through Vite dev server (/api/gold → vang.today/prices.php)
// Docs: https://www.vang.today/api

const GOLD_API_BASE = '/api/gold';

// ── Types ──
export interface GoldPriceRaw {
  name: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  currency: string;
}

export interface GoldApiResponse {
  success: boolean;
  timestamp: number;
  time: string;
  date: string;
  count: number;
  prices: Record<string, GoldPriceRaw>;
}

export interface GoldPrice {
  id: string;
  name: string;
  buy: number;
  sell: number;
  changeBuy: number;
  changeSell: number;
  currency: string;
}

export interface GoldData {
  updatedAt: string;       // e.g. "17:23"
  date: string;            // e.g. "2026-04-03"
  timestamp: number;
  sjc: GoldPrice | null;
  worldGold: GoldPrice | null;
  allPrices: GoldPrice[];
}

// ── History Types ──
export interface GoldHistoryEntry {
  date: string;
  name: string;
  buy: number;
  sell: number;
  dayChangeBuy: number;
  dayChangeSell: number;
  updates: number;
}

export interface GoldHistoryData {
  type: string;
  days: number;
  history: GoldHistoryEntry[];
}

// ── Fetch All Gold Prices ──
export async function fetchGoldPrices(): Promise<GoldData> {
  const res = await fetch(GOLD_API_BASE);

  if (!res.ok) {
    throw new Error(`Gold API error: ${res.status} ${res.statusText}`);
  }

  const data: GoldApiResponse = await res.json();

  if (!data.success) {
    throw new Error('Gold API returned unsuccessful response');
  }

  // Transform raw prices into clean typed objects
  const allPrices: GoldPrice[] = Object.entries(data.prices).map(([key, raw]) => ({
    id: key,
    name: raw.name,
    buy: raw.buy,
    sell: raw.sell,
    changeBuy: raw.change_buy,
    changeSell: raw.change_sell,
    currency: raw.currency,
  }));

  // Extract key prices
  const sjc = allPrices.find(p => p.id === 'SJL1L10') ?? null;
  const worldGold = allPrices.find(p => p.id === 'XAUUSD') ?? null;

  return {
    updatedAt: data.time,
    date: data.date,
    timestamp: data.timestamp,
    sjc,
    worldGold,
    allPrices,
  };
}

// ── Fetch Single Gold Type ──
export async function fetchGoldPrice(type: string): Promise<GoldPrice | null> {
  const res = await fetch(`${GOLD_API_BASE}?type=${type}`);

  if (!res.ok) {
    throw new Error(`Gold API error: ${res.status} ${res.statusText}`);
  }

  const data: GoldApiResponse = await res.json();

  if (!data.success || !data.prices[type]) {
    return null;
  }

  const raw = data.prices[type];
  return {
    id: type,
    name: raw.name,
    buy: raw.buy,
    sell: raw.sell,
    changeBuy: raw.change_buy,
    changeSell: raw.change_sell,
    currency: raw.currency,
  };
}

// ── Fetch Gold Price History ──
export async function fetchGoldHistory(type: string, days: number): Promise<GoldHistoryData> {
  const res = await fetch(`${GOLD_API_BASE}?type=${type}&days=${days}`);

  if (!res.ok) {
    throw new Error(`Gold History API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error('Gold History API returned unsuccessful response');
  }

  const history: GoldHistoryEntry[] = (data.history || []).map((entry: any) => {
    const priceData = entry.prices[type];
    return {
      date: entry.date,
      name: priceData?.name || type,
      buy: priceData?.buy || 0,
      sell: priceData?.sell || 0,
      dayChangeBuy: priceData?.day_change_buy || 0,
      dayChangeSell: priceData?.day_change_sell || 0,
      updates: priceData?.updates || 0,
    };
  });

  return {
    type: data.type,
    days: data.days,
    history,
  };
}

// ── Formatting Helpers ──
export function formatVndPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function formatUsdPrice(price: number): string {
  return '$' + new Intl.NumberFormat('en-US').format(price);
}

export function formatPriceChange(change: number, price: number): string {
  if (price === 0) return '0%';
  const pct = (change / price) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
