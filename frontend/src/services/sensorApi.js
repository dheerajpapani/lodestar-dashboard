const API_ENDPOINT = import.meta.env.VITE_SENSOR_API_URL || 'https://nodeapi.orcatech.co.in/getPeriodicReportARG';

// In-memory buffer cache map: Key -> { data, timestamp }
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Clear the in-memory cache manually to free up browser memory.
 */
export const clearSensorCache = () => {
  console.log('[SensorAPI] Clearing in-memory sensor buffer cache');
  cache.clear();
};

/**
 * Get start and end Unix timestamps for common range keys
 */
export const getRangeTimestamps = (rangeKey) => {
  const endTime = Math.floor(Date.now() / 1000);
  let startTime;

  switch (rangeKey) {
    case '24h':
      startTime = endTime - 86400; // 24 hours
      break;
    case '7d':
      startTime = endTime - (7 * 86400); // 7 days
      break;
    case '30d':
      startTime = endTime - (30 * 86400); // 30 days
      break;
    case 'all':
      startTime = 0; // Full history
      break;
    default:
      startTime = endTime - 86400;
  }

  return { startTime, endTime };
};

/**
 * Fetches sensor data for a given UID and time range with TTL caching.
 */
export const fetchSensorData = async (uid, startTime, endTime) => {
  const cacheKey = `${uid}-${startTime}-${endTime}`;
  const now = Date.now();

  // Instant 0ms cache response if valid
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      console.log(`[SensorAPI] Returning cached data for ${uid} (Instant response)`);
      return data;
    }
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_time: startTime,
        end_time: endTime,
        uid: uid,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const resultArr = Array.isArray(data) ? data : [];
    
    // Store in buffer cache
    cache.set(cacheKey, { data: resultArr, timestamp: now });
    return resultArr;
  } catch (error) {
    console.error(`[SensorAPI] Error fetching data for ${uid}:`, error);
    throw error;
  }
};

/**
 * Tests a sensor by checking recent telemetry.
 * Returns status: 'online' | 'stale' | 'offline', latest reading date, and location.
 */
export const testSensor = async (uid) => {
  const { startTime: startTime24h, endTime } = getRangeTimestamps('24h');

  try {
    // 1. Quick 24h check
    const data24h = await fetchSensorData(uid, startTime24h, endTime);
    
    if (Array.isArray(data24h) && data24h.length > 0) {
      const latest = data24h[data24h.length - 1];
      return {
        online: true,
        statusState: 'online',
        data: data24h,
        latestReading: latest,
        lastSeenDate: latest.date_time || null,
      };
    }

    // 2. Fallback check for last 30 days to detect stale sensors vs offline
    const { startTime: startTime30d } = getRangeTimestamps('30d');
    const data30d = await fetchSensorData(uid, startTime30d, endTime);

    if (Array.isArray(data30d) && data30d.length > 0) {
      const latest = data30d[data30d.length - 1];
      return {
        online: false,
        statusState: 'stale',
        data: data30d,
        latestReading: latest,
        lastSeenDate: latest.date_time || null,
      };
    }

    // 3. Completely offline or empty API
    return {
      online: false,
      statusState: 'offline',
      data: [],
      latestReading: null,
      lastSeenDate: null,
    };
  } catch (error) {
    return {
      online: false,
      statusState: 'offline',
      data: [],
      latestReading: null,
      lastSeenDate: null,
      error: error.message,
    };
  }
};
