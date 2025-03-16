import React, { useEffect, useMemo, useRef, useState } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import FilterFloatingButton from "../components/main/FilterFloatingButton";
import { useGeolocation } from "../hooks/common/useGeolocation";
import { useMeetingList } from "../hooks/api/useMeeting";

const MainPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null);
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState("");
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList(page);
  
  // 기본 위치 설정 (서울시청 좌표)
  const defaultLocation = { latitude: 37.5666805, longitude: 126.9784147 };
  
  const meetings = useMemo(() => data?.data.content || [], [data?.data.content]);
  const totalPages = data?.data?.totalPages ?? 0;
  
  const canUseGeolocation = loaded && location?.latitude != null && location?.longitude != null;

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;
    
    const mapCenter = canUseGeolocation
      ? new naver.maps.LatLng(location.latitude, location.longitude)
      : new naver.maps.LatLng(defaultLocation.latitude, defaultLocation.longitude);

    const map = new naver.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    });

    setNaverMap(map);

    // 디버깅을 위한 로그
    // TODO: 이상하게 해당 로그 코드 지우면 지도가 안 뜨는 현상 발생
    // 추후 원인 파악 필요
    console.log("지도 생성됨", {
      geolocationLoaded: loaded,
      userLocation: location,
      usingDefaultLocation: !canUseGeolocation,
      mapCenter: mapCenter
    });

    return () => {
      map?.destroy();
      setNaverMap(null);
    };
  }, [canUseGeolocation, defaultLocation.latitude, defaultLocation.longitude, loaded, location]);

  // TODO: 추후 API 연결 추가 필요
  useEffect(() => {
    console.log("상태관리 검색어:", searchTerm);
  }, [searchTerm]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("검색어:", term);
  };
  
  // TODO: 추후 필터 로직 구현
  const handleFilterChange = (filterType: string, value?: string) => {
    console.log("선택된 필터:", filterType, "값:", value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;

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
          className="w-full h-full"
        >
          {naverMap && meetings.map((meeting) => (
            <EventMarker
              key={meeting.id}
              meeting={meeting}
              position={{
                latitude: meeting.latitude,
                longitude: meeting.longitude
              }}
              map={naverMap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;