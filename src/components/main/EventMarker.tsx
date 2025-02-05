import React, { useEffect, useRef } from 'react';
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
  const isClickedRef = useRef(false);

  useEffect(() => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(position.latitude, position.longitude),
      map
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: '',
      backgroundColor: '#fff',
      borderColor: '#7C8BBE',
      borderWidth: 1,
      anchorSkew: true,
      anchorSize: new naver.maps.Size(12, 12),
      anchorColor: '#fff',
      pixelOffset: new naver.maps.Point(0, -8)
    });

    const showInfoWindow = (withCloseButton: boolean) => {
      const closeInfoWindow = () => {
        infoWindow.close();
        isClickedRef.current = false;
      };

      const content = ReactDOMServer.renderToString(
        <OverCard
          meeting={meeting}
        />
      );
      
      infoWindow.setContent(content);
      infoWindow.open(map, marker);

      setTimeout(() => {
        const contentDiv = document.querySelector('.bg-white.h-fit.cursor-pointer');
        if (contentDiv) {
          contentDiv.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[aria-label="Close"]')) {
              window.location.href = `/meeting/detail/${meeting.id}`;
            }
          });
        }

        if (withCloseButton) {
          const closeButton = document.querySelector('.font-gmarket-bold[aria-label="Close"]');
          if (closeButton) {
            closeButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              closeInfoWindow();
            });
          }
        }
      }, 0);
    };

    naver.maps.Event.addListener(marker, 'click', () => {
      isClickedRef.current = true;
      showInfoWindow(true);
    });

    naver.maps.Event.addListener(marker, 'mouseover', () => {
      if (!isClickedRef.current && !infoWindow.getMap()) {
        showInfoWindow(false);
      }
    });

    naver.maps.Event.addListener(marker, 'mouseout', () => {
      if (!isClickedRef.current && infoWindow.getMap()) {
        infoWindow.close();
      }
    });

    return () => {
      marker.setMap(null);
      infoWindow.close();
      isClickedRef.current = false;
    };
  }, [meeting, position, map]);

  return null;
};

export default React.memo(EventMarker);