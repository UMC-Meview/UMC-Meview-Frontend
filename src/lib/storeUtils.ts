// 가게의 averagePositiveScore를 기반으로 레벨 생성 (1-5)
export const getStoreLevel = (averagePositiveScore?: number): number => {
    if (!averagePositiveScore) return 1; // 점수가 없으면 기본 레벨 1

    // 0~10 점수를 5단계로 나누기
    if (averagePositiveScore >= 8) return 5;
    if (averagePositiveScore >= 6) return 4;
    if (averagePositiveScore >= 4) return 3;
    if (averagePositiveScore >= 2) return 2;
    return 1;
};

// 가게 레벨에 따른 아이콘 경로 반환
export const getStoreIconPath = (level: number): string => {
    return `/store/lv${level}-store.svg`;
};

// 가게 레벨에 따른 마크 아이콘 경로 반환
export const getStoreMarkPath = (level: number): string => {
    return `/mark/lv${level}.svg`;
};
