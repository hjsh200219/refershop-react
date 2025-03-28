# Refershop React

쿠팡 API를 활용한 제품 검색 및 분석 React 애플리케이션입니다.

## 주요 기능

- 키워드 기반 제품 검색
- 유튜브 동영상 분석 결과 검색
- 반응형 디자인
- 쿠팡 제품 연동

## 기술 스택

- React
- TypeScript
- Tailwind CSS
- Express.js
- PostgreSQL (Neon)
- 쿠팡 파트너스 API

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/[your-username]/refershop-react.git
cd refershop-react
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
REACT_APP_POSTGRES_URL=your_neon_db_url
REACT_APP_COUPANG_ACCESS_KEY=your_coupang_access_key
REACT_APP_COUPANG_SECRET_KEY=your_coupang_secret_key
REACT_APP_COUPANG_SUB_ID=your_coupang_sub_id
```

4. 개발 서버 실행
```bash
# Express 서버 실행 (3001 포트)
node server.js

# 별도의 터미널에서 React 개발 서버 실행 (3000 포트)
npm start
```

## 프로젝트 구조

```
refershop-react/
├── public/          # 정적 파일
├── src/
│   ├── components/  # 재사용 가능한 컴포넌트
│   ├── pages/       # 페이지 컴포넌트
│   ├── utils/       # 유틸리티 함수
│   └── styles/      # CSS 스타일
├── server.js        # Express 서버
└── .env            # 환경 변수 (git에서 제외됨)
```

## 라이선스

MIT License
