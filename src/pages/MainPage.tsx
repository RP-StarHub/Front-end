import React, { useState, useMemo, useEffect } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import FilterFloatingButton from "../components/main/FilterFloatingButton";
import MapSearchButton from "../components/main/MapSearchButton";
import { useMap } from "../hooks/common/useMap";
import { useMeetingList, SearchMeetingParams } from "../hooks/api/useMeeting";
import useMapStore from "../store/mapStore";
import { DURATION } from "../types/models/meeting";
import { SelectedLocation } from "../util/locationUtils";

/**
 * 메인 페이지 컴포넌트 : 
 * 네이버 지도 기반 스터디 모임 목록 및 위치 시각화 제공
 */
const MainPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const searchTerm = useMapStore(state => state.searchTerm);
  const isSearching = useMapStore(state => state.isSearching);
  const setSearchTerm = useMapStore(state => state.setSearchTerm);
  const setDurations = useMapStore(state => state.setDurations);
  const setTechStacks = useMapStore(state => state.setTechStacks);
  const setParticipants = useMapStore(state => state.setParticipants);
  const setLocation = useMapStore(state => state.setLocation);
  const setCoordinates = useMapStore(state => state.setCoordinates);
  const setIsSearching = useMapStore(state => state.setIsSearching);
  const getSearchParams = useMapStore(state => state.getSearchParams);

  const {
    mapRef,
    naverMapRef,
    mapReady,
    executeMapSearch
  } = useMap();

  // 검색 파라미터 생성
  const searchParams = useMemo<SearchMeetingParams>(() => {
    const { params, body } = getSearchParams();

    return {
      title: searchTerm, // params.title 대신 searchTerm 직접 사용
      coordinates: params.c,
      page: page,
      size: 4,
      body: Object.keys(body).length > 0 ? body : undefined
    };
  }, [getSearchParams, page, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      console.log("검색어 변경됨:", searchTerm);
      setIsSearching(true);
    }
  }, [searchTerm, setIsSearching]);

  const { data, isLoading } = useMeetingList(searchParams);

  const meetings = useMemo(() => data?.data?.content || [], [data?.data?.content]);
  const totalPages = useMemo(() => data?.data?.totalPages || 0, [data?.data?.totalPages]);

  useEffect(() => {
    if (searchTerm) {
      console.log("검색어 변경됨:", searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isSearching && !isLoading) {
      setIsSearching(false);
    }
  }, [isLoading, isSearching, setIsSearching]);

  const handleSearch = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
    setPage(1);
    console.log("검색어 입력:", term);
  };

  const handleFilterChange = (filterType: string, value?: any) => {
    setIsSearching(true);
    setPage(1);

    console.log("필터 변경:", filterType, value);

    try {
      switch (filterType) {
        case '기간':
          setDurations(value as DURATION | null);
          break;
        case '스택':
          setTechStacks(Array.isArray(value) ? value : []);
          break;
        case '인원':
          if (value?.minParticipants !== undefined && value?.maxParticipants !== undefined) {
            setParticipants(value.minParticipants, value.maxParticipants);
          }
          break;
        case '지역':
          if (value) {
            setLocation(value as SelectedLocation);
          }
          break;
        default:
          console.warn(`알 수 없는 필터 타입: ${filterType}`);
      }
    } catch (error) {
      console.error("필터 변경 중 오류 발생:", error);
    }
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 지도 영역 검색 처리
  const handleMapSearch = () => {
    setIsSearching(true);
    const coords = executeMapSearch();
    if (coords) {
      setCoordinates(coords);
      console.log(`지도 영역 검색: c=${coords.minLat},${coords.maxLat},${coords.minLng},${coords.maxLng}`);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[90vh]">
      <div className="w-full md:w-1/3 lg:w-1/4 overflow-y-auto">
        <StudyList
          meetings={meetings}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          isLoading={isLoading || isSearching}
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
          {(!mapReady || isLoading || isSearching) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
              <div className="text-center">
                <div className="mb-2">
                  {!mapReady ? "지도를 로딩 중입니다..." : "검색 중입니다..."}
                </div>
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