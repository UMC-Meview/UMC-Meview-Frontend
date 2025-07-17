import { useState } from 'react';

interface UseMultiSelectProps {
    maxSelections: number;
}

export const useMultiSelect = ({ maxSelections }: UseMultiSelectProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const toggleItem = (item: string) => {
        setSelectedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : prev.length < maxSelections
                    ? [...prev, item]
                    : prev
        );
    };

    return {
        selectedItems,
        toggleItem
    };
}; 