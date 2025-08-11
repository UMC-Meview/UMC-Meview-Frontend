import { useEffect, useState } from "react";

/**
 * 파일을 Data URL(base64)로 변환하여 미리보기 src를 반환합니다.
 * StrictMode에서의 객체 URL 이슈 및 즉시 revoke 레이스를 회피합니다.
 */
export function useFilePreview(file?: File | null): string | undefined {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    if (!file) {
      setSrc(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);

    return () => {
      // 읽기 중 컴포넌트가 언마운트될 경우를 대비해 abort
      try {
        reader.abort();
      } catch {
        // 이미 완료되었으면 무시
      }
    };
  }, [file]);

  return src;
}


