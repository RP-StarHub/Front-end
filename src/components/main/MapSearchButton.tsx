import React from 'react';
import { Search } from '@mui/icons-material';
import useMapStore from '../../store/mapStore';

interface MapSearchButtonProps {
  onClick: () => void;
}

/**
 * 메인페이지 지도 재검색 버튼 컴포넌트
 */
const MapSearchButton: React.FC<MapSearchButtonProps> = ({ onClick }) => {
  const isSearching = useMapStore(state => state.isSearching);
  const setIsSearching = useMapStore(state => state.setIsSearching);
  
  const handleSearch = () => {
    if (isSearching) return;
    
    setIsSearching(true);
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <button
          className={`
            flex items-center gap-4 rounded-full py-2 px-4 shadow-md
            transition-colors duration-300 ease-in-out
            ${isSearching 
              ? 'bg-main text-white' 
              : 'bg-white border text-gray-600 hover:border-bold hover:text-bold'
            }
          `}
          onClick={handleSearch}
          disabled={isSearching}
        >
          <Search sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold">
            {isSearching ? '검색 중...' : '현 지도에서 검색'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MapSearchButton;