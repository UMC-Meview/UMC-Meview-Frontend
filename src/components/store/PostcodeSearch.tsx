import { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import StoreFormInput from "./StoreFormInput";
import { KakaoGeocoderResult } from "../../types/kakao";

interface PostcodeSearchProps {
  onAddressSelect: (address: string, postcode: string, latitude?: number, longitude?: number) => void;
  className?: string;
}

const PostcodeSearch = ({
  onAddressSelect,
  className = "",
}: PostcodeSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: { address: string; zonecode: string }) => {
    const fullAddress = data.address;
    const postcode = data.zonecode;
    
    // Kakao Maps Geocoder를 사용하여 주소를 좌표로 변환
    if (window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(fullAddress, (result: KakaoGeocoderResult[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const coords = result[0];
          const latitude = parseFloat(coords.y);
          const longitude = parseFloat(coords.x);
          
          // console.log(`주소: ${fullAddress}, 위도: ${latitude}, 경도: ${longitude}`);
          onAddressSelect(fullAddress, postcode, latitude, longitude);
        } else {
          console.warn('좌표 변환 실패, 기본 좌표 사용');
          onAddressSelect(fullAddress, postcode);
        }
      });
    } else {
      console.warn('Kakao Maps API가 로드되지 않음, 기본 좌표 사용');
      onAddressSelect(fullAddress, postcode);
    }
    
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <StoreFormInput
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-24 h-8"
        variant="small"
      >
        우편번호 검색
      </StoreFormInput>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">우편번호 검색</h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <DaumPostcode
              onComplete={handleComplete}
              onClose={handleClose}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostcodeSearch; 