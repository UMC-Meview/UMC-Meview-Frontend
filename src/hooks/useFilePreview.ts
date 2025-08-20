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

    const url = URL.createObjectURL(file);
    setSrc(url);

    return () => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    };
  }, [file]);

  return src;
}


