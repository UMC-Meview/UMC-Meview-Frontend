import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import StoreFormInput from "./StoreFormInput";

interface PostcodeSearchProps {
  onAddressSelect: (address: string, postcode: string) => void;
  className?: string;
}

const PostcodeSearch: React.FC<PostcodeSearchProps> = ({
  onAddressSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: { address: string; zonecode: string }) => {
    const fullAddress = data.address;
    const postcode = data.zonecode;
    
    onAddressSelect(fullAddress, postcode);
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