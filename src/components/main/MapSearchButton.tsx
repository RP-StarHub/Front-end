import React from 'react';
import { Search } from '@mui/icons-material';

interface MapSearchButtonProps {
  onClick: () => void;
}

/**
 * 메인페이지 지도 재검색 버튼 컴포넌트
 */
const MapSearchButton: React.FC<MapSearchButtonProps> = ({ onClick }) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <button
          className="flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md text-gray-600 hover:border-bold hover:text-bold transition-colors"
          onClick={onClick}
        >
          <Search sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold">현 지도에서 검색</span>
        </button>
      </div>
    </div>
  );
};

export default MapSearchButton;