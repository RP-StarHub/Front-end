import React, { useState } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import { MapPosition, KakaoLatLng, MarkerState } from '../../types/models/common'
import OverCard from './OverCard';
import { StudyCardInfo } from '../../types/models/study';

interface EventMarkerProps extends StudyCardInfo {
  position: MapPosition;
}

const EventMarker = React.memo<EventMarkerProps>(({
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
});

export default EventMarker;
