import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import FilterFloatingButton from "../components/main/FilterFloatingButton";
import { useGeolocation } from "../hooks/common/useGeolocation";
import { useMeetingList } from "../hooks/api/useMeeting";

declare global {
  interface Window {
    naver: any;
  }
}

let isNaverScriptLoading = false;

const MainPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState("");
  const [mapReady, setMapReady] = useState(false);
  
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList(page);
  
  const defaultLocation = useMemo(() => ({ 
    latitude: 37.5666805, 
    longitude: 126.9784147 
  }), []);
  
  const meetings = useMemo(() => data?.data?.content || [], [data?.data?.content]);
  const totalPages = useMemo(() => data?.data?.totalPages || 0, [data?.data?.totalPages]);
  const canUseGeolocation = loaded && location?.latitude != null && location?.longitude != null;

  // 네이버 맵 스크립트 로딩 함수
  const loadNaverScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // 이미 로드된 경우
      if (window.naver && window.naver.maps) {
        resolve();
        return;
      }
      
      // 로딩 중인 경우
      if (isNaverScriptLoading) {
        const checkInterval = setInterval(() => {
          if (window.naver && window.naver.maps) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        return;
      }
      
      // 새로 로드하는 경우
      try {
        isNaverScriptLoading = true;
        
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=dlpsgnrwky`;
        script.async = true;
        
        script.onload = () => {
          isNaverScriptLoading = false;
          resolve();
        };
        
        script.onerror = (e) => {
          console.error("Naver Maps API 로드 실패", e);
          isNaverScriptLoading = false;
          reject(new Error("Naver Maps API 로드 실패"));
        };
        
        document.head.appendChild(script);
      } catch (error) {
        isNaverScriptLoading = false;
        console.error("스크립트 로딩 중 오류:", error);
        reject(error);
      }
    });
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.naver || !window.naver.maps) {
      console.error("지도 초기화 불가: DOM 또는 API 준비되지 않음");
      return false;
    }
    
    try {
      // 이전 지도 제거
      if (naverMapRef.current) {
        naverMapRef.current.destroy();
        naverMapRef.current = null;
      }
      
      // 위치 설정
      const currentLocation = canUseGeolocation 
        ? { lat: location?.latitude, lng: location?.longitude }
        : { lat: defaultLocation.latitude, lng: defaultLocation.longitude };
      
      // 지도 생성
      naverMapRef.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      });
      
      return true;
    } catch (error) {
      console.error("지도 초기화 오류:", error);
      return false;
    }
  }, [canUseGeolocation, location, defaultLocation]);

  // 컴포넌트 마운트 후 DOM 준비 확인 및 지도 초기화
  useEffect(() => {
    let isMounted = true;
    
    const setupMap = async () => {
      if (!mapRef.current) {
        return;
      }
      
      try {
        await loadNaverScript();
        
        if (!isMounted) return;
        
        const success = initializeMap();
        
        if (success && isMounted) {
          setMapReady(true);
        }
      } catch (error) {
        console.error("지도 설정 실패:", error);
      }
    };
    
    // 약간의 지연을 두고 DOM 렌더링 확인 후 지도 초기화
    setTimeout(() => {
      if (isMounted) {
        setupMap();
      }
    }, 100);
    
    return () => {
      isMounted = false;
      
      if (naverMapRef.current) {
        naverMapRef.current.destroy();
        naverMapRef.current = null;
      }
    };
  }, [loadNaverScript, initializeMap]);

  // 위치 변경 시 지도 중심 업데이트
  useEffect(() => {
    if (!naverMapRef.current || !mapReady) return;
    
    const currentLocation = canUseGeolocation 
      ? { lat: location?.latitude, lng: location?.longitude }
      : { lat: defaultLocation.latitude, lng: defaultLocation.longitude };
    
    try {
      naverMapRef.current.setCenter(
        new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng)
      );
    } catch (error) {
      console.error("지도 중심 업데이트 실패:", error);
    }
  }, [canUseGeolocation, location, defaultLocation, mapReady]);

  // 검색어 변경 시 로깅
  useEffect(() => {
    if (searchTerm) {
      console.log("검색어 변경됨:", searchTerm);
    }
  }, [searchTerm]);

  // UI 이벤트 핸들러
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("검색어 입력:", term);
  };
  
  const handleFilterChange = (filterType: string, value?: string) => {
    console.log("필터 변경:", filterType, value);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 로딩 상태 처리
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[90vh]">
      <div className="w-full md:w-1/3 lg:w-1/4 overflow-y-auto">
        <StudyList
          meetings={meetings}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 relative h-[500px] md:h-[90vh]">
        <FilterFloatingButton onFilterChange={handleFilterChange} />
        
        <div 
          ref={mapRef} 
          id="map" 
          className="w-full h-full bg-gray-100"
          style={{ position: 'relative' }}
        >
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="mb-2">지도를 로딩 중입니다...</div>
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          )}
          
          {mapReady && naverMapRef.current && meetings.map((meeting) => (
            <EventMarker
              key={meeting.id}
              meeting={meeting}
              position={{
                latitude: meeting.latitude,
                longitude: meeting.longitude
              }}
              map={naverMapRef.current}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;