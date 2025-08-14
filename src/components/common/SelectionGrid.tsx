import React from "react";
import SelectableButton from "./Button/SelectableButton";
import { LayoutConfig } from "../../constants/options";

interface TasteOption {
    name: string;
    emoji?: string;
}

type SelectionGridProps = {
    options: readonly (string | TasteOption)[] | (string | TasteOption)[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    maxSelections: number;
    totalSelections?: number; // ProfileEdit용 전체 선택 개수
    textSize?: 'base' | 'lg';
    showEmoji?: boolean;
    rowGap?: 'sm' | 'md';
    className?: string;
    layout?: LayoutConfig; // 레이아웃 설정 객체
    layoutType?: 'grid' | 'flex'; // 새로운 prop: 레이아웃 타입 지정
};

const SelectionGrid: React.FC<SelectionGridProps> = ({
    options,
    selectedItems,
    onToggle,
    maxSelections,
    totalSelections,
    textSize = 'base',
    showEmoji = false,
    rowGap = 'md',
    className = "",
    layout = { type: 'auto' },
    layoutType = 'flex' // 기본값은 flex로 설정
}) => {
    // 텍스트 크기 클래스 매핑
    const textSizeClasses = {
        base: 'text-[18px]',
        lg: 'text-lg'
    };

    // 행 간격 클래스 매핑
    const rowGapClasses = {
        sm: 'mb-1.5',
        md: 'mb-3'
    };

    // 선택 제한 로직
    const isSelectionDisabled = (itemName: string) => {
        const isSelected = selectedItems.includes(itemName);
        
        // ProfileEdit용: 전체 선택 개수로 제한
        if (totalSelections !== undefined) {
            return !isSelected && totalSelections >= maxSelections;
        }
        
        // TastePreference용: 개별 그룹 선택 개수로 제한
        return !isSelected && selectedItems.length >= maxSelections;
    };

    // 행 분할 로직
    const createRows = (): (string | TasteOption)[][] => {
        const { type, rowDistribution } = layout;

        if (type === 'custom' && rowDistribution) {
            // 사용자 정의 행 분배
            const rows: (string | TasteOption)[][] = [];
            let currentIndex = 0;
            
            for (const itemsInRow of rowDistribution) {
                if (currentIndex >= options.length) break;
                rows.push(options.slice(currentIndex, currentIndex + itemsInRow));
                currentIndex += itemsInRow;
            }
            
            // 남은 항목들이 있다면 마지막 행에 추가
            if (currentIndex < options.length) {
                rows.push(options.slice(currentIndex));
            }
            
            return rows;
        }

        // 기본 자동 레이아웃 (4개씩)
        const rows: (string | TasteOption)[][] = [];
        for (let i = 0; i < options.length; i += 4) {
            rows.push(options.slice(i, i + 4));
        }
        return rows;
    };

    // 행별 레이아웃 스타일 결정
    const getRowLayoutStyle = (rowLength: number) => {
        if (layoutType === 'grid') {
            // grid 레이아웃: 2개일 때 grid-cols-2, 4개일 때 grid-cols-4
            if (rowLength === 2) {
                return 'grid grid-cols-2 justify-items-start gap-3';
            } else if (rowLength === 4) {
                return 'grid grid-cols-4 justify-items-start gap-3';
            } else {
                // 3개나 5개 이상일 때는 flex로 처리
                return 'flex flex-row justify-center gap-3';
            }
        } else {
            // flex 레이아웃 (기본값)
            return 'flex flex-row justify-center gap-3';
        }
    };

    const rows = createRows();

    return (
        <div className={`w-full ${className}`}>
            {rows.map((row, index) => (
                <div
                    key={index}
                    className={`${rowGapClasses[rowGap]} w-full ${getRowLayoutStyle(row.length)}`}
                >
                    {row.map((item) => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const isSelected = selectedItems.includes(itemName);
                        const isDisabled = isSelectionDisabled(itemName);

                        return (
                            <SelectableButton
                                key={itemName}
                                selected={isSelected}
                                onClick={() => onToggle(itemName)}
                                className={`${textSizeClasses[textSize]} ${showEmoji ? 'flex items-center space-x-1' : ''}`}
                                disabled={isDisabled}
                            >
                                {showEmoji && typeof item !== 'string' && item.emoji && (
                                    <span>{item.emoji}</span>
                                )}
                                <span>{itemName}</span>
                            </SelectableButton>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default SelectionGrid; 