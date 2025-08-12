// Kakao Maps API 타입 정의

export interface KakaoGeocoderResult {
  x: string; // 경도 (lng)
  y: string; // 위도 (lat)
  // 필요한 경우 아래 필드를 확장하세요
  address_name?: string;
  road_address?: {
    address_name?: string;
    building_name?: string;
    zone_no?: string;
    x?: string;
    y?: string;
  } | null;
}

export interface KakaoMapsServices {
  Geocoder: new () => {
    addressSearch: (
      address: string,
      callback: (result: KakaoGeocoderResult[], status: string) => void
    ) => void;
  };
  Status: {
    OK: string;
    ZERO_RESULT?: string;
    ERROR?: string;
  };
}

export interface KakaoMaps {
  services: KakaoMapsServices;
}

// Window 전역 객체에 kakao 속성 추가
declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

// 모듈로 인식되도록 빈 export 유지
export {};
