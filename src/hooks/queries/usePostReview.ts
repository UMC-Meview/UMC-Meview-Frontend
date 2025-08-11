import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import {
    ReviewSubmissionRequest,
    ReviewSubmissionResponse,
    ReviewSubmissionError,
} from "../../types/review";
import { AxiosError } from "axios";

const ERROR_MESSAGES = {
    400: "잘못된 요청 데이터입니다. 입력 정보를 확인해주세요.",
    404: "사용자 또는 가게 정보를 찾을 수 없습니다.",
    network: "네트워크 에러가 발생했습니다. 다시 시도해주세요.",
    default: (status: number) => `리뷰 등록 실패 (${status})`,
} as const;

const submitReview = async (
    reviewData: ReviewSubmissionRequest
): Promise<ReviewSubmissionResponse> => {
    try {
        const { data } = await axiosClient.post("/reviews", reviewData);
        return data;
    } catch (error: unknown) {
        console.error("리뷰 등록 API 호출 실패:", error);

        if (error instanceof AxiosError && error.response) {
            const { status, data: errorData } = error.response;
            console.error(`API 에러 - Status: ${status}`, errorData);

            const predefined = (ERROR_MESSAGES as Record<string, unknown>)[
                String(status)
            ];
            const message =
                (typeof predefined === "string" && predefined) ||
                (errorData as { message?: string } | undefined)?.message ||
                ERROR_MESSAGES.default(status);

            throw new Error(message);
        }

        throw new Error(ERROR_MESSAGES.network);
    }
};

export interface UseReviewSubmissionResult {
    submitReview: (data: ReviewSubmissionRequest) => void;
    isLoading: boolean;
    error: ReviewSubmissionError | null;
    isSuccess: boolean;
    data: ReviewSubmissionResponse | undefined;
}

// 리뷰 등록 훅
export const useReviewSubmission = (): UseReviewSubmissionResult => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ReviewSubmissionResponse, Error, ReviewSubmissionRequest>({
        mutationFn: submitReview,
        onSuccess: (_, { userId, storeId }) => {
            // 관련 캐시들을 한 번에 무효화
            queryClient.invalidateQueries({ queryKey: ["userReviews", userId] });
            queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
            queryClient.invalidateQueries({ queryKey: ["store", storeId] });
            queryClient.invalidateQueries({ queryKey: ["stores"] });
        },
        onError: (error) => {
            console.error("리뷰 등록 에러:", error.message);
        },
    });

    return {
        submitReview: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error ? { message: mutation.error.message } : null,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

// 호환성을 위한 기본 export (함수명이 usePostReview가 되도록)
export const usePostReview = useReviewSubmission;