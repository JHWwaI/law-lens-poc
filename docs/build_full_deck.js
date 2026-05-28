// Full Portfolio Section — Law-Lens + VoidTrace
// v4 design (cream + burgundy + Georgia) — Cover + TOC + 5 Law-Lens + 3 VoidTrace
const pptxgen = require("pptxgenjs");
const path = require("path");

const BG       = "FAFAF7";
const INK      = "0F172A";
const INK_SOFT = "1F2937";
const SUB      = "475569";
const MUTED    = "94A3B8";
const RULE     = "D9D4C9";
const RULE_SOFT= "EBE7DE";
// ── Monochromatic burgundy progression (01 darkest → 05 lightest) ──
const ACCENT    = "3E0F19";   // 01 Law-Lens   — Deepest wine
const ACCENT_V  = "5A1B27";   // 02 VoidTrace  — Deep burgundy
const ACCENT_W  = "6E232F";   // 03 Widea      — Classic burgundy
const ACCENT_T  = "9C4856";   // 04 Try-On     — Rose burgundy
const ACCENT_B  = "C8838E";   // 05 VoiceBridge — Dusty rose

// soft variants (각 색의 옅은 배경)
const ACCENT_SOFT    = "EDDEE1";
const ACCENT_V_SOFT  = "EEDEE2";
const ACCENT_W_SOFT  = "F2E6E8";
const ACCENT_T_SOFT  = "F5E5E8";
const ACCENT_B_SOFT  = "FAEDEF";

const FONT_H = "Georgia";
const FONT_B = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "이재환 포트폴리오";
pres.author = "JHWwaI";

const W = 13.3, H = 7.5, PAD = 0.6;
const TOTAL = 21;

// ── shared decorators (project header) ──
function frame(slide, projectMark, projectSub, accent) {
  slide.background = { color: BG };
  // 좌상단 액센트 바 — 프로젝트별 색 시그니처
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: accent }, line: { type: "none" },
  });
  slide.addText(projectMark, {
    x: PAD, y: 0.3, w: 7, h: 0.35,
    fontFace: FONT_H, fontSize: 13, color: accent, bold: true, charSpacing: 6, margin: 0,
  });
  slide.addText(projectSub, {
    x: PAD, y: 0.3, w: W - PAD * 2, h: 0.35,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", italic: true, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: PAD, y: 0.75, w: W - PAD * 2, h: 0, line: { color: accent, width: 1.2 },
  });
}
function footer(slide, n) {
  slide.addShape(pres.shapes.LINE, {
    x: PAD, y: H - 0.55, w: W - PAD * 2, h: 0, line: { color: RULE, width: 0.5 },
  });
  slide.addText("이재환  ·  포트폴리오 2026", {
    x: PAD, y: H - 0.45, w: 6, h: 0.3, fontFace: FONT_B, fontSize: 12, color: MUTED, margin: 0,
  });
  slide.addText(`${n} / ${TOTAL}`, {
    x: W - 2, y: H - 0.45, w: 1.5, h: 0.3,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", margin: 0,
  });
}
function pageTitle(slide, big, sub, y = 1.0) {
  slide.addText(big, {
    x: PAD, y, w: W - PAD * 2, h: 0.85,
    fontFace: FONT_H, fontSize: 38, color: INK, bold: true, margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: PAD, y: y + 0.9, w: W - PAD * 2, h: 0.45,
      fontFace: FONT_B, fontSize: 16, color: SUB, italic: true, margin: 0,
    });
  }
}
function vRule(s, x, y, h) {
  s.addShape(pres.shapes.LINE, { x, y, w: 0, h, line: { color: RULE_SOFT, width: 0.5 } });
}
function hRule(s, x, y, w) {
  s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: RULE_SOFT, width: 0.5 } });
}
function eyebrow(s, x, y, w, text, accent = ACCENT) {
  s.addText(text.toUpperCase(), {
    x, y, w, h: 0.35,
    fontFace: FONT_B, fontSize: 13, color: accent, bold: true, charSpacing: 4, margin: 0,
  });
}

// Tech stack chip — pill style, accent-soft fill
function chip(s, x, y, w, h, text, accent, accentSoft) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: accentSoft }, line: { color: accent, width: 0.5 },
  });
  s.addText(text, {
    x, y, w, h,
    fontFace: FONT_B, fontSize: 11.5, color: accent, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
}

// User Flow step — circle + label + sub
function flowStep(s, x, y, w, num, head, body, accent) {
  s.addShape(pres.shapes.OVAL, {
    x: x + (w - 0.5) / 2, y, w: 0.5, h: 0.5,
    fill: { color: accent }, line: { type: "none" },
  });
  s.addText(num, {
    x: x + (w - 0.5) / 2, y, w: 0.5, h: 0.5,
    fontFace: FONT_H, fontSize: 18, color: "FFFFFF", bold: true,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText(head, {
    x, y: y + 0.6, w, h: 0.35,
    fontFace: FONT_H, fontSize: 14, color: INK, bold: true, align: "center", margin: 0,
  });
  s.addText(body, {
    x, y: y + 0.95, w, h: 0.55,
    fontFace: FONT_B, fontSize: 11, color: SUB, align: "center", margin: 0,
  });
}

// Flow arrow between steps
function flowArrow(s, x, y, w) {
  s.addShape(pres.shapes.LINE, {
    x, y: y + 0.25, w, h: 0,
    line: { color: MUTED, width: 1.2, endArrowType: "triangle" },
  });
}

// ════════════════════════════════════════════════════════════════════
// Slide 1 — Cover
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, {
    x: PAD, y: 0.6, w: 0.6, h: 0.05, fill: { color: ACCENT }, line: { type: "none" },
  });
  s.addText("PORTFOLIO  ·  2026", {
    x: PAD, y: 0.8, w: 8, h: 0.4,
    fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, charSpacing: 8, margin: 0,
  });
  s.addText([
    { text: "Practice Made ", options: {} },
    { text: "Precise.", options: { italic: true } },
  ], {
    x: PAD, y: 2.4, w: W - PAD * 2, h: 1.6,
    fontFace: FONT_H, fontSize: 68, color: INK, bold: true, margin: 0,
  });
  s.addText("AI Agent 백엔드 개발자 · 이재환", {
    x: PAD, y: 4.2, w: W - PAD * 2, h: 0.6,
    fontFace: FONT_B, fontSize: 22, color: INK_SOFT, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: PAD, y: 5.0, w: 2.0, h: 0, line: { color: ACCENT, width: 1.5 },
  });
  s.addText("github.com/JHWwaI  ·  dolchi37@gmail.com", {
    x: PAD, y: 5.2, w: W - PAD * 2, h: 0.4,
    fontFace: FONT_B, fontSize: 14, color: SUB, italic: true, margin: 0,
  });
  s.addText("Law-Lens · VoidTrace · Widea · Try-On · VoiceBridge", {
    x: PAD, y: H - 0.7, w: W - PAD * 2, h: 0.3,
    fontFace: FONT_B, fontSize: 11, color: MUTED, align: "right", charSpacing: 3, margin: 0,
  });
}

// ════════════════════════════════════════════════════════════════════
// Slide 2 — TOC
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("PORTFOLIO  ·  CONTENTS", {
    x: PAD, y: 0.3, w: 8, h: 0.35,
    fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, charSpacing: 6, margin: 0,
  });
  s.addText("이재환  ·  2026", {
    x: PAD, y: 0.3, w: W - PAD * 2, h: 0.35,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", italic: true, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: PAD, y: 0.75, w: W - PAD * 2, h: 0, line: { color: RULE, width: 0.5 },
  });
  pageTitle(s, "목차", "5개 프로젝트 — 핵심만 골라 담은 작업물");

  const projects = [
    { n: "01", t: "Law-Lens AI",       sub: "Llama-3 QLoRA + FAISS RAG 하도급법 진단",
      tag: "Spring · FastAPI · 운영 안전장치", pg: "p. 03", acc: ACCENT  },
    { n: "02", t: "VoidTrace",         sub: "ISMS-P 대응 Kubernetes 통합 보안 자동화 (논문 4편)",
      tag: "kube-bench · Falco · Gemini · ELK", pg: "p. 08", acc: ACCENT_V },
    { n: "03", t: "Widea",             sub: "검증 사례 RAG + 한국 컨텍스트 + 워크스페이스 + Whisper",
      tag: "Next.js 16 · Express · Pinecone RAG", pg: "p. 13", acc: ACCENT_W },
    { n: "04", t: "Virtual Try-On",    sub: "AI 가상 착장 멀티모델 파이프라인",
      tag: "YOLO · OpenPose · VITON", pg: "p. 16", acc: ACCENT_T },
    { n: "05", t: "VoiceBridge",       sub: "사용자 음성 복제 Discord 봇 (Tier 1·2·3 등록 구조)",
      tag: "XTTS v2 · Colab · asyncio Queue", pg: "p. 19", acc: ACCENT_B },
  ];

  const startY = 2.6;
  const rowH = 0.85;
  projects.forEach((p, i) => {
    const y = startY + i * rowH;
    s.addText(p.n, {
      x: PAD, y, w: 1.1, h: 0.55,
      fontFace: FONT_H, fontSize: 32, color: p.acc, bold: true, italic: true, margin: 0,
    });
    s.addText(p.t, {
      x: PAD + 1.1, y, w: 4.0, h: 0.4,
      fontFace: FONT_H, fontSize: 21, color: INK, bold: true, margin: 0,
    });
    s.addText(p.sub, {
      x: PAD + 1.1, y: y + 0.42, w: 7.5, h: 0.3,
      fontFace: FONT_B, fontSize: 13, color: INK_SOFT, margin: 0,
    });
    s.addText(p.tag, {
      x: 9.0, y: y + 0.08, w: 3.0, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: SUB, italic: true, align: "right", margin: 0,
    });
    s.addText(p.pg, {
      x: W - 1.3, y: y + 0.08, w: 1.0, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: p.acc, bold: true, align: "right", margin: 0,
    });
    if (i < projects.length - 1) hRule(s, PAD, y + 0.78, W - PAD * 2);
  });

  // footer (different — TOC variant)
  s.addShape(pres.shapes.LINE, {
    x: PAD, y: H - 0.55, w: W - PAD * 2, h: 0, line: { color: RULE, width: 0.5 },
  });
  s.addText("이재환  ·  포트폴리오 2026", {
    x: PAD, y: H - 0.45, w: 6, h: 0.3, fontFace: FONT_B, fontSize: 12, color: MUTED, margin: 0,
  });
  s.addText("2 / " + TOTAL, {
    x: W - 2, y: H - 0.45, w: 1.5, h: 0.3,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", margin: 0,
  });
}

