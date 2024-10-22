/** @format */

// hooks/useLocation.ts
import { useEffect, useState } from "react";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface UseLocationResult {
  Mylocation: Location;
  error: string | null;
}

const useLocation = (): UseLocationResult => {
  const [Mylocation, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Người dùng từ chối cho phép định vị.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Thông tin vị trí không khả dụng.");
              break;
            case error.TIMEOUT:
              setError("Yêu cầu lấy vị trí bị hết thời gian.");
              break;
            default:
              setError("Lỗi không xác định xảy ra.");
              break;
          }
        }
      );
    } else {
      setError("Trình duyệt không hỗ trợ Geolocation.");
    }
  }, []);

  return { Mylocation, error };
};

export default useLocation;
