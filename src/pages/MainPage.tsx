import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import FilterFloatingButton from "../components/main/FilterFloatingButton";
import MapSearchButton from "../components/main/MapSearchButton";
import { useGeolocation } from "../hooks/common/useGeolocation";
import { useMeetingList } from "../hooks/api/useMeeting";

declare global {
  interface Window {
    naver: any;
  }
}

// 네이버 스크립트 로딩 상태를 추적하는 전역 변수 (중복 로딩 방지)
let isNaverScriptLoading = false;

/**
 * 메인 페이지 컴포넌트 : 
 * 네이버 지도 기반 스터디 모임 목록 및 위치 시각화 제공
 */
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

  /**
   * 네이버 맵 스크립트 로딩 함수: 스크립트 로딩 상태를 관리하고 중복 로딩을 방지
   * Promise 기반으로 스크립트 로딩 완료 시점을 명확히 처리
   */
  const loadNaverScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // 이미 로드된 경우 즉시 완료 처리
      if (window.naver && window.naver.maps) {
        resolve();
        return;
      }
      
      // 로딩 중인 경우 완료될 때까지 대기
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

  // 지도 초기화 함수 : 지도 생성 및 초기 위치 설정
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.naver || !window.naver.maps) {
      console.error("지도 초기화 불가: DOM 또는 API 준비되지 않음");
      return false;
    }
    
    try {
      if (naverMapRef.current) {
        naverMapRef.current.destroy();
        naverMapRef.current = null;
      }
      
      // 위치 설정
      const currentLocation = canUseGeolocation 
        ? { lat: location?.latitude, lng: location?.longitude }
        : { lat: defaultLocation.latitude, lng: defaultLocation.longitude };
      
      // 지도 생성 - ref 사용으로 리렌더링 방지
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

  // 지도 초기화 및 스크립트 로딩 처리
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
    
    // DOM 렌더링 완료 후 처리를 위한 짧은 지연
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

  // 지도 중심 업데이트
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

  useEffect(() => {
    if (searchTerm) {
      console.log("검색어 변경됨:", searchTerm);
    }
  }, [searchTerm]);

  // TODO: 추후 API 연결 추가 필요
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("검색어 입력:", term);
  };
  
  // TODO: 추후 필터 로직 구현
  const handleFilterChange = (filterType: string, value?: string) => {
    console.log("필터 변경:", filterType, value);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // TODO: 추후 현재 지도 영역 좌표 로직 구현
  const handleMapSearch = useCallback(() => {
    if (!naverMapRef.current) return;
    
    try {
      const bounds = naverMapRef.current.getBounds();
      const ne = bounds.getNE();
      const sw = bounds.getSW();
      
      const minLat = sw.lat();
      const maxLat = ne.lat();
      const minLng = sw.lng();
      const maxLng = ne.lng();
      
      const coordParam = `${minLat},${maxLat},${minLng},${maxLng}`;
      
      console.log(`최소 위도, 최대 위도, 최소 경도, 최대 경도: c=${coordParam}`);
    } catch (error) {
      console.error("지도 검색 오류:", error);
    }
  }, []);

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
        
        <MapSearchButton onClick={handleMapSearch} />
        
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