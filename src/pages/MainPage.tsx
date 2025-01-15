import React from "react";
import styled from "styled-components";
import { Map as KakaoMap } from "react-kakao-maps-sdk";
import { usePostList } from "../hooks/api/usePost";
import EventMarker from "../components/main/EventMarker";
import StudyList from "../components/main/StudyList";
import { useGeolocation } from '../hooks/common/useGeolocation';

const PageContainer = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: row;
`;

const MainPage: React.FC = () => {
  const { location, loaded } = useGeolocation();
  const { data, isLoading } = usePostList();
  const studies = data?.data || [];

  const canShowMap = loaded && location?.latitude != null && location?.longitude != null;

  if (isLoading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <StudyList studies={studies} />
      {canShowMap && (
        <KakaoMap
          center={{ lat: location.latitude, lng: location.longitude }}
          style={{ width: "73%", height: "100%" }}
          level={3}
        >
          {studies.map((study) => (
            <EventMarker
              key={`EventMarker-${study.latitude}-${study.longitude}`}
              position={{ latitude: study.latitude, longitude: study.longitude }}
              postId={study.postId}
              skill={study.skill}
              place={study.place}
              progress={study.progress}
              peopleNum={study.peopleNum}
              deadline={study.deadline}
              type={study.type}
              title={study.title}
            />
          ))}
        </KakaoMap>
      )}
    </PageContainer>
  );
};

export default MainPage;