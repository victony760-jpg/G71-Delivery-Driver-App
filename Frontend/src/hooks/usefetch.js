import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      setData(res.data?.data ?? res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    // Fetch owns loading and error state for initial loads and refetches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
