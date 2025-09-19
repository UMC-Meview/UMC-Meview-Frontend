import StoreFormInput from "./StoreFormInput";
import PostcodeSearch from "./PostcodeSearch";

interface StoreAddressSectionProps {
    address: string;
    detailAddress: string;
    postalCode: string;
    onInputChange: (field: string, value: string) => void;
    onAddressSelect: (address: string, postcode: string, latitude?: number, longitude?: number) => void;
}

const StoreAddressSection = ({
    address,
    detailAddress,
    postalCode,
    onInputChange,
    onAddressSelect,
}: StoreAddressSectionProps) => {
    return (
        <div className="space-y-2">
            <label className="block text-gray-800 font-medium mb-2">가게 주소</label>
            <div className="flex gap-2 items-end">
                <StoreFormInput
                    value={postalCode}
                    onChange={value => onInputChange("postalCode", value)}
                    placeholder="우편번호"
                    variant="small"
                    inputClassName="text-[13px]"
                    disabled={!address}
                />
                <PostcodeSearch
                    onAddressSelect={onAddressSelect}
                    className="flex-shrink-0"
                />
            </div>
            <StoreFormInput
                value={address}
                onChange={value => onInputChange("address", value)}
                placeholder="가게 주소를 입력해주세요."
                variant="default"
                disabled={!postalCode}
            />
            <StoreFormInput
                value={detailAddress}
                onChange={value => onInputChange("detailAddress", value)}
                placeholder="상세 주소를 입력해주세요."
                variant="default"
                disabled={!address}
            />
        </div>
    );
};

export default StoreAddressSection; 