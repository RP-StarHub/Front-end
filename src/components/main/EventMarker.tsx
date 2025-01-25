import React, { useState } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import { MapPosition, KakaoLatLng, MarkerState } from '../../types/models/common'
import OverCard from './OverCard';
import { Meeting } from '../../types/models/meeting';

interface EventMarkerProps {
  meeting: Meeting;
  position: MapPosition;
  key: number;
}

const EventMarker = React.memo<EventMarkerProps>(({
  position,
  meeting,
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
      key={meeting.id}
      position={kakaoPosition}
      onClick={handleMarkerClick}
      onMouseOver={handleMarkerMouseOver}
      onMouseOut={handleMarkerMouseOut}
    >
      {markerState.isVisible && (
        <OverCard
          meeting={meeting}
          onClose={handleClose}
        />
      )}
    </MapMarker>
  );
});

export default EventMarker;
