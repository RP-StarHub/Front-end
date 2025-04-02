import { useState, useEffect, useRef, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import useMapStore, { MapCoordinates } from '../../store/mapStore';

// 네이버 스크립트 로딩 상태를 추적하는 전역 변수 (중복 로딩 방지)
let isNaverScriptLoading = false;

/**
 * 네이버 맵 관련 커스텀 훅
 * 맵 초기화, 이벤트 처리, 상태 관리를 담당
 */
export const useMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const naverMapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const { location, loaded } = useGeolocation();
  
  // Zustand 스토어에서 좌표 설정 함수 가져오기
  const setCoordinates = useMapStore(state => state.setCoordinates);
  
  const canUseGeolocation = loaded && location?.latitude != null && location?.longitude != null;

  /**
   * 네이버 맵 스크립트 로딩 함수
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

  /**
   * 현재 지도의 좌표 범위를 가져오는 함수
   */
  const getCurrentMapCoordinates = useCallback((): MapCoordinates | null => {
    if (!naverMapRef.current) return null;
    
    try {
      const bounds = naverMapRef.current.getBounds();
      const ne = bounds.getNE();
      const sw = bounds.getSW();
      
      return {
        minLat: sw.lat(),
        maxLat: ne.lat(),
        minLng: sw.lng(),
        maxLng: ne.lng()
      };
    } catch (error) {
      console.error("지도 좌표 가져오기 실패:", error);
      return null;
    }
  }, []);

  const handleMapDragEnd = useCallback(() => {
    const coordinates = getCurrentMapCoordinates();
    if (coordinates) {
      setCoordinates(coordinates);
    }
  }, [getCurrentMapCoordinates, setCoordinates]);

  const handleZoomChanged = useCallback(() => {
    const coordinates = getCurrentMapCoordinates();
    if (coordinates) {
      setCoordinates(coordinates);
    }
  }, [getCurrentMapCoordinates, setCoordinates]);

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
      
      // 기본 위치 설정 (서울 시청)
      let currentLat = 37.5666805; 
      let currentLng = 126.9784147;
      
      if (canUseGeolocation && location?.latitude && location?.longitude) {
        currentLat = location.latitude;
        currentLng = location.longitude;
      }
      
      // 지도 생성 - ref 사용으로 리렌더링 방지
      naverMapRef.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(currentLat, currentLng),
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      });
      
      // 이벤트 리스너 등록
      window.naver.maps.Event.addListener(naverMapRef.current, 'dragend', handleMapDragEnd);
      window.naver.maps.Event.addListener(naverMapRef.current, 'zoom_changed', handleZoomChanged);
      
      // 초기 좌표값 저장
      const initialCoordinates = getCurrentMapCoordinates();
      if (initialCoordinates) {
        setCoordinates(initialCoordinates);
      }
      
      return true;
    } catch (error) {
      console.error("지도 초기화 오류:", error);
      return false;
    }
  }, [
    canUseGeolocation, 
    location, 
    handleMapDragEnd, 
    handleZoomChanged,
    getCurrentMapCoordinates,
    setCoordinates
  ]);

  /**
   * 지도 초기화 및 스크립트 로딩 처리
   */
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
        if (window.naver && window.naver.maps) {
          window.naver.maps.Event.clearListeners(naverMapRef.current, 'dragend');
          window.naver.maps.Event.clearListeners(naverMapRef.current, 'zoom_changed');
        }
        
        naverMapRef.current.destroy();
        naverMapRef.current = null;
      }
    };
  }, [loadNaverScript, initializeMap]);

  const moveToCenter = useCallback((lat: number, lng: number) => {
    if (!naverMapRef.current || !mapReady) return;
    
    try {
      naverMapRef.current.setCenter(
        new window.naver.maps.LatLng(lat, lng)
      );
    } catch (error) {
      console.error("지도 중심 이동 실패:", error);
    }
  }, [mapReady]);

  const moveToCurrentLocation = useCallback(() => {
    if (canUseGeolocation && location?.latitude && location?.longitude) {
      moveToCenter(location.latitude, location.longitude);
    } else {
      // 기본 위치 (서울 시청)로 이동
      moveToCenter(37.5666805, 126.9784147);
    }
  }, [canUseGeolocation, location, moveToCenter]);

  /**
   * 지도 영역 검색 실행 함수
   */
  const executeMapSearch = useCallback(() => {
    const coordinates = getCurrentMapCoordinates();
    if (coordinates) {
      setCoordinates(coordinates);
      // TODO: 실제 API 연동 전 테스트용
      console.log("지도 검색 실행:", coordinates);
      return coordinates;
    }
    return null;
  }, [getCurrentMapCoordinates, setCoordinates]);

  return {
    mapRef,
    naverMapRef,
    mapReady,
    moveToCenter,
    moveToCurrentLocation,
    executeMapSearch,
    getCurrentMapCoordinates
  };
};