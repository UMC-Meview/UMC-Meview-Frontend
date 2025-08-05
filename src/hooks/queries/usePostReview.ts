import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import {
    ReviewSubmissionRequest,
    ReviewSubmissionResponse,
    ReviewSubmissionError,
} from "../../types/review";
import { AxiosError } from "axios";

// 리뷰 등록 API 요청 함수
const submitReview = async (
    reviewData: ReviewSubmissionRequest
): Promise<ReviewSubmissionResponse> => {
    try {
        const response = await axiosClient.post("/reviews", reviewData);
        return response.data;
    } catch (error: unknown) {
        console.error("리뷰 등록 API 호출 실패:", error);

        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            console.error(`API 에러 - Status: ${status}`, errorData);

            // 400 Bad Request: 잘못된 요청 데이터
            if (status === 400) {
                throw new Error("잘못된 요청 데이터입니다. 입력 정보를 확인해주세요.");
            }

            // 404 Not Found: 존재하지 않는 사용자 또는 가게
            if (status === 404) {
                throw new Error("사용자 또는 가게 정보를 찾을 수 없습니다.");
            }

            throw new Error(errorData?.message || `리뷰 등록 실패 (${status})`);
        }

        throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
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
    const mutation = useMutation<ReviewSubmissionResponse, Error, ReviewSubmissionRequest>({
        mutationFn: submitReview,
        onSuccess: (data) => {
            console.log("리뷰 등록 성공:", data);
            alert("리뷰 작성 완료!");
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