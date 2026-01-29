# LINK-US 프로젝트 코딩 가이드 (비전공자용)

이 문서는 **LINK-US** 프로젝트의 소스 코드를 하나하나 뜯어보며, 어떤 파일이 무슨 역할을 하는지 아주 쉽게 설명합니다. 코드가 어렵게 느껴져도 걱정 마세요! 비유를 통해 설명해 드릴게요.

---

## 🎨 1부: 프론트엔드 (Frontend) - 화면을 만드는 곳

프론트엔드는 사용자가 눈으로 보고 클릭하는 **웹사이트의 얼굴**입니다. `frontend` 폴더 안을 여행해 봅시다.

### 📂 폴더 구조 훑어보기
먼저 중요한 폴더와 파일들입니다.

- **`index.html`**: 웹사이트의 **대문**입니다.
- **`src/` (Source의 약자)**: **요리 재료 창고**입니다. 실제 개발자가 작성한 모든 코드는 여기에 있습니다.
- **`public/`**: **전시관**입니다. 이미지나 아이콘 같이 그대로 보여줄 파일들을 넣습니다.
- **`node_modules/`**: **공구함**입니다. 남들이 만들어둔 유용한 도구(라이브러리)들이 잔뜩 들어있습니다. (엄청 무겁습니다!)

---

### 1️⃣ index.html: 웹사이트의 뼈대 (Bone)
> 위치: `frontend/index.html`

이 파일은 **빈 캔버스**와 같습니다. 브라우저가 가장 먼저 읽는 파일이지만, 내용물은 거의 없습니다.

```html
<body>
  <div id="root"></div> <!-- 👈 여기가 핵심! -->
  <script type="module" src="/src/main.tsx"></script>
</body>
```

- **`div id="root"`**: 이 태그는 텅 빈 액자입니다. 리액트(React)가 이 안에다가 화려한 그림(웹사이트 화면)을 그려넣게 됩니다.
- **`script ... src="/src/main.tsx"`**: "자, 이제 `main.tsx`라는 코드를 실행해서 그림을 그리기 시작해!"라고 명령하는 버튼입니다.

---

### 2️⃣ src/main.tsx: 시동 걸기 (Engine Start)
> 위치: `frontend/src/main.tsx`

이 파일은 **리액트 앱의 시동 버튼**입니다. `index.html`에서 불려와서 실제로 작동합니다.

```tsx
createRoot(document.getElementById('root')!).render(
  <App />
)
```

- **설명:** "index.html에 있던 `root`라는 빈 액자를 찾아서, 그 안에 `<App />`이라는 것을 그려라!" 라는 뜻입니다.
- 여기서 `<App />`은 우리 웹사이트의 **전체 덩어리**입니다.

---

### 3️⃣ src/App.tsx: 교통 정리 (Traffic Controller)
> 위치: `frontend/src/App.tsx`

이 파일은 **지휘 본부**입니다. 사용자가 어떤 버튼을 눌렀는지에 따라 **어떤 화면을 보여줄지 결정**합니다.

```tsx
function AppContent() {
  // 상태(State): 현재 어떤 상황인지 기억하는 변수들
  const [nationality, setNationality] = useState(null) // 국적 (한국인? 외국인?)
  const [currentPage, setCurrentPage] = useState('landing') // 현재 페이지 (대문? 게시판?)

  // 조건에 따라 다른 화면 보여주기 (If-Else)
  return (
    <>
      {/* 1. 아직 국적 선택 안 했으면 -> 랜딩 페이지 보여줘 */}
      {currentPage === 'landing' && (
        <LandingPage onSelect={handleNationalitySelect} />
      )}

      {/* 2. 대시보드 페이지라면 -> 대시보드 보여줘 */}
      {currentPage === 'dashboard' && (
        <Dashboard ... />
      )}
    </>
  )
}
```

- **역활:** 마치 TV 리모컨 같습니다. 1번 누르면 뉴스, 2번 누르면 예능이 나오듯이, `currentPage`라는 변수가 바뀌면 화면이 `LandingPage`에서 `Dashboard`로 휙 바뀝니다.

---

### 4️⃣ src/pages/LandingPage.tsx: 실제 화면 (Scene)
> 위치: `frontend/src/pages/LandingPage.tsx`

이제 진짜 화면을 봅니다. 여러분이 접속했을 때 처음 보는 **"LINK-US 로고가 있고 국적을 선택하는 화면"**입니다.

```tsx
function LandingPage({ onSelect }) {
    return (
        <div className="landing-page">
            {/* 1. 로고와 설명 */}
            <h1>LINK-US</h1>
            <p>외국인 유학생과 재학생을 연결합니다.</p>

            {/* 2. 국적 선택 카드들 */}
            <div className="nationality-cards">
                {/* 한국인 카드 클릭하면 -> onSelect('korean') 실행 */}
                <div onClick={() => onSelect('korean')}>
                    <h3>한국인 학생</h3>
                </div>

                {/* 외국인 카드 클릭하면 -> onSelect('foreigner') 실행 */}
                <div onClick={() => onSelect('foreigner')}>
                    <h3>International Student</h3>
                </div>
            </div>
        </div>
    )
}
```

- **HTML과 비슷하죠?**: 리액트는 자바스크립트 안에서 HTML처럼 생긴 코드(JSX라고 부릅니다)를 써서 화면을 만듭니다.
- **`onClick`**: "클릭했을 때 할 일"을 정해주는 리모컨 버튼입니다. 여기서는 "나 한국인이야!"라고 `App.tsx`에게 신호를 보냅니다.

---

## 🎨 요약: 프론트엔드의 흐름

1. 사용자가 접속하면 **`index.html`**이 열립니다.
2. **`main.tsx`**가 실행되어 리액트를 켭니다.
3. **`App.tsx`**가 나타나서 "처음 왔으니까 **`LandingPage`**를 보여줘야지" 하고 결정합니다.
4. 사용자가 `LandingPage`에서 "한국인" 버튼을 누릅니다.
5. **`App.tsx`**가 이를 감지하고 "OK, 그럼 이제 **`Dashboard`** 페이지로 바꿔줄게" 하고 화면을 갈아입힙니다.

이것이 바로 깜빡임 없이 부드럽게 화면이 넘어가는 **One Page App (SPA)**의 원리입니다.

---

## (다음 편 예고) 2부: 백엔드 (Backend)
다음은 프론트엔드가 "데이터 주세요!" 할 때 응답하는 주방, **백엔드** 코드를 뜯어보겠습니다.
