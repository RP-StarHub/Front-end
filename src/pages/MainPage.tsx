import React, { useState, useEffect } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import InformCard from "../components/InformCard";
import OverCard from "../components/OverCard";
import axios from "axios";
import { Post, MapPosition, KakaoLatLng, MarkerState, StudyCardInfo } from "../types";

const PageContainer = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: row;
`;

const ListContainer = styled.div`
  width: 27%;
  padding: 10px 20px;
  background-color: #f6f1fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

interface StyledButtonProps {
  $active: boolean;
}

const PaginationNumberButton = styled.button<StyledButtonProps>`
  margin: 5px;
  font-size: 16px;
  font-family: "SCDream4";
  color: #7c8bbe;
  background-color: transparent;
  border: none;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
`;

const PaginationButton = styled.button`
  margin-left: 10px;
  margin-right: 10px;
  padding: 4px 15px;
  font-size: 16px;
  font-family: "SCDream4";
  align-items: center;
  border-radius: 10px;
  color: #f6f1fb;
  background-color: #7c8bbe;
  border: none;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 15px;
`;

interface EventMarkerContainerProps extends StudyCardInfo {
  position: MapPosition;
}

const EventMarkerContainer: React.FC<EventMarkerContainerProps> = ({
  position,
  ...cardProps
}) => {
  const [markerState, setMarkerState] = useState<MarkerState>({
    isVisible: false,
    isClicked: false
  });

  const handleMarkerClick = () => {
    setMarkerState(prev => ({
      ...prev,
      isClicked: !prev.isClicked
    }));
  };

  const handleMarkerMouseOver = () => {
    if (!markerState.isClicked) {
      setMarkerState(prev => ({ ...prev, isVisible: true }));
    }
  };

  const handleMarkerMouseOut = () => {
    if (!markerState.isClicked) {
      setMarkerState(prev => ({ ...prev, isVisible: false }));
    }
  };

  const handleClose = () => {
    setMarkerState({ isVisible: false, isClicked: false });
  };

  const kakaoPosition: KakaoLatLng = {
    lat: position.latitude,
    lng: position.longitude
  };

  return (
    <MapMarker
      position={kakaoPosition}
      onClick={handleMarkerClick}
      onMouseOver={handleMarkerMouseOver}
      onMouseOut={handleMarkerMouseOut}
    >
      {markerState.isVisible && (
        <OverCard
          {...cardProps}
          onClose={handleClose}
        />
      )}
    </MapMarker>
  );
};

interface StudyListProps {
  studiesPerPage?: number;
}

const StudyList: React.FC<StudyListProps> = ({ studiesPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studies, setStudies] = useState<Post[]>([]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await axios.get<Post[]>("http://localhost:8080/api/post/list");
        setStudies(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudies();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * studiesPerPage;
  const endIndex = startIndex + studiesPerPage;
  const studiesToDisplay = studies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(studies.length / studiesPerPage);
  const showPagination = studies.length > studiesPerPage;

  return (
    <ListContainer>
      {studiesToDisplay.map((study) => (
        <InformCard
          key={study.postId}
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
      {showPagination && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </PaginationButton>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationNumberButton
              key={index}
              $active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationNumberButton>
          ))}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </PaginationButton>
        </PaginationContainer>
      )}
    </ListContainer>
  );
};

const MainPage: React.FC = () => {
  const [location, setLocation] = useState<MapPosition | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [studies, setStudies] = useState<Post[]>([]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await axios.get<Post[]>("http://localhost:8080/api/post/list");
        setStudies(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudies();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (response: GeolocationPosition) => {
        const { latitude, longitude } = response.coords;
        setLocation({ latitude, longitude });
        setLoaded(true);
      },
      (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const canShowMap = loaded && location?.latitude != null && location?.longitude != null;

  return (
    <PageContainer>
      <StudyList />
      {canShowMap && (
        <KakaoMap
          center={{ lat: location.latitude, lng: location.longitude }}
          style={{ width: "73%", height: "100%" }}
          level={3}
        >
          {studies.map((study) => (
            <EventMarkerContainer
              key={`EventMarkerContainer-${study.latitude}-${study.longitude}`}
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