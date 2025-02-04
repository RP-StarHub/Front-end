import React, { useEffect } from 'react';
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
  useEffect(() => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(position.latitude, position.longitude),
      map
    });

    const closeInfoWindow = () => {
      infoWindow.close();
    };

    const infoWindow = new naver.maps.InfoWindow({
      content: ReactDOMServer.renderToString(
        <OverCard
          meeting={meeting}
          onClose={closeInfoWindow}
          isMapOverlay
        />
      ),
      backgroundColor: '#fff',
      borderColor: '#7C8BBE',
      borderWidth: 1,
      anchorSkew: true,
      anchorSize: new naver.maps.Size(12, 12),
      anchorColor: '#fff',
      pixelOffset: new naver.maps.Point(0, -8)
    });

    naver.maps.Event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });

    naver.maps.Event.addListener(marker, 'mouseover', () => {
      if (!infoWindow.getMap()) {
        infoWindow.open(map, marker);
      }
    });

    naver.maps.Event.addListener(marker, 'mouseout', () => {
      if (!infoWindow.getMap()) {
        infoWindow.close();
      }
    });

    return () => {
      marker.setMap(null);
      infoWindow.close();
    };
  }, [meeting, position, map]);

  return null;
};

export default EventMarker;