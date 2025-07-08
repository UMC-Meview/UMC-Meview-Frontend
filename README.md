# 폴더 구조

```
src/
├── components/                     # 재사용 가능한 UI 컴포넌트들
│   ├── common/                     # 전체 앱에서 공통으로 사용되는 컴포넌트
│   ├── auth/                       # 로그인, 회원가입 관련 컴포넌트
│   ├── store/                 # 맛집 정보 표시, 등록 관련 컴포넌트
│   ├── review/                     # 리뷰 작성, 표시, 평점 관련 컴포넌트
│   ├── map/                        # 지도, 위치 표시 관련 컴포넌트
│   └── qr/                         # QR 코드 스캔, 생성 관련 컴포넌트
├── pages/                          # 라우팅되는 페이지 컴포넌트들
│   ├── Home/                       # 메인 홈페이지 (지도 중심)
│   ├── Auth/                       # 로그인, 회원가입, 프로필 페이지
│   ├── Store/                 # 맛집 목록, 상세, 등록 페이지
│   ├── Review/                     # 리뷰 목록, 작성, 관리 페이지
│   └── QR/                         # QR 스캔, 메뉴 확인 페이지
├── hooks/                          # 커스텀 React 훅들 (비즈니스 로직 재사용)
├── services/                       # 외부 API 및 서비스 연동 로직
│   ├── api/                        # REST API 호출 함수들
│   ├── map/                        # 지도 서비스 (구글맵, 카카오맵 등) 연동
│   └── storage/                    # 로컬스토리지, 세션스토리지 관리
├── store/                          # 전역 상태 관리 (Zustand, Redux 등)
├── types/                          # TypeScript 타입 정의 파일들
├── utils/                          # 유틸리티 함수들 (헬퍼, 포맷터, 검증 등)
├── assets/                         # 정적 파일들 (이미지, 아이콘, 폰트)
│   ├── images/                     # 맛집 이미지, 배경 이미지 등
│   ├── icons/                      # 아이콘 파일들 (SVG, PNG)
│   └── fonts/                      # 웹폰트 파일들
├── router/                         # React Router 설정 및 라우팅 관리
├── context/                        # React Context API (인증, 테마 등)
└── config/                         # 환경 설정, API 엔드포인트, 상수 등
```