// ════════════════════════════════════════════════════════════════════
// ────── PROJECT 01 — Law-Lens AI (5 slides) ──────
// ════════════════════════════════════════════════════════════════════
const LL_MARK = "01  ·  LAW-LENS AI";
const LL_SUB  = "Subcontract Risk Detector";

// Slide 3 — Law-Lens Overview (with User Flow + Tech Chips)
{
  const s = pres.addSlide();
  frame(s, LL_MARK, LL_SUB, ACCENT);
  pageTitle(s, "Law-Lens AI",
    "Llama-3 QLoRA + FAISS RAG · Spring + FastAPI 2-Tier 진단 서비스");

  // ─── Architecture (compact, top) ───
  const archY = 2.55;
  eyebrow(s, PAD, archY, 6, "Architecture", ACCENT);
  const aBoxes = [
    { x: PAD,        y: archY + 0.4, w: 2.7, h: 1.0, head: "Browser",      body: "Thymeleaf UI" },
    { x: PAD + 2.95, y: archY + 0.4, w: 3.5, h: 1.0, head: "Spring Boot",  body: "JPA · Redis · Resilience4j", filled: true },
    { x: PAD + 6.7,  y: archY + 0.4, w: 3.0, h: 1.0, head: "FastAPI",      body: "Llama-3 · QLoRA · FAISS" },
  ];
  aBoxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: b.y, w: b.w, h: b.h,
      fill: { color: b.filled ? INK : BG },
      line: { color: b.filled ? INK : RULE, width: 0.75 },
    });
    s.addText(b.head, { x: b.x + 0.2, y: b.y + 0.15, w: b.w - 0.4, h: 0.4,
      fontFace: FONT_H, fontSize: 16, color: b.filled ? "FFFFFF" : INK, bold: true, margin: 0 });
    s.addText(b.body, { x: b.x + 0.2, y: b.y + 0.55, w: b.w - 0.4, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: b.filled ? "C7CBD1" : SUB, margin: 0 });
  });
  [{ x: PAD + 2.7,  lab: "HTTP" }, { x: PAD + 6.45, lab: "WebClient" }].forEach((a) => {
    s.addShape(pres.shapes.LINE, {
      x: a.x, y: archY + 0.95, w: 0.25, h: 0,
      line: { color: INK, width: 1.5, endArrowType: "triangle" },
    });
    s.addText(a.lab, { x: a.x - 0.2, y: archY + 0.55, w: 0.7, h: 0.22,
      fontFace: FONT_B, fontSize: 9, color: MUTED, align: "center", italic: true, margin: 0 });
  });
  // Right-side rationale strip
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.95, y: archY + 0.4, w: 2.85, h: 1.0,
    fill: { color: ACCENT_SOFT }, line: { type: "none" },
  });
  s.addText("WHY SPLIT", { x: 10.1, y: archY + 0.45, w: 2.6, h: 0.25,
    fontFace: FONT_B, fontSize: 10, color: ACCENT, bold: true, charSpacing: 3, margin: 0 });
  s.addText("8B 모델은 Java에 못 끼움.\n장애 폭발 반경 분리 + 서로 다른 운영 주기.", {
    x: 10.1, y: archY + 0.72, w: 2.6, h: 0.65,
    fontFace: FONT_B, fontSize: 11, color: INK_SOFT, margin: 0 });

  // ─── User Flow (middle, prominent) ───
  const ufY = 4.2;
  eyebrow(s, PAD, ufY, 6, "User Flow  ·  사용자 흐름", ACCENT);
  const fW = (W - PAD * 2) / 4 - 0.15;
  const fSteps = [
    { num: "1", head: "수급사업자", body: "변호사 자문 없이 사실관계 입력" },
    { num: "2", head: "AI 진단",   body: "QLoRA + RAG로 위반 조항 추정" },
    { num: "3", head: "결과 확인", body: "법령 근거 + 상세 사유 + 신뢰도" },
    { num: "4", head: "이력 조회", body: "조항별 카운트 통계 + 시계열" },
  ];
  fSteps.forEach((st, i) => {
    const x = PAD + i * (fW + 0.2);
    flowStep(s, x, ufY + 0.45, fW, st.num, st.head, st.body, ACCENT);
    if (i < fSteps.length - 1) flowArrow(s, x + fW + 0.02, ufY + 0.45, 0.16);
  });

  // ─── Tech Stack chips ───
  const tsY = 6.4;
  eyebrow(s, PAD, tsY, 6, "Tech Stack", ACCENT);
  const chips = [
    "Spring Boot 3.3", "Java 17", "JPA · Hibernate", "Thymeleaf",
    "FastAPI", "Llama-3-Open-Ko-8B", "QLoRA", "FAISS",
    "Redis", "Resilience4j", "Micrometer", "Docker Compose",
  ];
  const chipW = (W - PAD * 2) / 6 - 0.1;
  const chipH = 0.32;
  chips.forEach((t, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    const x = PAD + col * (chipW + 0.12);
    const y = tsY + 0.4 + row * (chipH + 0.08);
    chip(s, x, y, chipW, chipH, t, ACCENT, ACCENT_SOFT);
  });
  footer(s, 3);
}

