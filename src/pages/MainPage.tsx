import React, { useState } from "react";
import { Map as KakaoMap } from "react-kakao-maps-sdk";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import { useGeolocation } from "../hooks/common/useGeolocation";
import { useMeetingList } from "../hooks/api/useMeeting";

const MainPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = useMeetingList(page);

  const meetings = data?.data.content || [];
  const totalPages = data?.data?.totalPages ?? 0;

  const canShowMap =
    loaded && location?.latitude != null && location?.longitude != null;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[90vh]">
      <div className="w-full md:w-1/3 lg:w-1/4">
        <StudyList
          meetings={meetings}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {canShowMap && (
        <div className="w-full md:w-2/3 lg:w-3/4 flex-grow h-[500px] md:h-auto">
          <KakaoMap
            center={{ lat: location.latitude, lng: location.longitude }}
            style={{ width: "100%", height: "100%" }}
            level={3}
          >
            {meetings.map((meeting) => (
              <EventMarker
                key={meeting.id}
                meeting={meeting}
                position={{
                  latitude: meeting.latitude,
                  longitude: meeting.longitude,
                }}
              />
            ))}
          </KakaoMap>
        </div>
      )}
    </div>
  );
};

export default MainPage;
