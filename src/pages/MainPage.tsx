import React from "react";
import { Map as KakaoMap } from "react-kakao-maps-sdk";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import { useGeolocation } from '../hooks/common/useGeolocation';
import { useMeetingList } from "../hooks/api/useMeeting";

const MainPage: React.FC = () => {
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList();
  const meetings = data?.data.content || [];

  const canShowMap = loaded && location?.latitude != null && location?.longitude != null;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full flex min-h-[90vh]">
      <StudyList
        meetings={meetings}
        currentPage={data?.data.pageable.pageNumber || 0}
        totalPages={data?.data.totalPages || 0}
        onPageChange={() => { }}
      />
      {canShowMap && (
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
      )}
    </div>
  );
};

export default MainPage;