// Slide 4 — Law-Lens 성능과 검증
{
  const s = pres.addSlide();
  frame(s, LL_MARK, LL_SUB, ACCENT);
  pageTitle(s, "성능과 검증", "학습 외 평가셋 200건 · CI에서 PR마다 자동 실행");

  const stY = 2.7;
  const stats = [
    { v: "−96.7%", label: "Training Loss",      sub: "3.1973 → 0.1055" },
    { v: "94.8%",  label: "Inference Accuracy", sub: "평가셋 200건 · exact match" },
    { v: "< 1%",   label: "Hallucination",      sub: "화이트리스트 차단" },
  ];
  const cw = (W - PAD * 2) / 3;
  stats.forEach((st, i) => {
    const x = PAD + i * cw;
    if (i > 0) vRule(s, x, stY, 1.8);
    s.addText(st.label.toUpperCase(), { x: x + 0.35, y: stY + 0.05, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: MUTED, charSpacing: 4, bold: true, margin: 0 });
    s.addText(st.v, { x: x + 0.35, y: stY + 0.5, w: cw - 0.55, h: 1.1,
      fontFace: FONT_H, fontSize: 54, color: INK, bold: true, margin: 0 });
    s.addText(st.sub, { x: x + 0.35, y: stY + 1.65, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });
  hRule(s, PAD, 4.85, W - PAD * 2);

  const tcY = 5.0;
  eyebrow(s, PAD, tcY, 9, "In Practice  ·  학습 외 사실관계 검증", ACCENT);
  const cases = [
    { tag: "제11조",    legal: "부당한 대금 감액",  fact: "경영난 이유로 대금 10% 일방 삭감.", reason: "자금 사정은 정당 사유 아님" },
    { tag: "제3조",     legal: "서면 발급 의무",    fact: "작업 시작 전까지 계약서 미발급.",   reason: "착수 전 서면 교부는 필수" },
    { tag: "제12조의3", legal: "기술유용 금지",     fact: "기술 자료를 협의 없이 제3자 유출.", reason: "징벌적 손해배상 대상" },
  ];
  cases.forEach((c, i) => {
    const x = PAD + i * cw;
    const yy = tcY + 0.45;
    const hh = 1.8;
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.05, y: yy, w: cw - 0.25, h: hh,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.3, y: yy + 0.22, w: 1.35, h: 0.42,
      fill: { color: ACCENT_SOFT }, line: { type: "none" } });
    s.addText(c.tag, { x: x + 0.3, y: yy + 0.22, w: 1.35, h: 0.42,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(c.legal, { x: x + 1.75, y: yy + 0.22, w: cw - 2.0, h: 0.42,
      fontFace: FONT_B, fontSize: 13, color: INK_SOFT, bold: true, valign: "middle", margin: 0 });
    s.addText(c.fact, { x: x + 0.3, y: yy + 0.8, w: cw - 0.55, h: 0.45,
      fontFace: FONT_B, fontSize: 13.5, color: INK, italic: true, margin: 0 });
    s.addText("→  " + c.reason, { x: x + 0.3, y: yy + 1.3, w: cw - 0.55, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, margin: 0 });
  });
  footer(s, 4);
}

// Slide 5 — Law-Lens Web UI Showcase
{
  const s = pres.addSlide();
  frame(s, LL_MARK, LL_SUB, ACCENT);
  pageTitle(s, "Web UI", "사실관계 입력 → 진단 결과 → 이력 통계 — 3단계 사용자 흐름");

  const captureY = 2.55;
  const items = [
    { file: "shot-index.png",   label: "진단 입력",    desc: "사실관계 입력 + 메트릭 노출" },
    { file: "shot-result.png",  label: "결과 리포트",  desc: "위반 의심 조항 + 법리 판단" },
    { file: "shot-history.png", label: "이력 통계",    desc: "조항별 카운트 + 최근 진단" },
  ];
  const cw = (W - PAD * 2) / 3;
  const imgH = 4.0;
  items.forEach((it, i) => {
    const x = PAD + i * cw;
    s.addText(it.label.toUpperCase(), { x: x + 0.1, y: captureY, w: cw - 0.3, h: 0.3,
      fontFace: FONT_B, fontSize: 12, color: ACCENT, bold: true, charSpacing: 4, margin: 0 });
    s.addText(`0${i + 1}`, { x: x + cw - 0.55, y: captureY, w: 0.4, h: 0.3,
      fontFace: FONT_H, fontSize: 13, color: ACCENT, italic: true, align: "right", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.1, y: captureY + 0.4, w: cw - 0.3, h: imgH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.75 } });
    s.addImage({
      path: path.join(__dirname, it.file),
      x: x + 0.15, y: captureY + 0.45, w: cw - 0.4, h: imgH - 0.1,
      sizing: { type: "contain", w: cw - 0.4, h: imgH - 0.1 },
    });
    s.addText(it.desc, { x: x + 0.1, y: captureY + imgH + 0.5, w: cw - 0.3, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: INK_SOFT, margin: 0 });
  });
  footer(s, 5);
}

// Slide 6 — Law-Lens 운영 안전장치
{
  const s = pres.addSlide();
  frame(s, LL_MARK, LL_SUB, ACCENT);
  pageTitle(s, "운영 안전장치", "데모를 넘어 실서비스로 가는 4가지 장치");

  const sgY = 2.7;
  const items = [
    { n: "01", t: "PII 마스킹 + 감사 로그",
      d: "정규식 마스킹 후 적재. 원본은 AES-256-GCM으로 별도 보관, 90일 보존." },
    { n: "02", t: "Redis 응답 캐시",
      d: "SHA-256 정규화 키, 24h TTL. hit/miss를 Prometheus로 노출." },
    { n: "03", t: "Correlation ID 전파",
      d: "Spring MDC → WebClient 필터 → FastAPI까지 동일 ID 추적." },
    { n: "04", t: "Article 화이트리스트",
      d: "학습 외 조항 응답을 null로 강등. accept/reject 카운터." },
  ];
  const sgCardW = 4.0, sgCardH = 2.05, sgGap = 0.25;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (sgCardW + sgGap);
    const y = sgY + row * (sgCardH + sgGap);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: sgCardW, h: sgCardH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: sgCardH,
      fill: { color: ACCENT }, line: { type: "none" } });
    s.addText(it.n, { x: x + 0.3, y: y + 0.22, w: 0.85, h: 0.5,
      fontFace: FONT_H, fontSize: 24, color: ACCENT, bold: true, italic: true, margin: 0 });
    s.addText(it.t, { x: x + 1.2, y: y + 0.25, w: sgCardW - 1.35, h: 0.5,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(it.d, { x: x + 0.3, y: y + 0.9, w: sgCardW - 0.5, h: sgCardH - 1.0,
      fontFace: FONT_B, fontSize: 13.5, color: SUB, margin: 0 });
  });

  const dpX = PAD + sgCardW * 2 + sgGap + 0.45;
  vRule(s, dpX - 0.3, sgY, sgCardH * 2 + sgGap);
  eyebrow(s, dpX, sgY, 4.5, "Data", ACCENT);
  s.addText("4개 조항 · 합성 500건", { x: dpX, y: sgY + 0.4, w: 4.5, h: 0.35,
    fontFace: FONT_B, fontSize: 14, color: INK_SOFT, bold: true, margin: 0 });
  const arts = [
    { code: "제3조",     name: "서면 발급" },
    { code: "제11조",    name: "대금 감액" },
    { code: "제13조",    name: "지급·지연이자" },
    { code: "제12조의3", name: "기술유용" },
  ];
  arts.forEach((a, i) => {
    const y = sgY + 0.85 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x: dpX, y, w: 4.0, h: 0.36,
      fill: { color: "FFFFFF" }, line: { color: RULE_SOFT, width: 0.4 } });
    s.addText(a.code, { x: dpX + 0.15, y, w: 1.4, h: 0.36,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, valign: "middle", margin: 0 });
    s.addText(a.name, { x: dpX + 1.5, y, w: 2.4, h: 0.36,
      fontFace: FONT_B, fontSize: 13, color: INK_SOFT, valign: "middle", margin: 0 });
  });
  const evY = sgY + 2.7;
  eyebrow(s, dpX, evY, 4.5, "Eval Set  ·  200", ACCENT);
  const evRows = [
    { k: "Tested",      v: "4조항 × 35~39" },
    { k: "Edge",        v: "30" },
    { k: "Adversarial", v: "20 (injection)" },
    { k: "Mix",         v: "10 (복합)" },
  ];
  evRows.forEach((r, i) => {
    const y = evY + 0.45 + i * 0.34;
    s.addText(r.k, { x: dpX, y, w: 1.8, h: 0.3, fontFace: FONT_B, fontSize: 13, color: MUTED, margin: 0 });
    s.addText(r.v, { x: dpX + 1.8, y, w: 2.2, h: 0.3, fontFace: FONT_B, fontSize: 13, color: INK_SOFT, margin: 0 });
  });
  footer(s, 6);
}

