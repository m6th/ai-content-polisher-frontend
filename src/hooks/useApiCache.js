import { useState, useEffect, useCallback } from 'react';

// Simple in-memory cache with expiration
const cache = new Map();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function useApiCache(key, fetchFn, options = {}) {
  const {
    cacheTime = DEFAULT_CACHE_TIME,
    enabled = true,
    refetchOnMount = false
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(key);
    const now = Date.now();

    if (!forceRefresh && cached && (now - cached.timestamp) < cacheTime) {
      setData(cached.data);
      setIsLoading(false);
      return cached.data;
    }

    // Fetch fresh data
    setIsLoading(true);
    try {
      const result = await fetchFn();
      const responseData = result.data || result;

      // Update cache
      cache.set(key, {
        data: responseData,
        timestamp: now
      });

      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      setError(err);
      console.error(`Error fetching ${key}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchFn, cacheTime, enabled]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    fetchData(true);
  }, [key, fetchData]);

  useEffect(() => {
    if (refetchOnMount) {
      fetchData(true);
    } else {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  return {
    data,
    error,
    isLoading,
    refetch: () => fetchData(true),
    invalidate
  };
}

// Clear all cache
export function clearAllCache() {
  cache.clear();
}

// Clear specific cache entry
export function clearCache(key) {
  cache.delete(key);
}
