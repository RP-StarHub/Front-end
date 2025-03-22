import Papa from 'papaparse';

/**
 * 지역 데이터 타입 정의
 */
export interface LocationItem {
  id: string;
  sido: string;
  sigungu: string;
}

/**
 * 시도 데이터 타입 정의
 */
export interface SidoItem {
  sido: string;
  sigunguList: SigunguItem[];
}

/**
 * 시군구 데이터 타입 정의
 */
export interface SigunguItem {
  id: string;
  sigungu: string;
}

/**
 * 선택한 위치 정보를 위한 타입 정의
 */
export interface SelectedLocation {
  selectedSido: string;
  selectedSigunguList: SigunguItem[];
}

// 데이터 캐싱
let locationData: LocationItem[] | null = null;
let locationDataPromise: Promise<LocationItem[]> | null = null;

/**
 * CSV 파일에서 데이터 로드
 */
export const loadLocationData = async (): Promise<LocationItem[]> => {
  // 이미 로드된 데이터가 있으면 재사용
  if (locationData !== null) {
    console.log("캐시된 위치 데이터 사용");
    return locationData;
  }

  // 이미 진행 중인 요청이 있으면 재사용
  if (locationDataPromise !== null) {
    console.log("진행 중인 위치 데이터 요청 사용");
    return locationDataPromise;
  }

  try {
    // 새 요청 생성 및 저장
    locationDataPromise = (async () => {
      try {
        // public 폴더에 있는 파일은 루트 경로로 접근
        const response = await fetch('/locations.csv');
        
        if (!response.ok) {
          console.error("CSV 파일 로드 실패:", response.status, response.statusText);
          return defaultLocationToLocationItems();
        }
        
        const csvText = await response.text();
        
        const parsedData = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        });
        
        // CSV 데이터 변환
        const result = parsedData.data
          .map((row: any) => ({
            id: row['법정동코드'] || '',
            sido: row['시도명'] || '',
            sigungu: row['시군구명'] || ''
          }))
          .filter((item: LocationItem) => item.id && item.sido);
        
        // 결과 캐싱
        locationData = result;
        return result;
      } catch (error) {
        console.error('행정구역 데이터 로드 실패:', error);
        const defaultItems = defaultLocationToLocationItems();
        locationData = defaultItems;
        return defaultItems;
      } finally {
        // 완료 후 Promise 제거
        locationDataPromise = null;
      }
    })();

    return await locationDataPromise;
  } catch (error) {
    console.error('행정구역 데이터 로드 실패 (최상위):', error);
    return defaultLocationToLocationItems();
  }
};

/**
 * 시도 목록 추출
 */
export const getSidoList = async (): Promise<string[]> => {
  const data = await loadLocationData();
  const sidoSet = new Set<string>();
  
  data.forEach(item => {
    if (item.sido) {
      sidoSet.add(item.sido);
    }
  });
  
  return Array.from(sidoSet);
};

/**
 * 특정 시도의 시군구 목록 추출
 */
export const getSigunguList = async (sido: string): Promise<SigunguItem[]> => {
  const data = await loadLocationData();
  
  return data
    .filter(item => item.sido === sido && item.sigungu)
    .map(item => ({
      id: item.id,
      sigungu: item.sigungu
    }));
};

/**
 * 전체 데이터를 시도별로 그룹화
 */
export const getGroupedLocationData = async (): Promise<SidoItem[]> => {
  const sidoList = await getSidoList();
  
  const result: SidoItem[] = [];
  
  for (const sido of sidoList) {
    const sigunguList = await getSigunguList(sido);
    result.push({
      sido,
      sigunguList
    });
  }
  
  return result;
};

/**
 * 법정동코드로 시도, 시군구 정보 찾기
 */
export const getLocationById = async (id: string): Promise<LocationItem | undefined> => {
  const data = await loadLocationData();
  return data.find(item => item.id === id);
};

/**
 * 시도명과 시군구명으로 법정동코드 찾기
 */
export const getIdBySidoAndSigungu = async (
  sido: string, 
  sigungu: string
): Promise<string | undefined> => {
  const data = await loadLocationData();
  const item = data.find(item => item.sido === sido && item.sigungu === sigungu);
  return item?.id;
};

/**
 * 데이터를 미리 로드하는 함수
 * (앱 초기화 시 호출하면 후속 호출에서 비동기 대기 시간 감소)
 */
export const preloadLocationData = async (): Promise<void> => {
  try {
    await loadLocationData();
    console.log("지역 데이터 사전 로드 완료");
  } catch (error) {
    console.error('지역 데이터 사전 로드 실패:', error);
  }
};

/**
 * 하드코딩된 기본 데이터 (CSV 로드 실패 시 사용)
 */
export const defaultLocationData: SidoItem[] = [
  {
    sido: '서울특별시',
    sigunguList: [
      { id: '1111000000', sigungu: '종로구' },
      { id: '1114000000', sigungu: '중구' },
      { id: '1117000000', sigungu: '용산구' },
      { id: '1120000000', sigungu: '성동구' },
      { id: '1121500000', sigungu: '광진구' }
    ]
  },
  {
    sido: '부산광역시',
    sigunguList: [
      { id: '2611000000', sigungu: '중구' },
      { id: '2614000000', sigungu: '서구' },
      { id: '2617000000', sigungu: '동구' },
      { id: '2620000000', sigungu: '영도구' },
      { id: '2623000000', sigungu: '부산진구' }
    ]
  },
  {
    sido: '대구광역시',
    sigunguList: [
      { id: '2711000000', sigungu: '중구' },
      { id: '2714000000', sigungu: '동구' },
      { id: '2717000000', sigungu: '서구' },
      { id: '2720000000', sigungu: '남구' },
      { id: '2723000000', sigungu: '북구' }
    ]
  }
];

/**
 * 기본 데이터를 LocationItem 배열로 변환
 */
export const defaultLocationToLocationItems = (): LocationItem[] => {
  const result: LocationItem[] = [];
  
  defaultLocationData.forEach(sido => {
    // 시도 레벨 항목 추가
    result.push({
      id: sido.sigunguList[0]?.id.substring(0, 2) + '00000000' || '0000000000',
      sido: sido.sido,
      sigungu: ''
    });
    
    // 시군구 레벨 항목 추가
    sido.sigunguList.forEach(sigungu => {
      result.push({
        id: sigungu.id,
        sido: sido.sido,
        sigungu: sigungu.sigungu
      });
    });
  });
  
  return result;
};

/**
 * 동기화된 데이터 가져오기 (기본 데이터 사용)
 */
export const getLocationDataSync = (): SidoItem[] => {
  return locationData ? locationDataToSidoItems(locationData) : defaultLocationData;
};

/**
 * LocationItem[] 배열을 SidoItem[] 배열로 변환
 */
export const locationDataToSidoItems = (data: LocationItem[]): SidoItem[] => {
  const sidoMap = new Map<string, SigunguItem[]>();
  
  data.forEach(item => {
    if (item.sido && item.sigungu) {
      if (!sidoMap.has(item.sido)) {
        sidoMap.set(item.sido, []);
      }
      
      const sigunguList = sidoMap.get(item.sido)!;
      sigunguList.push({
        id: item.id,
        sigungu: item.sigungu
      });
    }
  });
  
  return Array.from(sidoMap.entries()).map(([sido, sigunguList]) => ({
    sido,
    sigunguList
  }));
};