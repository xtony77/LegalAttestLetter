const FONT_CACHE_NAME = 'legal-attest-letter-fonts-v1';
const TW_KAI_FONT_PATH = '/fonts/TW-Kai.ttf';

export class FontLoadError extends Error {
  constructor(message = '字型載入失敗，請重新整理頁面後再試') {
    super(message);
    this.name = 'FontLoadError';
  }
}

async function fetchFontResponse(): Promise<Response> {
  const response = await fetch(TW_KAI_FONT_PATH);

  if (!response.ok) {
    throw new FontLoadError();
  }

  return response;
}

async function readCachedFont(cache: Cache): Promise<ArrayBuffer | null> {
  const response = await cache.match(TW_KAI_FONT_PATH);

  if (!response?.ok) {
    return null;
  }

  try {
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

export async function loadTwKaiFontBytes(): Promise<ArrayBuffer> {
  if (typeof window === 'undefined') {
    throw new FontLoadError();
  }

  if (!('caches' in window)) {
    return (await fetchFontResponse()).arrayBuffer();
  }

  const cache = await caches.open(FONT_CACHE_NAME);
  const cachedBytes = await readCachedFont(cache);

  if (cachedBytes) {
    return cachedBytes;
  }

  const response = await fetchFontResponse();

  try {
    await cache.put(TW_KAI_FONT_PATH, response.clone());
  } catch {
    // Cache API can fail in private mode or under browser storage limits.
  }

  return response.arrayBuffer();
}
