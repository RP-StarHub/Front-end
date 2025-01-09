import React, { useState, useEffect } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import styled from "styled-components";
import InformCard from "../components/InformCard";
import OverCard from "../components/OverCard";
import axios from "axios";
import { Post, MapPosition, KakaoLatLng } from "../types";

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
  $active?: boolean;
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

interface EventMarkerContainerProps {
  position: MapPosition;
  title: string;
  skill: string;
  deadline: string;
  progress: string;
  peopleNum: number;
  place: string;
  type: string;
  postId: number;
}

const EventMarkerContainer: React.FC<EventMarkerContainerProps> = ({
  position,
  title,
  skill,
  deadline,
  progress,
  peopleNum,
  place,
  type,
  postId,
}) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleMarkerClick = () => {
    setIsClicked(!isClicked);
  };

  const handleMarkerMouseOver = () => {
    if (!isClicked) {
      setIsVisible(true);
    }
  };

  const handleMarkerMouseOut = () => {
    if (!isClicked) {
      setIsVisible(false);
    }
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
      {isVisible && (
        <OverCard
          skill={skill}
          place={place}
          progress={progress}
          peopleNum={peopleNum}
          deadline={deadline}
          type={type}
          title={title}
          postId={postId}
          onClose={() => {
            setIsClicked(false);
            setIsVisible(false);
          }}
        />
      )}
    </MapMarker>
  );
};

const StudyList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studies, setStudies] = useState<Post[]>([]);

  const studiesPerPage = 4;

  useEffect(() => {
    axios
      .get<Post[]>("http://localhost:8080/api/post/list")
      .then((response) => {
        setStudies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startplace = (currentPage - 1) * studiesPerPage;
  const endplace = startplace + studiesPerPage;
  const studiesToDisplay = studies.slice(startplace, endplace);

  return (
    <ListContainer>
      {studiesToDisplay.map((value) => (
        <InformCard
          key={value.postId}
          postId={value.postId}
          skill={value.skill}
          place={value.place}
          progress={value.progress}
          peopleNum={value.peopleNum}
          deadline={value.deadline}
          type={value.type}
          title={value.title}
        />
      ))}
      <PaginationContainer>
        {studies.length > studiesPerPage && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </PaginationButton>
        )}
        {studies.length > studiesPerPage &&
          Array.from({
            length: Math.ceil(studies.length / studiesPerPage),
          }).map((_, index) => (
            <PaginationNumberButton
              key={index}
              $active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationNumberButton>
          ))}
        {studies.length > studiesPerPage && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endplace >= studies.length}
          >
            다음
          </PaginationButton>
        )}
      </PaginationContainer>
    </ListContainer>
  );
};

const MainPage: React.FC = () => {
  const [location, setLocation] = useState<MapPosition | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [studies, setStudies] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get<Post[]>("http://localhost:8080/api/post/list")
      .then((response) => {
        setStudies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  const successHandler = (response: GeolocationPosition) => {
    const { latitude, longitude } = response.coords;
    setLocation({ latitude, longitude });
    setLoaded(true);
  };

  const errorHandler = (error: GeolocationPositionError) => {
    console.log(error);
  };

  return (
    <PageContainer>
      <StudyList />
      {loaded && location && location.latitude !== null && location.longitude !== null && (
        <Map
          center={{ lat: location.latitude, lng: location.longitude }}
          style={{ width: "73%", height: "100%" }}
          level={3}
        >
          {studies.map((value) => (
            <EventMarkerContainer
              key={`EventMarkerContainer-${value.latitude}-${value.longitude}`}
              position={{ latitude: value.latitude, longitude: value.longitude }}
              skill={value.skill}
              place={value.place}
              progress={value.progress}
              peopleNum={value.peopleNum}
              deadline={value.deadline}
              type={value.type}
              title={value.title}
              postId={value.postId}
            />
          ))}
        </Map>
      )}
    </PageContainer>
  );
};

export default MainPage;