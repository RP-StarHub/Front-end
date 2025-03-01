import { useState, useEffect } from 'react';
import { MapPosition } from '../../types/models/common';

export const useGeolocation = () => {
  const [location, setLocation] = useState<MapPosition | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (response: GeolocationPosition) => {
        const { latitude, longitude } = response.coords;
        setLocation({ latitude, longitude });
        setLoaded(true);
      },
      (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error);
        setLoaded(true);
      }
    );
  }, []);

  return { location, loaded };
};