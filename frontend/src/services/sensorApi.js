const API_ENDPOINT = 'https://nodeapi.orcatech.co.in/getPeriodicReportARG';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchSensorData = async (uid, startTime, endTime) => {
  const cacheKey = `${uid}-${startTime}-${endTime}`;
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      console.log(`[SensorAPI] Returning cached data for ${uid}`);
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
    cache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`[SensorAPI] Error fetching data for ${uid}:`, error);
    throw error;
  }
};

/**
 * Tests a sensor by fetching data for the last 24 hours.
 * Returns { online: boolean, data: array, location: { lat, lon } | null }
 */
export const testSensor = async (uid) => {
  const endTime = Math.floor(Date.now() / 1000);
  const startTime = endTime - 86400; // 24 hours ago

  try {
    const data = await fetchSensorData(uid, startTime, endTime);
    const online = Array.isArray(data) && data.length > 0;
    
    let location = null;
    if (online) {
      // Look for location fields in the most recent reading
      const latest = data[data.length - 1];
      const lat = latest.lat || latest.latitude || latest.latitue;
      const lon = latest.lon || latest.longitude || latest.longitue;
      
      if (lat !== undefined && lon !== undefined) {
        location = { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
    }

    return { online, data, location };
  } catch (error) {
    return { online: false, data: [], location: null, error: error.message };
  }
};
