export interface LatLng {
  latitude: number | null;
  longitude: number | null;
}

export interface MapPosition {
  latitude: number;
  longitude: number;
}

export interface KakaoLatLng {
  lat: number;
  lng: number;
}

export interface MarkerState {
  isVisible: boolean;
  isClicked: boolean;
}


export interface LikeDto {
  likeCount: number;
  isLiked?: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}