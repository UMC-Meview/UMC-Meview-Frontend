import type { Review } from "../types/review";

// 리뷰 썸네일 결정: 현재는 플레이스홀더를 위해 undefined 반환
export const resolveReviewThumbnail = (_review: Review): string | undefined => {
  void _review;
  return undefined;
};

// 리뷰에서 스토어 ID 안전 추출
export const extractStoreIdFromReview = (review: Review | (Review & { store: unknown })): string => {
  const storeField = (review as unknown as { store: unknown }).store;
  if (typeof storeField === "string") return storeField;
  if (storeField && typeof storeField === "object") {
    const obj = storeField as { _id?: string; id?: string };
    if (typeof obj._id === "string") return obj._id;
    if (typeof obj.id === "string") return obj.id;
  }
  return "";
};

// 주소 축약: 읍/면/동 단위까지
export const truncateAddressToTown = (address?: string): string => {
  if (!address) return "";
  const parts = address.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";

  const collected: string[] = [];
  for (const token of parts) {
    collected.push(token);
    if (/[읍면동]$/.test(token)) break;
    if (collected.length >= 3) break;
  }
  return collected.join(" ");
};