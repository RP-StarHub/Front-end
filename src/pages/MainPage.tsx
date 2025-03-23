import React, { useState, useMemo, useEffect } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import FilterFloatingButton from "../components/main/FilterFloatingButton";
import MapSearchButton from "../components/main/MapSearchButton";
import { useMap } from "../hooks/common/useMap";
import { useMeetingList } from "../hooks/api/useMeeting";
import useMapStore from "../store/mapStore";

/**
 * 메인 페이지 컴포넌트 : 
 * 네이버 지도 기반 스터디 모임 목록 및 위치 시각화 제공
 */
const MainPage: React.FC = () => {
  const [page, setPage] = useState(1);
  
  const searchTerm = useMapStore(state => state.searchTerm);
  const setSearchTerm = useMapStore(state => state.setSearchTerm);
  const setIsSearching = useMapStore(state => state.setIsSearching);
  
  const { 
    mapRef, 
    naverMapRef, 
    mapReady, 
    executeMapSearch 
  } = useMap();
  
  const { data, isLoading } = useMeetingList(page);
  
  const meetings = useMemo(() => data?.data?.content || [], [data?.data?.content]);
  const totalPages = useMemo(() => data?.data?.totalPages || 0, [data?.data?.totalPages]);

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
  
  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 지도 영역 검색 처리
  const handleMapSearch = () => {
    const coordinates = executeMapSearch();
    if (coordinates) {
      console.log(`지도 영역 검색: c=${coordinates.minLat},${coordinates.maxLat},${coordinates.minLng},${coordinates.maxLng}`);
      
      setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    }
  };

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