// Slide 7 — Law-Lens Result · Limits · Insight
{
  const s = pres.addSlide();
  frame(s, LL_MARK, LL_SUB, ACCENT);
  pageTitle(s, "Result · Limits · Insight", "성과와 보류 항목을 분리해서 명시");

  const colW = (W - PAD * 2 - 0.55) / 2;
  const rY = 2.7;
  eyebrow(s, PAD, rY, colW, "Result", ACCENT);
  const results = [
    { h: "2-Tier 분리 아키텍처",  d: "ML과 비즈니스 로직 책임 분리." },
    { h: "Fallback 가용성",       d: "Retry + CircuitBreaker로 일관된 응답." },
    { h: "이력 영속화 + 통계",    d: "JPA + 조항별 카운트 페이지." },
    { h: "회귀 평가 자동화",      d: "200건 평가셋 + GitHub Actions." },
  ];
  results.forEach((r, i) => {
    const y = rY + 0.55 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.08, h: 0.8,
      fill: { color: ACCENT }, line: { type: "none" } });
    s.addText(r.h, { x: PAD + 0.28, y, w: colW - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(r.d, { x: PAD + 0.28, y: y + 0.4, w: colW - 0.3, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });

  const midX = PAD + colW + 0.3;
  vRule(s, midX, rY, 4.2);
  const lX = midX + 0.25;
  eyebrow(s, lX, rY, colW, "Limits  ·  Next", ACCENT);
  const limits = [
    { area: "학습 데이터", now: "합성 500건",     next: "실판례 보강" },
    { area: "PII",        now: "정규식",         next: "NER 기반 (Presidio)" },
    { area: "키 관리",     now: "환경변수 주입",   next: "KMS / Vault" },
    { area: "DB",         now: "H2",             next: "PostgreSQL + Flyway" },
    { area: "API",        now: "인증 없음",       next: "OAuth2 + rate limit" },
    { area: "관측성",      now: "Prom + JSON",    next: "OpenTelemetry" },
  ];
  const lhY = rY + 0.55;
  s.addText("AREA", { x: lX,       y: lhY, w: 1.6, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  s.addText("NOW",  { x: lX + 1.55, y: lhY, w: 2.0, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  s.addText("NEXT", { x: lX + 3.55, y: lhY, w: 2.5, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  hRule(s, lX, lhY + 0.35, colW);
  limits.forEach((l, i) => {
    const y = lhY + 0.45 + i * 0.45;
    s.addText(l.area, { x: lX,       y, w: 1.5, h: 0.4, fontFace: FONT_B, fontSize: 13.5, color: ACCENT, bold: true, valign: "middle", margin: 0 });
    s.addText(l.now,  { x: lX + 1.55, y, w: 2.0, h: 0.4, fontFace: FONT_B, fontSize: 13.5, color: INK_SOFT, valign: "middle", margin: 0 });
    s.addText(l.next, { x: lX + 3.55, y, w: 2.5, h: 0.4, fontFace: FONT_B, fontSize: 13.5, color: INK_SOFT, valign: "middle", margin: 0 });
    if (i < limits.length - 1) hRule(s, lX, y + 0.42, colW);
  });

  const iY = 6.4;
  hRule(s, PAD, iY - 0.05, W - PAD * 2);
  eyebrow(s, PAD, iY + 0.05, 3, "Insight", ACCENT);
  const ins = [
    "분리는 폭발 반경을 줄이지만 네트워크 홉을 늘림 — 트레이드오프",
    "LLM 응답은 화이트리스트·스키마 후처리로 보강해야 운영 가능",
    "합성 데이터의 일반화 한계는 RAG로 일부 보완",
  ];
  ins.forEach((t, i) => {
    s.addText(`·  ${t}`, { x: PAD + 1.2, y: iY + 0.0 + i * 0.22, w: W - PAD * 2 - 1.2, h: 0.28,
      fontFace: FONT_B, fontSize: 12.5, color: SUB, italic: true, margin: 0 });
  });
  footer(s, 7);
}

// ════════════════════════════════════════════════════════════════════
// ────── PROJECT 02 — VoidTrace (3 slides) ──────
// ════════════════════════════════════════════════════════════════════
const VT_MARK = "02  ·  VOIDTRACE";
const VT_SUB  = "Kubernetes Security Automation";

// Slide 8 — VoidTrace Overview (with User Flow + Tech Chips)
{
  const s = pres.addSlide();
  frame(s, VT_MARK, VT_SUB, ACCENT_V);
  pageTitle(s, "VoidTrace",
    "ISMS-P/CSAP 대응 — Kubernetes 정적·동적 보안 진단 + LLM 리포트 자동화");

  // ─── Architecture (compact horizontal) ───
  const archY = 2.55;
  eyebrow(s, PAD, archY, 6, "Architecture", ACCENT_V);

  // 3-tier horizontal: Tools → ES → Outputs
  // Tools group (left)
  s.addShape(pres.shapes.RECTANGLE, { x: PAD, y: archY + 0.4, w: 3.6, h: 1.6,
    fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.6 } });
  s.addText("정적 + 동적 진단", { x: PAD + 0.15, y: archY + 0.5, w: 3.3, h: 0.3,
    fontFace: FONT_B, fontSize: 10, color: ACCENT_V, bold: true, charSpacing: 3, margin: 0 });
  ["kube-bench  ·  kubescape  ·  grype", "Falco  ·  Suricata  ·  Filebeat"].forEach((t, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: PAD + 0.15, y: archY + 0.85 + i * 0.5, w: 3.3, h: 0.4,
      fill: { color: i === 0 ? "FFFFFF" : ACCENT_V_SOFT },
      line: { color: ACCENT_V, width: 0.3 },
    });
    s.addText(t, { x: PAD + 0.15, y: archY + 0.85 + i * 0.5, w: 3.3, h: 0.4,
      fontFace: FONT_B, fontSize: 11, color: INK, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  // arrow to ES
  s.addShape(pres.shapes.LINE, {
    x: PAD + 3.65, y: archY + 1.2, w: 0.5, h: 0,
    line: { color: ACCENT_V, width: 1.5, endArrowType: "triangle" },
  });

  // ES (center, dark)
  s.addShape(pres.shapes.RECTANGLE, { x: PAD + 4.2, y: archY + 0.6, w: 2.4, h: 1.2,
    fill: { color: INK }, line: { type: "none" } });
  s.addText("Elasticsearch", { x: PAD + 4.2, y: archY + 0.75, w: 2.4, h: 0.4,
    fontFace: FONT_H, fontSize: 16, color: "FFFFFF", bold: true, align: "center", margin: 0 });
  s.addText("정적·동적 통합 로그", { x: PAD + 4.2, y: archY + 1.2, w: 2.4, h: 0.3,
    fontFace: FONT_B, fontSize: 10, color: "C7CBD1", align: "center", margin: 0 });

  // arrow to outputs
  s.addShape(pres.shapes.LINE, {
    x: PAD + 6.65, y: archY + 1.2, w: 0.5, h: 0,
    line: { color: ACCENT_V, width: 1.5, endArrowType: "triangle" },
  });

  // Outputs (right)
  s.addShape(pres.shapes.RECTANGLE, { x: PAD + 7.2, y: archY + 0.4, w: 5.0, h: 1.6,
    fill: { color: ACCENT_V_SOFT }, line: { color: ACCENT_V, width: 0.5 } });
  s.addText("출력 (사용자 제공)", { x: PAD + 7.35, y: archY + 0.5, w: 4.7, h: 0.3,
    fontFace: FONT_B, fontSize: 10, color: ACCENT_V, bold: true, charSpacing: 3, margin: 0 });
  const outs = [
    { t: "Gemini 리포트", d: "한국어 자동 생성" },
    { t: "ISMS-P 매핑",   d: "102 항목 체크리스트" },
    { t: "Discord 알림",  d: "실시간 위협 푸시" },
  ];
  outs.forEach((o, i) => {
    const y = archY + 0.88 + i * 0.36;
    s.addText(`■  ${o.t}`, { x: PAD + 7.35, y, w: 2.2, h: 0.3,
      fontFace: FONT_B, fontSize: 11.5, color: INK, bold: true, margin: 0 });
    s.addText(o.d, { x: PAD + 9.6, y, w: 2.5, h: 0.3,
      fontFace: FONT_B, fontSize: 11, color: SUB, margin: 0 });
  });

  // ─── User Flow ───
  const ufY = 4.2;
  eyebrow(s, PAD, ufY, 6, "User Flow  ·  사용자 흐름", ACCENT_V);
  const fW = (W - PAD * 2) / 4 - 0.15;
  const fSteps = [
    { num: "1", head: "보안 담당자",  body: "K8s 클러스터 + sudo 권한 보유" },
    { num: "2", head: "한 줄 실행",   body: "run_voidtrace.sh 메뉴 선택" },
    { num: "3", head: "자동 진단",    body: "정적·동적 도구 + LLM 마스킹·리포트" },
    { num: "4", head: "결과 제공",    body: "Flask 대시보드 + Discord 알림" },
  ];
  fSteps.forEach((st, i) => {
    const x = PAD + i * (fW + 0.2);
    flowStep(s, x, ufY + 0.45, fW, st.num, st.head, st.body, ACCENT_V);
    if (i < fSteps.length - 1) flowArrow(s, x + fW + 0.02, ufY + 0.45, 0.16);
  });

  // ─── Tech Stack chips ───
  const tsY = 6.4;
  eyebrow(s, PAD, tsY, 6, "Tech Stack", ACCENT_V);
  const chips = [
    "Kubernetes", "kube-bench", "kubescape", "syft + grype",
    "Falco", "Suricata", "Filebeat", "Elasticsearch",
    "Gemini API", "Flask", "Discord Webhook", "Python · Bash",
  ];
  const chipW = (W - PAD * 2) / 6 - 0.1;
  const chipH = 0.32;
  chips.forEach((t, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    const x = PAD + col * (chipW + 0.12);
    const y = tsY + 0.4 + row * (chipH + 0.08);
    chip(s, x, y, chipW, chipH, t, ACCENT_V, ACCENT_V_SOFT);
  });
  footer(s, 8);
}

// Slide 9 — VoidTrace Approach + LLM Masking
{
  const s = pres.addSlide();
  frame(s, VT_MARK, VT_SUB, ACCENT_V);
  pageTitle(s, "Approach", "정적·동적 진단 + LLM 기반 PII 마스킹 — 보안 솔루션의 보안");

  // 4-step pipeline (left 2/3)
  const steps = [
    { n: "01", t: "K8s 정적 스캔",
      d: "kube-bench · kubescape · syft+grype로 클러스터·이미지·정책 진단" },
    { n: "02", t: "Gemini 리포트",
      d: "도구별 10종 프롬프트 → 한국어 summary + detail 자동 생성" },
    { n: "03", t: "ISMS-P / CSAP 매핑",
      d: "102개 항목 + CSAP 체크리스트 자동 매핑, checklist JSON 5종" },
    { n: "04", t: "동적 위협 알림",
      d: "Falco · Suricata → ES → Discord webhook 1분 주기 푸시" },
  ];
  const colW = 4.0, sgH = 1.3, sgGap = 0.18;
  steps.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (colW + sgGap);
    const y = 2.55 + row * (sgH + sgGap);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: colW, h: sgH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: sgH,
      fill: { color: ACCENT_V }, line: { type: "none" } });
    s.addText(st.n, { x: x + 0.3, y: y + 0.15, w: 0.7, h: 0.4,
      fontFace: FONT_H, fontSize: 20, color: ACCENT_V, bold: true, italic: true, margin: 0 });
    s.addText(st.t, { x: x + 1.0, y: y + 0.18, w: colW - 1.15, h: 0.4,
      fontFace: FONT_H, fontSize: 15, color: INK, bold: true, margin: 0 });
    s.addText(st.d, { x: x + 0.3, y: y + 0.65, w: colW - 0.5, h: sgH - 0.7,
      fontFace: FONT_B, fontSize: 12, color: SUB, margin: 0 });
  });

  // Right column — Masking Algorithm (highlighted)
  const mX = PAD + colW * 2 + sgGap + 0.4;
  vRule(s, mX - 0.25, 2.55, sgH * 2 + sgGap);
  eyebrow(s, mX, 2.55, 4.5, "LLM Masking · 차별점", ACCENT_V);
  s.addText("보안 솔루션의 보안", { x: mX, y: 2.95, w: 4.5, h: 0.4,
    fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: mX, y: 3.45, w: 4.4, h: 2.4,
    fill: { color: ACCENT_V_SOFT }, line: { type: "none" } });
  const maskSteps = [
    "① 진단 JSON에서 4자 이상 문자열 추출 (CVE-* 제외)",
    "② Gemini에 \"이름·이메일·전화·계정명\" 식별 요청",
    "③ 네임스페이스·서비스계정에 포함된 실명도 PII로 간주",
    "④ 시스템 계정(admin, root, kube-system)은 화이트리스트",
    "⑤ 식별된 PII만 마스킹 후 본 리포트 생성용 LLM 호출",
  ];
  maskSteps.forEach((t, i) => {
    s.addText(t, { x: mX + 0.2, y: 3.6 + i * 0.4, w: 4.05, h: 0.35,
      fontFace: FONT_B, fontSize: 11.5, color: INK_SOFT, margin: 0 });
  });
  s.addText("외부 LLM API에 보내기 전 NER로 PII 차단 — 보안 도구가 정보 유출원이 되지 않게.", {
    x: mX, y: 6.0, w: 4.5, h: 0.55,
    fontFace: FONT_B, fontSize: 12, color: ACCENT_V, italic: true, bold: true, margin: 0,
  });

  footer(s, 9);
}

// Slide 10 — VoidTrace Script UX (Linux 기반 사용자 진입점)
{
  const s = pres.addSlide();
  frame(s, VT_MARK, VT_SUB, ACCENT_V);
  pageTitle(s, "Script-Based Delivery",
    "Linux 환경 sudo 실행 — sysadmin이 한 줄로 진입하는 보안 솔루션");

  // ─── Terminal mockup (left, big) ───
  const tX = PAD, tY = 2.55, tW = 7.2, tH = 4.65;
  // Terminal window frame
  s.addShape(pres.shapes.RECTANGLE, { x: tX, y: tY, w: tW, h: tH,
    fill: { color: "1A1A1F" }, line: { color: "0A0A0F", width: 1 } });
  // Title bar
  s.addShape(pres.shapes.RECTANGLE, { x: tX, y: tY, w: tW, h: 0.35,
    fill: { color: "2A2A33" }, line: { type: "none" } });
  ["FF5F57","FEBC2E","28C840"].forEach((c, i) => {
    s.addShape(pres.shapes.OVAL, { x: tX + 0.15 + i * 0.22, y: tY + 0.09, w: 0.17, h: 0.17,
      fill: { color: c }, line: { type: "none" } });
  });
  s.addText("voidtrace@k8s-cluster: ~", {
    x: tX, y: tY, w: tW, h: 0.35,
    fontFace: "Consolas", fontSize: 11, color: "C7CBD1",
    align: "center", valign: "middle", margin: 0,
  });

  // Terminal content — ANSI colored lines
  const term = [
    { c: "8AE234", t: "$ sudo ./run_voidtrace.sh" },
    { c: "FFFFFF", t: "=============================================" },
    { c: "8AE234", t: "[✓] root 권한 확인 완료 (UID: 0)" },
    { c: "8AE234", t: "[✓] kubectl 검증 완료  ·  kubelet v1.28.4" },
    { c: "FFFFFF", t: "---------------------------------------------" },
    { c: "C7CBD1", t: "[+] 실행 사용자: voidtrace" },
    { c: "C7CBD1", t: "[+] 호스트 이름: k8s-cluster-master" },
    { c: "C7CBD1", t: "[+] 실행 시각 : 2026-05-27 22:13:08 KST" },
    { c: "FFFFFF", t: "=============================================" },
    { c: "FFFFFF", t: "" },
    { c: "00CCCC", t: "무엇을 실행하시겠습니까?" },
    { c: "FFFFFF", t: "  [1] 정적 분석 (kube-bench · kubescape · grype)" },
    { c: "FFFFFF", t: "  [2] 동적 탐지 (Falco · Suricata 런타임 위협)" },
    { c: "FFFFFF", t: "  [3] 정적 분석 로그 정리 (1일 이상 경과)" },
    { c: "FFFFFF", t: "  [0] 종료" },
    { c: "FFFFFF", t: "" },
    { c: "00CCCC", t: ">> 선택 (0-3): " },
    { c: "8AE234", t: "1" },
    { c: "00CCCC", t: "[*] 정적 분석을 실행합니다..." },
    { c: "C7CBD1", t: "  [+] kube-bench 진행 (1/3)..." },
    { c: "C7CBD1", t: "  [+] kubescape 진행 (2/3)..." },
    { c: "C7CBD1", t: "  [+] syft + grype 진행 (3/3)..." },
    { c: "C7CBD1", t: "  [+] LLM 마스킹 적용 → Gemini 리포트 생성..." },
    { c: "8AE234", t: "[✓] 리포트 5종 저장 → ./results/checklist_*.json" },
    { c: "8AE234", t: "[✓] Flask 대시보드: http://localhost:5000" },
  ];
  const lineH = 0.16;
  term.forEach((ln, i) => {
    s.addText(ln.t, {
      x: tX + 0.2, y: tY + 0.5 + i * lineH, w: tW - 0.4, h: lineH,
      fontFace: "Consolas", fontSize: 9.5, color: ln.c, margin: 0,
    });
  });

  // ─── Right: 4 key script files ───
  const fX = PAD + tW + 0.4;
  const fY = 2.55;
  eyebrow(s, fX, fY, 5, "Shell 스크립트 구성", ACCENT_V);
  const scripts = [
    { name: "run_voidtrace.sh",                  desc: "메인 메뉴 · sudo 검증 · 로그 정리" },
    { name: "K8s_analysis.sh",                   desc: "정적 진단 도구 통합 실행" },
    { name: "K8s_dynamic_threat_detection.sh",   desc: "Falco · Suricata 배포 + 모니터링" },
    { name: "auto_report.sh",                    desc: "마스킹 + Gemini 호출 + 결과 저장" },
    { name: "kibana_discord.py",                 desc: "ES 신규 이벤트 → Discord (1분 주기)" },
  ];
  scripts.forEach((sc, i) => {
    const y = fY + 0.5 + i * 0.78;
    s.addShape(pres.shapes.RECTANGLE, {
      x: fX, y, w: 4.7, h: 0.65,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: fX, y, w: 0.06, h: 0.65, fill: { color: ACCENT_V }, line: { type: "none" },
    });
    s.addText(sc.name, {
      x: fX + 0.2, y: y + 0.05, w: 4.4, h: 0.28,
      fontFace: "Consolas", fontSize: 12, color: ACCENT_V, bold: true, margin: 0,
    });
    s.addText(sc.desc, {
      x: fX + 0.2, y: y + 0.34, w: 4.4, h: 0.28,
      fontFace: FONT_B, fontSize: 11, color: SUB, margin: 0,
    });
  });

  // Bottom tag
  s.addText("Linux/Bash · sudo · kubectl · ANSI 컬러 출력 · 메뉴형 진입점 · .env 시크릿 분리", {
    x: PAD, y: H - 1.05, w: W - PAD * 2, h: 0.35,
    fontFace: FONT_B, fontSize: 11.5, color: ACCENT_V, italic: true, align: "center", margin: 0,
  });

  footer(s, 10);
}

// Slide 11 — VoidTrace Web Dashboard (큰 캡처)
{
  const s = pres.addSlide();
  frame(s, VT_MARK, VT_SUB, ACCENT_V);
  pageTitle(s, "Web Dashboard", "스크립트 실행 후 Flask 대시보드에서 결과 조회");

  // Two-column big screenshots
  const colW = (W - PAD * 2 - 0.4) / 2;
  const imgY = 2.55;
  const imgH = 4.5;
  const items = [
    { file: "vt-home.png",    label: "HOME", desc: "도구별 진단 결과 진입점 4개 카드" },
    { file: "vt-report.png",  label: "ISMS-P 체크리스트", desc: "102 항목 자동 매핑 · 적합/부적합 판정" },
  ];
  items.forEach((it, i) => {
    const x = PAD + i * (colW + 0.4);
    s.addText(it.label.toUpperCase(), {
      x, y: imgY, w: colW, h: 0.35,
      fontFace: FONT_B, fontSize: 13, color: ACCENT_V, bold: true, charSpacing: 4, margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: imgY + 0.45, w: colW, h: imgH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.75 },
    });
    s.addImage({
      path: path.join(__dirname, it.file),
      x: x + 0.1, y: imgY + 0.55, w: colW - 0.2, h: imgH - 0.2,
      sizing: { type: "contain", w: colW - 0.2, h: imgH - 0.2 },
    });
    s.addText(it.desc, {
      x, y: imgY + imgH + 0.6, w: colW, h: 0.3,
      fontFace: FONT_B, fontSize: 12, color: INK_SOFT, margin: 0,
    });
  });

  footer(s, 11);
}

// Slide 12 — VoidTrace Result + Papers + Insight
{
  const s = pres.addSlide();
  frame(s, VT_MARK, VT_SUB, ACCENT_V);
  pageTitle(s, "Result · Papers · Insight",
    "검증된 보안 자동화 + 학술 발표 4편 + 인사이트");

  // Top row: 4 big stats
  const stY = 2.7;
  const stats = [
    { v: "4편",   label: "학술 논문" },
    { v: "33",    label: "테스트 케이스" },
    { v: "102",   label: "ISMS-P 항목" },
    { v: "<1분",  label: "실시간 알림" },
  ];
  const cw = (W - PAD * 2) / 4;
  stats.forEach((st, i) => {
    const x = PAD + i * cw;
    if (i > 0) vRule(s, x, stY, 1.4);
    s.addText(st.label.toUpperCase(), { x: x + 0.3, y: stY + 0.05, w: cw - 0.5, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: MUTED, charSpacing: 4, bold: true, align: "center", margin: 0 });
    s.addText(st.v, { x: x + 0.3, y: stY + 0.4, w: cw - 0.5, h: 1.0,
      fontFace: FONT_H, fontSize: 46, color: INK, bold: true, align: "center", margin: 0 });
  });

  hRule(s, PAD, 4.35, W - PAD * 2);

  // Middle: 4 papers
  const pY = 4.5;
  eyebrow(s, PAD, pY, 8, "Published Papers  ·  공저자", ACCENT_V);
  const papers = [
    { conf: "융합보안학회",   title: "SaaS 기업 대상 CSAP 대응 K8s 환경 보안 진단 + 상용 LLM 보고서 자동화" },
    { conf: "정보보호학회",   title: "중소기업 대상 ISMS-P 대응 쿠버네티스 통합 보안 진단 시스템" },
    { conf: "한국통신학회",   title: "SaaS 기업 대상 CSAP 대응 K8s 환경 보안 진단 + 자동화 시스템" },
    { conf: "영남지부",       title: "중소기업을 위한 LLM 기반 클러스터 보안 점검 + 개인정보 비식별화 시스템" },
  ];
  const pColW = (W - PAD * 2 - 0.45) / 2;
  papers.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (pColW + 0.45);
    const y = pY + 0.4 + row * 0.65;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: 0.55,
      fill: { color: ACCENT_V }, line: { type: "none" } });
    s.addText(p.conf, { x: x + 0.25, y, w: pColW - 0.3, h: 0.28,
      fontFace: FONT_B, fontSize: 12, color: ACCENT_V, bold: true, margin: 0 });
    s.addText(p.title, { x: x + 0.25, y: y + 0.28, w: pColW - 0.3, h: 0.3,
      fontFace: FONT_B, fontSize: 11, color: SUB, margin: 0 });
  });

  // Insight strip
  const iY = 6.55;
  hRule(s, PAD, iY - 0.05, W - PAD * 2);
  eyebrow(s, PAD, iY + 0.05, 3, "Insight", ACCENT_V);
  const ins = [
    "도구 출력 그대로는 사람이 못 읽음 — 가장 비싼 작업은 「결과 → 컴플라이언스 항목」 매핑",
    "LLM 전송 전 PII 마스킹은 보안 솔루션 자체의 보안 — 솔루션이 정보 유출원이 되면 안 됨",
  ];
  ins.forEach((t, i) => {
    s.addText(`·  ${t}`, { x: PAD + 1.2, y: iY + 0.0 + i * 0.24, w: W - PAD * 2 - 1.2, h: 0.3,
      fontFace: FONT_B, fontSize: 12, color: SUB, italic: true, margin: 0 });
  });

  footer(s, 12);
}

