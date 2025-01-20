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

export type IconType = '스택' | '마감' | '장소' | '인원' | '기간';

export interface IconStyle {
  width: string;
  height: string;
  margin: string;
}

export interface MarkerState {
  isVisible: boolean;
  isClicked: boolean;
}