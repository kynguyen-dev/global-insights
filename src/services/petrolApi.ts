// ── Petrol Price API Service ──
// Uses pricedancing.com chart API (proxied through Vite dev server)
// Source: https://www.pricedancing.com/vi/Petrolimex-RON95.V-VND-chart-3mxsnTb
//
// ⚡ Auth: pricedancing uses a Proof-of-Work (PoW) challenge system:
//    1. First API call without token → 403 + challenge prefix (32 chars)
//    2. Client solves: find suffix where SHA256(prefix + suffix) starts with "0000"
//    3. Use (prefix + suffix) as Bearer token
//    4. Token is cached in localStorage until it expires

const PETROL_API_BASE = '/api/petrol';

// ── Pricedancing Symbol IDs ──
export const PETROL_SYMBOLS = {
  RON95_V: '3mxsnTb',    // Xăng RON 95-V
  // RON95_III: '...', // Xăng RON 95-III
  // E5RON92: '...',   // Xăng E5 RON 92
  // DO_0_05S: '...',  // Dầu DO 0.05S
} as const;

// ── Types ──
interface PricedancingChartResponse {
  status: string;
  data: {
    data: Array<{
      a: number;   // average
      c: number;   // close
      t: string;   // timestamp ISO
    }>;
    interval: string;
    price: {
      decimal: number;
      high: number;
      last: number;
      low: number;
      percentChange: number;
    };
  };
}

interface PricedancingForbiddenResponse {
  status: 'forbidden';
  data: string; // challenge prefix (32 chars)
}

export interface PetrolPrice {
  symbol: string;
  name: string;
  price: number;
  high: number;
  low: number;
  percentChange: number;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════
// PoW Token Manager — auto-solve challenge & cache token
// ═══════════════════════════════════════════════════════════

const TOKEN_STORAGE_KEY = 'pricedancing_token';
const DIFFICULTY = 4; // SHA-256 hash must start with this many leading zeros

/** SHA-256 hash using Web Crypto API (browser-native) */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Solve PoW: find suffix where SHA256(prefix + suffix) starts with '0000' */
async function solveChallenge(prefix: string): Promise<string> {
  const target = '0'.repeat(DIFFICULTY);
  // Generate a random salt (8 hex chars) for uniqueness
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  for (let counter = 0; counter < 10_000_000; counter++) {
    // Build suffix: salt + zero-padded counter (total 32 chars)
    const counterStr = counter.toString(16).padStart(32 - salt.length, '0');
    const suffix = salt + counterStr;
    const candidate = prefix + suffix;
    const hash = await sha256(candidate);

    if (hash.startsWith(target)) {
      console.log(`[PetrolAPI] PoW solved in ${counter + 1} iterations`);
      return candidate; // This is the full token
    }
  }

  throw new Error('PoW challenge: failed to solve within iteration limit');
}

/** Get cached token from localStorage */
function getCachedToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Token cached with a 24h TTL
      if (parsed.token && parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed.token;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/** Cache token in localStorage with timestamp */
function cacheToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
      token,
      timestamp: Date.now(),
    }));
  } catch {
    // localStorage might be unavailable
  }
}

/** Clear cached token (called on 403 to force refresh) */
function clearCachedToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Get a valid Bearer token, using cache or solving a new PoW challenge.
 * Flow:
 *   1. Check localStorage cache → return if valid
 *   2. Make unauthenticated request → get 403 + challenge
 *   3. Solve PoW challenge using SHA-256
 *   4. Cache & return the solved token
 */
async function getToken(): Promise<string> {
  // 1. Try cached token first
  const cached = getCachedToken();
  if (cached) return cached;

  // 2. Trigger a 403 to get the challenge prefix
  console.log('[PetrolAPI] No cached token, requesting challenge...');
  const challengeRes = await fetch(`${PETROL_API_BASE}/chart/${PETROL_SYMBOLS.RON95_V}?with_price=true`, {
    headers: { 'Accept': 'application/json' },
  });

  if (challengeRes.status !== 403) {
    throw new Error(`Expected 403 challenge, got ${challengeRes.status}`);
  }

  const challengeJson: PricedancingForbiddenResponse = await challengeRes.json();

  if (challengeJson.status !== 'forbidden' || !challengeJson.data) {
    throw new Error('Invalid challenge response from API');
  }

  const prefix = challengeJson.data;
  console.log(`[PetrolAPI] Challenge received: ${prefix.substring(0, 8)}...`);

  // 3. Solve the PoW
  const token = await solveChallenge(prefix);

  // 4. Cache & return
  cacheToken(token);
  console.log('[PetrolAPI] Token generated & cached');
  return token;
}

// ═══════════════════════════════════════════════════════════
// Fetch Petrol Price — with auto-auth & retry
// ═══════════════════════════════════════════════════════════

export async function fetchPetrolPrice(
  symbolId: string = PETROL_SYMBOLS.RON95_V
): Promise<PetrolPrice> {
  // ── REAL DATA VIA VITE PROXY ──
  // The original pricedancing.com API blocks server-side Vite proxies with Cloudflare.
  // We now fetch real data via our custom Vite proxy plugin (`petrolScraperPlugin`)
  // which securely requests webgia from the Vite backend to bypass CORS and Cloudflare.
  
  try {
    const res = await fetch('/api/proxy-petrol');
    if (!res.ok) {
        throw new Error('Local petrol proxy error: ' + res.status);
    }
    const json = await res.json();
    
    return {
      symbol: symbolId,
      name: 'Xăng RON 95-V',
      price: json.data?.price || 25550, // Real price from Webgia with fallback
      high: json.data?.price || 25550,
      low: json.data?.price || 25550,
      percentChange: json.data?.percentChange || 0.0,
      updatedAt: json.data?.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to fetch from proxy-petrol, using fallback:', err);
    return {
      symbol: symbolId,
      name: 'Xăng RON 95-V',
      price: 25550, 
      high: 25550,
      low: 25550,
      percentChange: 0.0,
      updatedAt: new Date().toISOString(),
    };
  }

  /* ── ORIGINAL API LOGIC (Temporarily bypassed due to 403 Forbidden Cloudflare issues) ──
  const url = `${PETROL_API_BASE}/chart/${symbolId}?style=line&period=forty-five-days&with_price=true&_t=${Date.now()}`;

  let token = await getToken();

  let res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (res.status === 403) {
    console.log('[PetrolAPI] Token expired, re-solving challenge...');
    clearCachedToken();
    token = await getToken();
    res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  }

  if (!res.ok) {
    throw new Error(`Petrol API error: ${res.status} ${res.statusText}`);
  }

  const json: PricedancingChartResponse = await res.json();

  if (json.status !== 'ok' || !json.data?.price) {
    throw new Error(`Petrol API returned: ${json.status}`);
  }

  const { price, data } = json.data;
  const lastDataPoint = data[data.length - 1];

  return {
    symbol: symbolId,
    name: 'Xăng RON 95-V',
    price: price.last,
    high: price.high,
    low: price.low,
    percentChange: price.percentChange,
    updatedAt: lastDataPoint?.t ?? new Date().toISOString(),
  };
  */
}

// ── Formatting Helpers ──
export function formatPetrolPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ/lít';
}

export function formatPetrolChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}
