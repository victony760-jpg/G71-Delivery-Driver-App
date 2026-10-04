import { useEffect, useState } from 'react';
import { getBusinessHours } from '../services/deliveryService.js';

export default function useBusinessHours() {
  const [businessHours, setBusinessHours] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadBusinessHours = async () => {
      try {
        const data = await getBusinessHours();
        if (active) {
          setBusinessHours(data.businessHours);
          setError('');
        }
      } catch {
        if (active)
          setError(
            'Could not check current business hours. The server will verify availability when you submit.',
          );
      }
    };

    loadBusinessHours();
    const interval = setInterval(loadBusinessHours, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return { businessHours, businessHoursError: error };
}
