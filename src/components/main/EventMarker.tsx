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

    // 네이버 지도의 정보창 설정 
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

    // InfoWindow 업데이트 및 표시
    const showInfoWindow = () => {
      const closeInfoWindow = () => {
        infoWindow.close();
        isClickedRef.current = false;
      };

      // OverCard를 문자열로 반환해서 InfoWindow 내용으로 설정
      // InfoWindow가 리액트 컴포넌트를 직접 지원하지 않음
      // 이후에 별도의 이벤트 리스너 추가
      const content = ReactDOMServer.renderToString(
        <OverCard
          meeting={meeting}
        />
      );

      infoWindow.setContent(content);
      infoWindow.open(map, marker);

      setTimeout(() => {
        // 컨텐츠 영역을 누른 경우, 상세 페이지로 이동
        const contentDiv = document.querySelector('.bg-white.h-fit.cursor-pointer');
        if (contentDiv) {
          contentDiv.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[aria-label="Close"]')) {
              window.location.href = `/meeting/detail/${meeting.id}`;
            }
          });
        }

        // 닫기 버튼을 누른 경우, InfoWindow 닫음
        const closeButton = document.querySelector('.font-gmarket-bold[aria-label="Close"]');
        if (closeButton) {
          closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeInfoWindow();
          });
        }
      }, 0);
    };

    naver.maps.Event.addListener(marker, 'click', () => {
      isClickedRef.current = true;
      showInfoWindow();
    });

    naver.maps.Event.addListener(marker, 'mouseover', () => {
      if (!isClickedRef.current && !infoWindow.getMap()) {
        showInfoWindow();
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