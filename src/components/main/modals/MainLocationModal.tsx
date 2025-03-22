import React, { useState, useEffect } from 'react';
import {
  getLocationDataSync,
  defaultLocationData,
  preloadLocationData,
  SigunguItem,
  SelectedLocation,
  SidoItem
} from '../../../util/locationUtils';

interface MainLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: SelectedLocation) => void;
  selectedLocation: SelectedLocation;
  anchorEl?: HTMLElement | null;
}

const MainLocationModal: React.FC<MainLocationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedLocation = { selectedSido: '', selectedSigunguList: [] },
  anchorEl
}) => {
  const [selectedSido, setSelectedSido] = useState<string>(selectedLocation.selectedSido);
  const [selectedSigunguList, setSelectedSigunguList] 
    = useState<SigunguItem[]>(selectedLocation.selectedSigunguList);
  const [activeSido, setActiveSido] = useState<string | null>(selectedLocation.selectedSido || null);
  const [locationData, setLocationData] = useState<SidoItem[]>(defaultLocationData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await preloadLocationData();
        const data = getLocationDataSync();
        setLocationData(data);
      } catch (error) {
        setLocationData(defaultLocationData);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    setSelectedSido(selectedLocation.selectedSido);
    setSelectedSigunguList(selectedLocation.selectedSigunguList);
    setActiveSido(selectedLocation.selectedSido || null);
  }, [selectedLocation]);

  if (!isOpen) return null;

  const handleSidoSelect = (sido: string) => {
    setActiveSido(sido);

    if (selectedSido !== sido) {
      setSelectedSido(sido);
    }
  };

  const getCurrentSidoItem = (): SidoItem | undefined => {
    if (!activeSido) return undefined;
    return locationData.find(item => item.sido === activeSido);
  };

  const isSigunguSelected = (id: string): boolean => {
    return selectedSigunguList.some(item => item.id === id);
  };

  const handleSigunguToggle = (sigungu: SigunguItem) => {
    if (isSigunguSelected(sigungu.id)) {
      setSelectedSigunguList([]);
    } else {
      setSelectedSigunguList([sigungu]);
    }
  };

  const handleRemoveSigungu = (id: string) => {
    setSelectedSigunguList(prev => prev.filter(item => item.id !== id));
  };

  // 현재 선택된 시도의 시군구 목록
  const getSigunguList = (): SigunguItem[] => {
    const sidoItem = getCurrentSidoItem();
    if (!sidoItem) return [];
    return sidoItem.sigunguList;
  };

  const handleSelectAll = () => {
    setSelectedSigunguList([]);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result: SelectedLocation = {
      selectedSido,
      selectedSigunguList
    };

    onSelect(result);
    onClose();
  };

  // 시도별 선택된 시군구 그룹화
  const getSelectedSigunguBySido = () => {
    const result: Record<string, SigunguItem[]> = {};

    selectedSigunguList.forEach(sigungu => {
      for (const sidoItem of locationData) {
        const found = sidoItem.sigunguList.find(item => item.id === sigungu.id);
        if (found) {
          if (!result[sidoItem.sido]) {
            result[sidoItem.sido] = [];
          }
          result[sidoItem.sido].push(sigungu);
          break;
        }
      }
    });

    return result;
  };

  // 선택된 시군구 렌더링
  const renderSelectedTags = () => {
    const groupedBySido = getSelectedSigunguBySido();

    return Object.entries(groupedBySido).map(([sido, sigunguList]) => (
      <React.Fragment key={sido}>
        {sigunguList.map(sigungu => (
          <div
            key={sigungu.id}
            className="inline-flex items-center bg-gray-100 rounded px-2 py-1 mr-2 mb-2"
          >
            <span className="font-scdream4 text-regular text-bold">{sido} {sigungu.sigungu}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveSigungu(sigungu.id);
              }}
              className="ml-1 text-gray-500"
            >
              ×
            </button>
          </div>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            style={{ pointerEvents: 'all' }}
          />

          <div
            className="absolute top-16 left-2/3 z-50 bg-white rounded shadow-md p-4 w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'all' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-button font-gmarket-bold text-bold">지역 선택</h3>
              <p className="text-regular text-gray-500">하나만 선택 가능</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-t-2 border-sub rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex border rounded">
                  <div className="w-1/2 max-h-[250px] overflow-y-auto">
                    {locationData.map((item) => (
                      <div
                        key={item.sido}
                        className={`p-2.5 cursor-pointer border-b ${activeSido === item.sido ? 'bg-bold text-white' : 'hover:bg-gray-100'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSidoSelect(item.sido);
                        }}
                      >
                        <span className="font-scdream4 text-regular">{item.sido}</span>
                      </div>
                    ))}
                  </div>

                  <div className="w-1/2 max-h-[250px] overflow-y-auto border-l">
                    {activeSido ? (
                      <>
                        <div className="sticky top-0 bg-gray-50 p-2 flex justify-between items-center border-b">
                          <span className="font-scdream6 text-regular text-bold">{activeSido}</span>
                          <button
                            className="text-regular text-sub font-scdream4"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectAll();
                            }}
                          >
                            선택 취소
                          </button>
                        </div>

                        {getSigunguList().length > 0 ? (
                          getSigunguList().map(sigungu => (
                            <div
                              key={sigungu.id}
                              className="p-2 border-b hover:bg-gray-50"
                            >
                              <label className="flex items-center cursor-pointer">
                                <div
                                  className={`
                                    w-5 h-5 border-2 flex items-center justify-center
                                    ${isSigunguSelected(sigungu.id)
                                      ? 'border-bold bg-bold'
                                      : 'border-bold'
                                    }
                                    mr-2
                                  `}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSigunguToggle(sigungu);
                                  }}
                                >
                                  {isSigunguSelected(sigungu.id) && (
                                    <div className="flex items-center justify-center text-white">✓</div>
                                  )}
                                </div>
                                <span className="font-scdream4 text-regular text-bold">{sigungu.sigungu}</span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 font-scdream4 text-regular">
                            데이터가 없습니다.
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 font-scdream4 text-regular">시/도를 선택하세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedSigunguList.length > 0 && (
              <div className="mb-4 flex flex-wrap">
                {renderSelectedTags()}
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="bg-sub text-white py-1 px-4 rounded font-scdream4"
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainLocationModal;