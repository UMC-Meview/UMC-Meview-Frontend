import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";

export interface ImageUploadResponse {
    url: string; // 업로드된 이미지의 URL
}

export interface UseImageUploadResult {
    uploadImage: (file: File) => void;
    uploadImageAsync: (file: File) => Promise<ImageUploadResponse>;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: string | null;
    data: ImageUploadResponse | undefined;
    reset: () => void;
}
/**
 * 이미지 업로드 mutation 훅
 */
export const usePostImageUpload = (): UseImageUploadResult => {
    const mutation = useMutation<ImageUploadResponse, Error, File>({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosClient.post<ImageUploadResponse>(
                "/upload",
                formData
            );
            return response.data;
        },
        onSuccess: () => {
            // console.log("이미지 업로드 성공:", data);
        },
        onError: (error) => {
            console.error("이미지 업로드 실패:", error);
        },
    });

    return {
        uploadImage: mutation.mutate,
        uploadImageAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        error: mutation.error?.message || null,
        data: mutation.data,
        reset: mutation.reset,
    };
};