// ════════════════════════════════════════════════════════════════════
// ────── PROJECT 03 — Widea (3 slides) ──────
// ════════════════════════════════════════════════════════════════════
const WD_MARK = "03  ·  WIDEA";
const WD_SUB  = "검증 사례 RAG · 한국 컨텍스트 워크스페이스";

// Slide 13 — Widea Overview
{
  const s = pres.addSlide();
  frame(s, WD_MARK, WD_SUB, ACCENT_W);
  pageTitle(s, "Widea",
    "검증된 사례 기반 RAG · 한국 컨텍스트 + 워크스페이스 + Whisper 음성 입력");

  const archY = 2.55;
  eyebrow(s, PAD, archY, 6, "Architecture", ACCENT_W);
  const aBoxes = [
    { x: PAD,        y: archY + 0.4, w: 2.7, h: 1.0, head: "Next.js 16",   body: "App Router · SSR" },
    { x: PAD + 2.95, y: archY + 0.4, w: 3.5, h: 1.0, head: "Express API",   body: "워크스페이스 · 인증", filled: true },
    { x: PAD + 6.7,  y: archY + 0.4, w: 3.0, h: 1.0, head: "Pinecone RAG",  body: "검증 사례 임베딩" },
  ];
  aBoxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h,
      fill: { color: b.filled ? INK : BG }, line: { color: b.filled ? INK : RULE, width: 0.75 } });
    s.addText(b.head, { x: b.x + 0.2, y: b.y + 0.15, w: b.w - 0.4, h: 0.4,
      fontFace: FONT_H, fontSize: 16, color: b.filled ? "FFFFFF" : INK, bold: true, margin: 0 });
    s.addText(b.body, { x: b.x + 0.2, y: b.y + 0.55, w: b.w - 0.4, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: b.filled ? "C7CBD1" : SUB, margin: 0 });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.95, y: archY + 0.4, w: 2.85, h: 1.0,
    fill: { color: ACCENT_W_SOFT }, line: { type: "none" } });
  s.addText("KEY", { x: 10.1, y: archY + 0.45, w: 2.6, h: 0.25,
    fontFace: FONT_B, fontSize: 10, color: ACCENT_W, bold: true, charSpacing: 3, margin: 0 });
  s.addText("\"한국 시장 검증 사례\"를\nRAG로 즉시 검색·인용", {
    x: 10.1, y: archY + 0.72, w: 2.6, h: 0.65,
    fontFace: FONT_B, fontSize: 11, color: INK_SOFT, margin: 0 });

  // User flow
  const ufY = 4.2;
  eyebrow(s, PAD, ufY, 6, "User Flow", ACCENT_W);
  const fW = (W - PAD * 2) / 4 - 0.15;
  const fSteps = [
    { num: "1", head: "사용자",      body: "사업 아이디어·질문을 입력 또는 Whisper 음성" },
    { num: "2", head: "RAG 검색",    body: "Pinecone에서 검증된 한국 사례 Top-K 매칭" },
    { num: "3", head: "LLM 답변",    body: "한국 컨텍스트로 답변 생성 + 출처 인용" },
    { num: "4", head: "워크스페이스", body: "이력 저장 + 협업·공유" },
  ];
  fSteps.forEach((st, i) => {
    const x = PAD + i * (fW + 0.2);
    flowStep(s, x, ufY + 0.45, fW, st.num, st.head, st.body, ACCENT_W);
    if (i < fSteps.length - 1) flowArrow(s, x + fW + 0.02, ufY + 0.45, 0.16);
  });

  // Tech chips
  const tsY = 6.4;
  eyebrow(s, PAD, tsY, 6, "Tech Stack", ACCENT_W);
  const chips = [
    "Next.js 16", "App Router", "TypeScript", "Tailwind",
    "Express", "Node.js", "Pinecone", "OpenAI Embeddings",
    "Whisper STT", "GPT API", "PostgreSQL", "Docker",
  ];
  const chipW = (W - PAD * 2) / 6 - 0.1, chipH = 0.32;
  chips.forEach((t, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    chip(s, PAD + col * (chipW + 0.12), tsY + 0.4 + row * (chipH + 0.08), chipW, chipH, t, ACCENT_W, ACCENT_W_SOFT);
  });
  footer(s, 13);
}

