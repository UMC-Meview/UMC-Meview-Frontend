import { axiosClient } from "../services/apis/axiosClients";
import { queryClient } from "./queryClient";
import { clearReviewDraft, getReviewDraft } from "../utils/auth";

interface ImageUploadResponse {
  url: string;
}

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = /data:(.*?);base64/.exec(header || "");
  const mime = mimeMatch?.[1] || "application/octet-stream";
  
  // base64 문자열 유효성 검사 및 오류 처리
  if (!base64 || base64.trim() === "") {
    throw new Error("Invalid base64 data: empty or undefined");
  }
  
  try {
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i);
    return new Blob([buffer], { type: mime });
  } catch (error) {
    console.error("Failed to decode base64 data:", error);
    throw new Error(`Invalid base64 data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const submitDraftReview = async (userId: string): Promise<boolean> => {
  const draft = getReviewDraft();
  if (!draft) return false;

  try {
    // 업로드 (Data URL -> Blob) - 병렬 처리로 성능 개선
    const uploadPromises = (draft.imageDataUrls || []).map(async (dataUrl, index) => {
      try {
        const blob = dataUrlToBlob(dataUrl);
        const formData = new FormData();
        formData.append("file", blob, "image.png");
        const { data } = await axiosClient.post<ImageUploadResponse>("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return data.url;
      } catch (error) {
        console.error(`Failed to process image ${index + 1}:`, error);
        // 개별 이미지 실패 시 null 반환하여 필터링할 수 있도록 함
        return null;
      }
    });
    const imageResults = await Promise.all(uploadPromises);
    const imageUrls: string[] = imageResults.filter((url): url is string => url !== null);

    // 리뷰 제출
    await axiosClient.post("/reviews", {
      storeId: draft.storeId,
      userId,
      isPositive: draft.isPositive,
      score: draft.score,
      foodReviews: draft.foodReviews,
      storeReviews: draft.storeReviews,
      imageUrls,
    });

    // 관련 캐시 무효화는 실패해도 무시
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["userReviews", userId] }),
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
      queryClient.invalidateQueries({ queryKey: ["store", draft.storeId] }),
      queryClient.invalidateQueries({ queryKey: ["stores"] }),
    ]).catch(() => undefined);

    clearReviewDraft();
    return true;
  } catch (e) {
    // 제출 실패 시 임시 데이터는 유지하여 재시도 가능
    console.error("임시 리뷰 전송 실패", e);
    return false;
  }
};


