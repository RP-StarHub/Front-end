import React, { useEffect, useRef, useState } from "react";
import { Map as KakaoMap } from "react-kakao-maps-sdk";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import { useGeolocation } from '../hooks/common/useGeolocation';
import { useMeetingList } from "../hooks/api/useMeeting";

const MainPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1); 
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList(page);
  
  const meetings = data?.data.content || [];
  const totalPages = data?.data?.totalPages ?? 0;
  
  const canShowMap = loaded && location?.latitude != null && location?.longitude != null;

  useEffect(() => {
    if (!mapRef.current || !canShowMap || !window.naver) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(location?.latitude, location?.longitude),
      zoom: 17
    });

    return () => {
      map?.destroy();
    }
  }, [canShowMap, location]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full flex min-h-[90vh]">
      <StudyList
        meetings={meetings}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div ref={mapRef} id="map" style={{ width: "66%", height: "100%" }}/>
      {/* {canShowMap && (
        <KakaoMap
          center={{ lat: location.latitude, lng: location.longitude }}
          style={{ width: "66%", height: "100%" }}
          level={3}
        >
          {meetings.map((meeting) => (
            <EventMarker
              key={meeting.id}
              meeting={meeting}
              position={{ 
                latitude: meeting.latitude, 
                longitude: meeting.longitude 
              }}
            />
          ))}
        </KakaoMap>
      )} */}
    </div>
  );
};

export default MainPage;