// Slide 14 — Widea 차별점 (검증 사례 RAG + Whisper)
{
  const s = pres.addSlide();
  frame(s, WD_MARK, WD_SUB, ACCENT_W);
  pageTitle(s, "차별점 — 검증 사례 RAG",
    "범용 LLM이 못 주는 \"한국 시장 실증\" 답변을 RAG로 보강");

  const sgY = 2.55;
  const items = [
    { n: "01", t: "검증 사례 DB",
      d: "한국 시장에서 실제로 성과 낸 사업·서비스 사례를 큐레이션 + Pinecone에 임베딩" },
    { n: "02", t: "한국 컨텍스트 LLM",
      d: "프롬프트에 \"국내 규제·문화·소비 패턴\"을 명시 → 일반 GPT보다 현실적 답변" },
    { n: "03", t: "Whisper 음성 입력",
      d: "텍스트 입력 부담 줄임 — 사용자가 음성으로 질문 → STT → RAG 흐름" },
    { n: "04", t: "워크스페이스",
      d: "개인·팀 단위로 질의 이력·즐겨찾기·노트 저장 → 협업 가능" },
  ];
  const cardW = 4.0, cardH = 2.05, gap = 0.25;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (cardW + gap);
    const y = sgY + row * (cardH + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: cardH,
      fill: { color: ACCENT_W }, line: { type: "none" } });
    s.addText(it.n, { x: x + 0.3, y: y + 0.22, w: 0.85, h: 0.5,
      fontFace: FONT_H, fontSize: 24, color: ACCENT_W, bold: true, italic: true, margin: 0 });
    s.addText(it.t, { x: x + 1.2, y: y + 0.25, w: cardW - 1.35, h: 0.5,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(it.d, { x: x + 0.3, y: y + 0.9, w: cardW - 0.5, h: cardH - 1.0,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });

  // 우측 — 차별 메시지
  const mX = PAD + cardW * 2 + gap + 0.45;
  vRule(s, mX - 0.3, sgY, cardH * 2 + gap);
  eyebrow(s, mX, sgY, 4.5, "Why Widea?", ACCENT_W);
  s.addText("범용 GPT vs Widea", {
    x: mX, y: sgY + 0.4, w: 4.5, h: 0.4,
    fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: mX, y: sgY + 0.9, w: 4.4, h: 3.4,
    fill: { color: ACCENT_W_SOFT }, line: { type: "none" } });
  const compare = [
    "🅛 \"미국 실리콘밸리 모델…\"",
    "🅦 \"국내 OO이 같은 모델로 매출 N억\"",
    "",
    "🅛 출처 없음, 환각 위험",
    "🅦 검증 사례 인용 + 출처 링크",
    "",
    "🅛 단발 채팅, 휘발",
    "🅦 워크스페이스 누적, 협업 가능",
  ];
  compare.forEach((t, i) => {
    s.addText(t, { x: mX + 0.2, y: sgY + 1.05 + i * 0.36, w: 4.1, h: 0.32,
      fontFace: FONT_B, fontSize: 11.5, color: INK_SOFT, margin: 0 });
  });
  footer(s, 14);
}

// Slide 15 — Widea Result + Insight
{
  const s = pres.addSlide();
  frame(s, WD_MARK, WD_SUB, ACCENT_W);
  pageTitle(s, "Result · Roadmap", "MVP 단계 + 다음 단계");

  const colW = (W - PAD * 2 - 0.55) / 2;
  const rY = 2.55;
  eyebrow(s, PAD, rY, colW, "Result", ACCENT_W);
  const results = [
    { h: "Next.js 16 App Router",       d: "최신 React Server Components 적용" },
    { h: "Pinecone RAG 통합",            d: "검증 사례 N건 임베딩 + Top-K 검색" },
    { h: "Whisper 음성 입력",            d: "텍스트·음성 듀얼 입력 지원" },
    { h: "워크스페이스 + 이력",          d: "Express + Postgres로 영속화" },
  ];
  results.forEach((r, i) => {
    const y = rY + 0.5 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.08, h: 0.8,
      fill: { color: ACCENT_W }, line: { type: "none" } });
    s.addText(r.h, { x: PAD + 0.28, y, w: colW - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(r.d, { x: PAD + 0.28, y: y + 0.4, w: colW - 0.3, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });

  const midX = PAD + colW + 0.3;
  vRule(s, midX, rY, 4.4);

  const lX = midX + 0.25;
  eyebrow(s, lX, rY, colW, "Roadmap", ACCENT_W);
  const roadmap = [
    { area: "데이터셋",   now: "수기 큐레이션",     next: "공시·뉴스 자동 수집" },
    { area: "RAG",        now: "Top-K = 5",         next: "Reranker + 동의어 확장" },
    { area: "사용자 관리", now: "Email 인증",        next: "OAuth (Kakao/Google)" },
    { area: "비용",       now: "OpenAI API",        next: "오픈모델 self-host" },
    { area: "협업",       now: "워크스페이스 단위", next: "팀 권한·댓글" },
    { area: "음성",       now: "Whisper API",        next: "On-device STT" },
  ];
  const lhY = rY + 0.5;
  s.addText("AREA", { x: lX,        y: lhY, w: 1.6, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  s.addText("NOW",  { x: lX + 1.55, y: lhY, w: 2.0, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  s.addText("NEXT", { x: lX + 3.55, y: lhY, w: 2.5, h: 0.32, fontFace: FONT_B, fontSize: 11, color: MUTED, bold: true, charSpacing: 3, margin: 0 });
  hRule(s, lX, lhY + 0.35, colW);
  roadmap.forEach((l, i) => {
    const y = lhY + 0.45 + i * 0.45;
    s.addText(l.area, { x: lX,        y, w: 1.5, h: 0.4, fontFace: FONT_B, fontSize: 13, color: ACCENT_W, bold: true, valign: "middle", margin: 0 });
    s.addText(l.now,  { x: lX + 1.55, y, w: 2.0, h: 0.4, fontFace: FONT_B, fontSize: 13, color: INK_SOFT, valign: "middle", margin: 0 });
    s.addText(l.next, { x: lX + 3.55, y, w: 2.5, h: 0.4, fontFace: FONT_B, fontSize: 13, color: INK_SOFT, valign: "middle", margin: 0 });
    if (i < roadmap.length - 1) hRule(s, lX, y + 0.42, colW);
  });

  const iY = 6.55;
  hRule(s, PAD, iY - 0.05, W - PAD * 2);
  eyebrow(s, PAD, iY + 0.05, 3, "Insight", ACCENT_W);
  const ins = [
    "범용 LLM의 약점인 \"맥락·출처\" 부족을 RAG + 한국 컨텍스트로 보강",
    "음성·텍스트 다중 입력으로 사용자 진입 장벽 ↓",
  ];
  ins.forEach((t, i) => {
    s.addText(`·  ${t}`, { x: PAD + 1.2, y: iY + i * 0.24, w: W - PAD * 2 - 1.2, h: 0.3,
      fontFace: FONT_B, fontSize: 12, color: SUB, italic: true, margin: 0 });
  });
  footer(s, 15);
}

// ════════════════════════════════════════════════════════════════════
// ────── PROJECT 04 — Virtual Try-On (3 slides) ──────
// ════════════════════════════════════════════════════════════════════
const TY_MARK = "04  ·  VIRTUAL TRY-ON";
const TY_SUB  = "AI 가상 착장 멀티모델 파이프라인";

// Slide 16 — Try-On Overview
{
  const s = pres.addSlide();
  frame(s, TY_MARK, TY_SUB, ACCENT_T);
  pageTitle(s, "Virtual Try-On",
    "YOLO → OpenPose → VITON · 3개 모델의 입출력을 잇는 파이프라인");

  const archY = 2.55;
  eyebrow(s, PAD, archY, 6, "Pipeline", ACCENT_T);
  const steps = [
    { x: PAD,        y: archY + 0.4, w: 2.3, h: 1.0, head: "YOLO",      body: "사람 BBox 검출" },
    { x: PAD + 2.55, y: archY + 0.4, w: 2.5, h: 1.0, head: "OpenPose",  body: "18 keypoint 추출" },
    { x: PAD + 5.3,  y: archY + 0.4, w: 2.5, h: 1.0, head: "VITON",     body: "의류 워핑·합성", filled: true },
    { x: PAD + 8.05, y: archY + 0.4, w: 2.3, h: 1.0, head: "Output",    body: "착장 이미지" },
  ];
  steps.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h,
      fill: { color: b.filled ? INK : BG }, line: { color: b.filled ? INK : RULE, width: 0.75 } });
    s.addText(b.head, { x: b.x + 0.15, y: b.y + 0.15, w: b.w - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 15, color: b.filled ? "FFFFFF" : INK, bold: true, margin: 0 });
    s.addText(b.body, { x: b.x + 0.15, y: b.y + 0.55, w: b.w - 0.3, h: 0.35,
      fontFace: FONT_B, fontSize: 11, color: b.filled ? "C7CBD1" : SUB, margin: 0 });
  });
  // arrows
  [PAD + 2.3, PAD + 5.05, PAD + 7.8].forEach((x) => {
    s.addShape(pres.shapes.LINE, { x, y: archY + 0.9, w: 0.25, h: 0,
      line: { color: ACCENT_T, width: 1.5, endArrowType: "triangle" } });
  });

  // 핵심 — 모델 간 데이터 변환
  s.addShape(pres.shapes.RECTANGLE, { x: PAD, y: archY + 1.65, w: W - PAD * 2, h: 0.55,
    fill: { color: ACCENT_T_SOFT }, line: { type: "none" } });
  s.addText("CORE — 모델 간 좌표 체계·전처리 차이를 잇는 어댑터 코드가 작업의 절반", {
    x: PAD + 0.2, y: archY + 1.7, w: W - PAD * 2 - 0.4, h: 0.45,
    fontFace: FONT_B, fontSize: 13, color: ACCENT_T, bold: true, italic: true, valign: "middle", margin: 0 });

  // User flow
  const ufY = 4.4;
  eyebrow(s, PAD, ufY, 6, "User Flow", ACCENT_T);
  const fW = (W - PAD * 2) / 4 - 0.15;
  const fSteps = [
    { num: "1", head: "이미지 업로드", body: "전신 사진 + 의류 이미지" },
    { num: "2", head: "검출·포즈",    body: "YOLO BBox + OpenPose keypoint" },
    { num: "3", head: "합성",          body: "VITON으로 의류 워핑 + 블렌딩" },
    { num: "4", head: "결과 보기",     body: "착장 이미지 다운로드" },
  ];
  fSteps.forEach((st, i) => {
    const x = PAD + i * (fW + 0.2);
    flowStep(s, x, ufY + 0.45, fW, st.num, st.head, st.body, ACCENT_T);
    if (i < fSteps.length - 1) flowArrow(s, x + fW + 0.02, ufY + 0.45, 0.16);
  });

  // Tech
  const tsY = 6.4;
  eyebrow(s, PAD, tsY, 6, "Tech Stack", ACCENT_T);
  const chips = [
    "Python", "PyTorch", "OpenCV", "NumPy",
    "YOLOv8", "OpenPose", "VITON", "Pillow",
    "FastAPI", "asyncio", "Affine Warping", "Docker",
  ];
  const chipW = (W - PAD * 2) / 6 - 0.1, chipH = 0.32;
  chips.forEach((t, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    chip(s, PAD + col * (chipW + 0.12), tsY + 0.4 + row * (chipH + 0.08), chipW, chipH, t, ACCENT_T, ACCENT_T_SOFT);
  });
  footer(s, 16);
}

// Slide 17 — Try-On 병목 분석
{
  const s = pres.addSlide();
  frame(s, TY_MARK, TY_SUB, ACCENT_T);
  pageTitle(s, "병목 분석 · 처리 시간", "단계별 측정으로 실서비스 적용 가능성 검증");

  const stY = 2.55;
  const stats = [
    { v: "0.3s",  label: "Preprocess",       sub: "리사이즈·정규화" },
    { v: "2.1s",  label: "OpenPose",          sub: "포즈 추정 · ⚠️ 병목" },
    { v: "1.8s",  label: "VITON Synthesis",   sub: "워핑 + 블렌딩" },
  ];
  const cw = (W - PAD * 2) / 3;
  stats.forEach((st, i) => {
    const x = PAD + i * cw;
    if (i > 0) vRule(s, x, stY, 1.8);
    s.addText(st.label.toUpperCase(), { x: x + 0.35, y: stY + 0.05, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: MUTED, charSpacing: 4, bold: true, margin: 0 });
    s.addText(st.v, { x: x + 0.35, y: stY + 0.5, w: cw - 0.55, h: 1.1,
      fontFace: FONT_H, fontSize: 54, color: i === 1 ? ACCENT_T : INK, bold: true, margin: 0 });
    s.addText(st.sub, { x: x + 0.35, y: stY + 1.65, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });
  hRule(s, PAD, 4.65, W - PAD * 2);

  // 개선 방안
  const imY = 4.85;
  eyebrow(s, PAD, imY, 6, "개선 방향", ACCENT_T);
  const ideas = [
    { h: "경량 포즈 모델 교체", d: "OpenPose → MoveNet · MediaPipe · 평균 0.4s로 단축 예상" },
    { h: "포즈 캐싱",           d: "같은 사용자 재요청 시 포즈 결과 재사용 · 캐시 히트 시 60% 단축" },
    { h: "비동기 + 큐",          d: "asyncio Queue로 동시 요청 처리 · 사용자 체감 대기 시간 감소" },
  ];
  ideas.forEach((it, i) => {
    const y = imY + 0.5 + i * 0.6;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.08, h: 0.5,
      fill: { color: ACCENT_T }, line: { type: "none" } });
    s.addText(it.h, { x: PAD + 0.25, y, w: 4.0, h: 0.3,
      fontFace: FONT_H, fontSize: 14, color: INK, bold: true, margin: 0 });
    s.addText(it.d, { x: PAD + 4.3, y, w: W - PAD * 2 - 4.5, h: 0.45,
      fontFace: FONT_B, fontSize: 12.5, color: SUB, margin: 0 });
  });
  footer(s, 17);
}

// Slide 18 — Try-On Result + Insight
{
  const s = pres.addSlide();
  frame(s, TY_MARK, TY_SUB, ACCENT_T);
  pageTitle(s, "Result · Insight", "멀티모델 파이프라인 + 데이터 흐름 설계 경험");

  const colW = (W - PAD * 2 - 0.55) / 2;
  const rY = 2.55;
  eyebrow(s, PAD, rY, colW, "Result", ACCENT_T);
  const results = [
    { h: "End-to-End 파이프라인",  d: "YOLO → OpenPose → VITON 입출력 어댑터 구현" },
    { h: "좌표 체계 변환",          d: "절대·상대 좌표 + 18ch 가우시안 히트맵 자동 생성" },
    { h: "신체 비율 보정",          d: "어깨 keypoint 기준 의류 스케일 조정 — 단순 오버레이 왜곡 해결" },
    { h: "병목 정량화",             d: "각 단계 처리 시간 측정 → 실서비스 적용 한계 명시" },
  ];
  results.forEach((r, i) => {
    const y = rY + 0.5 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.08, h: 0.8,
      fill: { color: ACCENT_T }, line: { type: "none" } });
    s.addText(r.h, { x: PAD + 0.28, y, w: colW - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(r.d, { x: PAD + 0.28, y: y + 0.4, w: colW - 0.3, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });

  const midX = PAD + colW + 0.3;
  vRule(s, midX, rY, 4.4);

  const lX = midX + 0.25;
  eyebrow(s, lX, rY, colW, "Insight", ACCENT_T);
  const insights = [
    { h: "데이터 변환이 절반",    d: "각 모델 입출력 포맷·좌표 체계가 모두 달라, 어댑터 코드가 알고리즘만큼 중요" },
    { h: "단순 오버레이의 한계",  d: "신체 비율 왜곡 → keypoint 기반 보정이 필수" },
    { h: "병목 측정의 가치",      d: "최적화 우선순위는 측정 데이터가 결정 — 추측이 아닌 숫자" },
    { h: "멀티모델 파이프라인",   d: "단일 모델 한계를 인지하고 분업·통합하는 설계 경험" },
  ];
  insights.forEach((r, i) => {
    const y = rY + 0.5 + i * 0.95;
    s.addText(r.h, { x: lX, y, w: colW - 0.1, h: 0.4,
      fontFace: FONT_H, fontSize: 15, color: ACCENT_T, bold: true, margin: 0 });
    s.addText(r.d, { x: lX, y: y + 0.4, w: colW - 0.1, h: 0.5,
      fontFace: FONT_B, fontSize: 12.5, color: SUB, italic: true, margin: 0 });
  });
  footer(s, 18);
}

// ════════════════════════════════════════════════════════════════════
// ────── PROJECT 05 — VoiceBridge (3 slides) ──────
// ════════════════════════════════════════════════════════════════════
const VB_MARK = "05  ·  VOICEBRIDGE";
const VB_SUB  = "사용자 음성 복제 Discord 봇";

// Slide 19 — VoiceBridge Overview
{
  const s = pres.addSlide();
  frame(s, VB_MARK, VB_SUB, ACCENT_B);
  pageTitle(s, "VoiceBridge",
    "타이핑 → 사용자 본인 목소리로 Discord 음성 채널 발화");

  const archY = 2.55;
  eyebrow(s, PAD, archY, 6, "Architecture", ACCENT_B);
  const aBoxes = [
    { x: PAD,        y: archY + 0.4, w: 2.7, h: 1.0, head: "Discord 봇",   body: "discord.py · /say · /queue" },
    { x: PAD + 2.95, y: archY + 0.4, w: 3.5, h: 1.0, head: "asyncio Queue", body: "동시 요청 직렬화", filled: true },
    { x: PAD + 6.7,  y: archY + 0.4, w: 3.0, h: 1.0, head: "Colab GPU",    body: "XTTS v2 + FastAPI" },
  ];
  aBoxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h,
      fill: { color: b.filled ? INK : BG }, line: { color: b.filled ? INK : RULE, width: 0.75 } });
    s.addText(b.head, { x: b.x + 0.2, y: b.y + 0.15, w: b.w - 0.4, h: 0.4,
      fontFace: FONT_H, fontSize: 16, color: b.filled ? "FFFFFF" : INK, bold: true, margin: 0 });
    s.addText(b.body, { x: b.x + 0.2, y: b.y + 0.55, w: b.w - 0.4, h: 0.35,
      fontFace: FONT_B, fontSize: 12, color: b.filled ? "C7CBD1" : SUB, margin: 0 });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.95, y: archY + 0.4, w: 2.85, h: 1.0,
    fill: { color: ACCENT_B_SOFT }, line: { type: "none" } });
  s.addText("KEY", { x: 10.1, y: archY + 0.45, w: 2.6, h: 0.25,
    fontFace: FONT_B, fontSize: 10, color: ACCENT_B, bold: true, charSpacing: 3, margin: 0 });
  s.addText("Provider 인터페이스로\n3-Tier 등록 통합 서비스", {
    x: 10.1, y: archY + 0.72, w: 2.6, h: 0.65,
    fontFace: FONT_B, fontSize: 11, color: INK_SOFT, margin: 0 });

  const ufY = 4.2;
  eyebrow(s, PAD, ufY, 6, "User Flow", ACCENT_B);
  const fW = (W - PAD * 2) / 4 - 0.15;
  const fSteps = [
    { num: "1", head: "음성 등록",    body: "/setvoice 6초 ~ 30분" },
    { num: "2", head: "/say 입력",   body: "텍스트 입력" },
    { num: "3", head: "음성 합성",   body: "본인 목소리로 XTTS" },
    { num: "4", head: "채널 재생",   body: "asyncio 큐 순차" },
  ];
  fSteps.forEach((st, i) => {
    const x = PAD + i * (fW + 0.2);
    flowStep(s, x, ufY + 0.45, fW, st.num, st.head, st.body, ACCENT_B);
    if (i < fSteps.length - 1) flowArrow(s, x + fW + 0.02, ufY + 0.45, 0.16);
  });

  const tsY = 6.4;
  eyebrow(s, PAD, tsY, 6, "Tech Stack", ACCENT_B);
  const chips = [
    "Python", "discord.py", "FastAPI", "Uvicorn",
    "XTTS v2 (Coqui)", "Whisper", "SQLite", "asyncio Queue",
    "Colab T4", "pyngrok", "ffmpeg", "SoundFile",
  ];
  const chipW = (W - PAD * 2) / 6 - 0.1, chipH = 0.32;
  chips.forEach((t, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    chip(s, PAD + col * (chipW + 0.12), tsY + 0.4 + row * (chipH + 0.08), chipW, chipH, t, ACCENT_B, ACCENT_B_SOFT);
  });
  footer(s, 19);
}

// Slide 20 — VoiceBridge 3-Tier 등록 구조
{
  const s = pres.addSlide();
  frame(s, VB_MARK, VB_SUB, ACCENT_B);
  pageTitle(s, "3-Tier 등록 구조",
    "30분 강제 X — 사용자 선택권으로 \"등록 부담↓ + 품질↑\" 동시에");

  const tY = 2.55;
  const tiers = [
    { n: "Tier 1", t: "Instant",   time: "6초", quality: "★★★☆☆", users: "80%", d: "한 문장 녹음 → 즉시 사용. XTTS v2 zero-shot. Friction 거의 0." },
    { n: "Tier 2", t: "Enhanced",  time: "1~3분", quality: "★★★★☆", users: "15%", d: "15문장 다중 샘플 → 다중 참조 평균. 한국어 발음 안정성↑." },
    { n: "Tier 3", t: "Pro",        time: "30분 + 학습 2~4h", quality: "★★★★★", users: "5%", d: "본인 음성 fine-tune. 말투·억양까지 학습. 데모·본인 전용." },
  ];
  tiers.forEach((it, i) => {
    const y = tY + i * 1.4;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: W - PAD * 2, h: 1.25,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.1, h: 1.25,
      fill: { color: ACCENT_B }, line: { type: "none" } });
    s.addText(it.n.toUpperCase(), { x: PAD + 0.3, y: y + 0.15, w: 1.4, h: 0.3,
      fontFace: FONT_B, fontSize: 11, color: ACCENT_B, bold: true, charSpacing: 4, margin: 0 });
    s.addText(it.t, { x: PAD + 0.3, y: y + 0.45, w: 1.7, h: 0.5,
      fontFace: FONT_H, fontSize: 22, color: INK, bold: true, margin: 0 });
    s.addText(it.d, { x: PAD + 2.2, y: y + 0.5, w: 7.6, h: 0.65,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
    // Right metrics
    s.addText("등록", { x: PAD + 10.0, y: y + 0.15, w: 1.0, h: 0.25, fontFace: FONT_B, fontSize: 9, color: MUTED, charSpacing: 3, bold: true, margin: 0 });
    s.addText(it.time, { x: PAD + 10.0, y: y + 0.38, w: 1.5, h: 0.3, fontFace: FONT_B, fontSize: 11.5, color: INK, bold: true, margin: 0 });
    s.addText("품질", { x: PAD + 11.4, y: y + 0.15, w: 0.9, h: 0.25, fontFace: FONT_B, fontSize: 9, color: MUTED, charSpacing: 3, bold: true, margin: 0 });
    s.addText(it.quality, { x: PAD + 11.4, y: y + 0.38, w: 1.0, h: 0.3, fontFace: FONT_B, fontSize: 12, color: ACCENT_B, bold: true, margin: 0 });
    s.addText("비중", { x: PAD + 10.0, y: y + 0.75, w: 1.0, h: 0.25, fontFace: FONT_B, fontSize: 9, color: MUTED, charSpacing: 3, bold: true, margin: 0 });
    s.addText(it.users, { x: PAD + 10.0, y: y + 0.95, w: 1.5, h: 0.3, fontFace: FONT_B, fontSize: 11.5, color: INK, bold: true, margin: 0 });
  });

  footer(s, 20);
}

// Slide 21 — VoiceBridge Result + Insight
{
  const s = pres.addSlide();
  frame(s, VB_MARK, VB_SUB, ACCENT_B);
  pageTitle(s, "Result · Insight", "단일 추론 서버에서 3 Tier 서비스 + 비동기 큐");

  const colW = (W - PAD * 2 - 0.55) / 2;
  const rY = 2.55;
  eyebrow(s, PAD, rY, colW, "Result", ACCENT_B);
  const results = [
    { h: "Provider 추상화",       d: "TTSProvider 인터페이스로 모델 교체·추가 자유" },
    { h: "3-Tier 등록 구조",       d: "Instant·Enhanced·Pro · 사용자 선택권 보장" },
    { h: "asyncio Queue",         d: "동시 요청 직렬화로 음성 겹침 차단" },
    { h: "Colab GPU 무료 활용",    d: "pyngrok 터널링으로 외부 노출 · 운영비 거의 0" },
  ];
  results.forEach((r, i) => {
    const y = rY + 0.5 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: PAD, y, w: 0.08, h: 0.8,
      fill: { color: ACCENT_B }, line: { type: "none" } });
    s.addText(r.h, { x: PAD + 0.28, y, w: colW - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0 });
    s.addText(r.d, { x: PAD + 0.28, y: y + 0.4, w: colW - 0.3, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0 });
  });

  const midX = PAD + colW + 0.3;
  vRule(s, midX, rY, 4.4);

  const lX = midX + 0.25;
  eyebrow(s, lX, rY, colW, "Insight", ACCENT_B);
  const insights = [
    { h: "사용자 부담 = 포기 트리거", d: "30분 강제 녹음은 80%를 잃는 길 — Tier로 분리해야 함" },
    { h: "Zero-shot의 한계 인지",     d: "Fine-tune은 zero-shot을 망가뜨릴 수 있음 — 단일 화자 학습으로 컨셉 분리" },
    { h: "비동기 큐의 가치",          d: "동시성 문제를 명시적으로 해결하는 설계가 운영성 결정" },
    { h: "무료 GPU 운영",             d: "Colab + pyngrok 조합으로 PoC 운영비 0 — 비용 의식 표현" },
  ];
  insights.forEach((r, i) => {
    const y = rY + 0.5 + i * 0.95;
    s.addText(r.h, { x: lX, y, w: colW - 0.1, h: 0.4,
      fontFace: FONT_H, fontSize: 15, color: ACCENT_B, bold: true, margin: 0 });
    s.addText(r.d, { x: lX, y: y + 0.4, w: colW - 0.1, h: 0.5,
      fontFace: FONT_B, fontSize: 12.5, color: SUB, italic: true, margin: 0 });
  });
  footer(s, 21);
}

const out = "C:/Users/dolch/OneDrive/Desktop/2026/취준/포트폴리오/수정/Portfolio-Section-v13.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written:", f));
