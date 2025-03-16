import React, { useEffect, useMemo, useRef, useState } from "react";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import { useGeolocation } from "../hooks/common/useGeolocation";
import { useMeetingList } from "../hooks/api/useMeeting";

const MainPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null);
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState("");
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList(page);
  
  const meetings = useMemo(() => data?.data.content || [], [data?.data.content]);
  const totalPages = data?.data?.totalPages ?? 0;
  const canShowMap = loaded && location?.latitude != null && location?.longitude != null;

  useEffect(() => {
    if (!mapRef.current || !canShowMap || !window.naver) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(location.latitude, location.longitude),
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    });

    setNaverMap(map);

    return () => {
      map?.destroy();
      setNaverMap(null);
    };
  }, [canShowMap, location]);

  // TODO: 추후 API 연결 추가 필요
  useEffect(() => {
    console.log("상태관리 검색어:", searchTerm);
  }, [searchTerm]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("검색어:", term);
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