import { useCallback, useMemo, useState } from 'react';

interface UseMultiSelectProps {
    maxSelections: number;
}

export const useMultiSelect = ({ maxSelections }: UseMultiSelectProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const toggleItem = useCallback((item: string) => {
        setSelectedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : prev.length < maxSelections
                    ? [...prev, item]
                    : prev
        );
    }, [maxSelections]);

    const clear = useCallback(() => {
        setSelectedItems([]);
    }, []);

    return useMemo(() => ({
        selectedItems,
        toggleItem,
        clear
    }), [selectedItems, toggleItem, clear]);
}; 