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