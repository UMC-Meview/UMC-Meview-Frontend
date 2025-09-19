import StoreFormInput from "./StoreFormInput";
import AddItemButton from "../common/Button/AddItemButton";

interface StoreOperatingHoursSectionProps {
    openingHours: string[];
    onOpeningHourChange: (idx: number, value: string) => void;
    onAddOpeningHour: () => void;
}

const StoreOperatingHoursSection = ({
    openingHours,
    onOpeningHourChange,
    onAddOpeningHour,
}: StoreOperatingHoursSectionProps) => {
    return (
        <div className="mt-6 mb-5">
            <label className="block text-gray-800 font-medium mb-2">영업시간</label>
            {openingHours.map((hour, idx) => (
                <div key={idx} className="mb-2">
                    <StoreFormInput
                        value={hour}
                        onChange={value => onOpeningHourChange(idx, value)}
                        placeholder="영업시간을 입력해주세요."
                        variant="default"
                    />
                </div>
            ))}
            <div className="mt-10">
            <AddItemButton onClick={onAddOpeningHour}>
                영업시간 추가하기 +
            </AddItemButton>
            </div>
        </div>
    );
};

export default StoreOperatingHoursSection; 