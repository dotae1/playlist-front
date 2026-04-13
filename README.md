# AI Playlist - Frontend

분위기를 입력하면 AI가 Spotify 플레이리스트를 추천해주는 웹 애플리케이션의 프론트엔드입니다.

## 기술 스택

- **React 19**
- **Vite 8**
- **CSS Modules**

## 주요 기능

- 분위기/감정 텍스트 입력으로 플레이리스트 생성 요청
- 예시 프롬프트 칩 버튼 제공
- 곡 수 선택 (5 / 10 / 15 / 20곡)
- 결과 표시 시 폼(왼쪽) + 트랙 리스트(오른쪽) 2컬럼 레이아웃
- 900px 이하 반응형 세로 배치
- Spotify 트랙 링크 연결

## 백엔드 연동

백엔드 서버(`localhost:8080`)와 Vite 프록시로 연결됩니다.

- API: `POST /api/v1/playlist`
- Request: `{ prompt: string, songCount: number }`
- Response: `{ playlistTitle: string, tracks: Track[] }`

## 실행 방법

```bash
npm install
npm run dev
```

> 백엔드 서버가 먼저 실행 중이어야 합니다.
