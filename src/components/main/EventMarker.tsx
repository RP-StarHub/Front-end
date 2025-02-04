import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Meeting } from '../../types/models/meeting';
import { MapPosition } from '../../types/models/common';
import OverCard from './OverCard';

interface EventMarkerProps {
  meeting: Meeting;
  position: MapPosition;
  map: naver.maps.Map;
}

const EventMarker = ({ meeting, position, map }: EventMarkerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(position.latitude, position.longitude),
      map
    });

    const content = document.createElement('div');
    content.innerHTML = ReactDOMServer.renderToString(
      <OverCard
        meeting={meeting}
        onClose={() => null}
        isMapOverlay={true}
      />
    );

    const infoWindow = new naver.maps.InfoWindow({
      content: content,
      backgroundColor: "transparent",
      borderColor: "transparent",
      disableAnchor: true
    });

    naver.maps.Event.addListener(marker, 'click', () => {
      setIsVisible(!isVisible);
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    naver.maps.Event.addListener(marker, 'mouseover', () => {
      if (!isVisible) {
        infoWindow.open(map, marker);
      }
    });

    naver.maps.Event.addListener(marker, 'mouseout', () => {
      if (!isVisible) {
        infoWindow.close();
      }
    });

    return () => {
      marker.setMap(null);
      infoWindow.close();
    };
  }, [meeting, position, map, isVisible]);

  return <></>;
};

export default EventMarker;