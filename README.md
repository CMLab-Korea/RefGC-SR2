# RefGC-SR² Project Page

NeurIPS 2026 paper의 프로젝트 페이지입니다.

## 디렉토리 구조

```
refgc-sr2-page/
├── index.html                    # 메인 페이지
├── static/
│   ├── css/style.css             # 스타일 (frequency theme)
│   ├── js/main.js                # 인터랙션 (copy btn, fade-in)
│   ├── images/                   # 페이지에 표시할 이미지
│   │   ├── teaser.png            # Fig 1 — 본인 paper teaser
│   │   ├── dataset_pipeline.png  # Fig 2 — 데이터셋 구축 파이프라인
│   │   ├── model_overview.png    # Fig 4 — 모델 overview
│   │   └── qualitative.png       # Fig 6 — qualitative 결과
│   ├── videos/                   # (선택) 비디오 파일
│   └── pdfs/
│       └── refgc-sr2.pdf         # 본인 paper PDF
└── README.md
```

## 사용 방법

### 1. 이미지 준비 (필수)

본인 paper의 figure들을 PNG로 추출하여 `static/images/`에 넣으세요:

| 페이지 위치 | 파일명 | 본인 paper 출처 |
|---|---|---|
| Teaser | `teaser.png` | paper Figure 1 (1페이지) |
| Dataset section | `dataset_pipeline.png` | paper Figure 2 |
| Model section | `model_overview.png` | paper Figure 4 |
| Results section | `qualitative.png` | paper Figure 6 |

PDF에서 figure 추출은 다음 도구 중 선택:
- **Adobe Acrobat** → 페이지 자르기/내보내기
- **macOS Preview** → 영역 선택 후 스크린샷
- **ImageMagick**: `convert -density 300 paper.pdf[0] -trim teaser.png`
- **pdf2image (Python)**: `pdf2image.convert_from_path('paper.pdf')`

### 2. PDF 배치

본인 paper PDF를 `static/pdfs/refgc-sr2.pdf` 경로에 넣으세요.

### 3. 로컬 미리보기

```bash
cd refgc-sr2-page
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 열기
```

### 4. GitHub Pages 배포

```bash
git init
git add .
git commit -m "Initial project page"
git remote add origin https://github.com/<your-handle>/refgc-sr2.git
git push -u origin main
```

GitHub repo의 Settings → Pages에서 `main` branch / `/` (root)로 설정.

### 5. 커스터마이즈 포인트

- **저자 공개 시**: `index.html`의 `<div class="authors">` 부분 수정
- **arXiv 링크**: `index.html` 검색 `href="#"` → 실제 링크
- **GitHub repo**: 동일
- **HuggingFace dataset**: 동일
- **색상 변경**: `style.css` 상단 `:root` 변수 수정
  - `--color-lf`: low-frequency 색상 (현재 blue)
  - `--color-hf`: high-frequency 색상 (현재 pink)
  - `--color-mid`: 중간 색상 (현재 purple)

## 디자인 컨셉

본인 paper의 핵심 통찰인 **frequency-aware** 아이디어를 페이지 디자인에 반영:

- **Title gradient**: LF blue → HF pink (페이지 상단 4px 라인 + 메인 title)
- **Animated subtitle**: 단어별 fade-in, "Super-Resolution" 파랑 / "Refinement" 핑크
- **Design cards**: LF/HF 카드가 각각 다른 border-top 색
- **User study stats**: gradient text로 강조
- **Contribution cards**: hover시 LF→HF 그라데이션 라인 등장

## 페이지 섹션 흐름

1. **Hero**: NeurIPS badge + 애니메이션 title + action buttons
2. **TL;DR + Teaser**: 한 문단 요약 + Fig 1
3. **Key Contributions**: 3개 카드 (Task / Dataset / Model)
4. **Positioning Table**: 8개 관련 task 비교표 + Ours
5. **Dataset Construction**: Stage 1+2 pipeline + DipRefGC insight box
6. **Model**: FreqMoLE + Loss + LF/HF design cards + formula
7. **Results**: Qualitative figure + Quant table + User study
8. **Abstract**: 본인 paper abstract 그대로
9. **BibTeX**: copy 가능
10. **Footer**: template credits
