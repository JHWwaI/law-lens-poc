// Law-Lens AI — 4-slide portfolio insert (readable, bigger type)
const pptxgen = require("pptxgenjs");
const path = require("path");

const BG       = "FAFAF7";
const INK      = "0F172A";
const INK_SOFT = "1F2937";
const SUB      = "475569";
const MUTED    = "94A3B8";
const RULE     = "D9D4C9";
const RULE_SOFT= "EBE7DE";
const ACCENT   = "6E232F";
const ACCENT_SOFT = "F2E6E8";

const FONT_H = "Georgia";
const FONT_B = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Law-Lens AI — Portfolio Section";
pres.author = "JHWwaI";

const W = 13.3, H = 7.5, PAD = 0.6;

function frame(slide) {
  slide.background = { color: BG };
  slide.addText("LAW-LENS AI", {
    x: PAD, y: 0.3, w: 4, h: 0.35,
    fontFace: FONT_H, fontSize: 13, color: ACCENT, bold: true, charSpacing: 6, margin: 0,
  });
  slide.addText("Subcontract Risk Detector", {
    x: PAD, y: 0.3, w: W - PAD * 2, h: 0.35,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", italic: true, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: PAD, y: 0.75, w: W - PAD * 2, h: 0, line: { color: RULE, width: 0.5 },
  });
}
function footer(slide, n) {
  slide.addShape(pres.shapes.LINE, {
    x: PAD, y: H - 0.55, w: W - PAD * 2, h: 0, line: { color: RULE, width: 0.5 },
  });
  slide.addText("github.com/JHWwaI/law-lens-poc", {
    x: PAD, y: H - 0.45, w: 6, h: 0.3, fontFace: FONT_B, fontSize: 12, color: MUTED, margin: 0,
  });
  slide.addText(`${n} / 4`, {
    x: W - 2, y: H - 0.45, w: 1.5, h: 0.3,
    fontFace: FONT_B, fontSize: 12, color: MUTED, align: "right", margin: 0,
  });
}
function title(slide, big, sub, y = 1.0) {
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
function eyebrow(s, x, y, w, text) {
  s.addText(text.toUpperCase(), {
    x, y, w, h: 0.35,
    fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, charSpacing: 4, margin: 0,
  });
}

// ════════════════════════════════════════════════════════════════════
// Slide 1 — Overview · Architecture · Tech
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  frame(s);
  title(s, "Law-Lens AI",
    "Llama-3 QLoRA + FAISS RAG · Spring + FastAPI 2-Tier 진단 서비스");

  // Why — one short line, bigger
  const whyY = 2.7;
  eyebrow(s, PAD, whyY, 3, "Why");
  s.addText(
    "수급사업자가 변호사 없이 \"신고 대상인지\" 1차 판단할 수 있도록.",
    {
      x: PAD, y: whyY + 0.4, w: W - PAD * 2, h: 0.5,
      fontFace: FONT_B, fontSize: 18, color: INK, bold: true, margin: 0,
    }
  );

  hRule(s, PAD, 3.85, W - PAD * 2);

  // Architecture
  const archY = 4.1;
  eyebrow(s, PAD, archY, 6, "Architecture");

  const aBoxes = [
    { x: PAD,        y: archY + 0.55, w: 2.0, h: 1.3, head: "Browser",         body: "Thymeleaf UI" },
    { x: PAD + 2.25, y: archY + 0.55, w: 3.0, h: 1.3, head: "Spring Boot",     body: "JPA · Redis · Resilience4j", filled: true },
    { x: PAD + 5.5,  y: archY + 0.55, w: 2.6, h: 1.3, head: "FastAPI",         body: "Llama-3 · QLoRA · FAISS" },
  ];
  aBoxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: b.y, w: b.w, h: b.h,
      fill: { color: b.filled ? INK : BG },
      line: { color: b.filled ? INK : RULE, width: 0.75 },
    });
    s.addText(b.head, {
      x: b.x + 0.2, y: b.y + 0.22, w: b.w - 0.4, h: 0.55,
      fontFace: FONT_H, fontSize: 18, color: b.filled ? "FFFFFF" : INK, bold: true, margin: 0,
    });
    s.addText(b.body, {
      x: b.x + 0.2, y: b.y + 0.78, w: b.w - 0.4, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: b.filled ? "C7CBD1" : SUB, margin: 0,
    });
  });
  [{ x: PAD + 2.05, lab: "HTTP" },
   { x: PAD + 5.3,  lab: "WebClient" }].forEach((a) => {
    s.addShape(pres.shapes.LINE, {
      x: a.x, y: archY + 1.2, w: 0.2, h: 0,
      line: { color: INK, width: 1.5, endArrowType: "triangle" },
    });
    s.addText(a.lab, {
      x: a.x - 0.25, y: archY + 0.8, w: 0.7, h: 0.25,
      fontFace: FONT_B, fontSize: 10, color: MUTED, align: "center", italic: true, margin: 0,
    });
  });
  s.addText("8B 모델을 Java에 끼울 수 없어 분리 — 장애 폭발 반경 격리.", {
    x: PAD, y: archY + 2.05, w: 8.2, h: 0.4,
    fontFace: FONT_B, fontSize: 13, color: SUB, italic: true, margin: 0,
  });

  // Tech stack (right)
  vRule(s, 8.8, archY, 2.9);
  const techX = 9.05;
  eyebrow(s, techX, archY, 4.0, "Tech Stack");
  const techRows = [
    { k: "Backend",  v: "Spring Boot · Java 17" },
    { k: "JPA",      v: "Hibernate · H2" },
    { k: "Cache",    v: "Redis (Lettuce)" },
    { k: "Resilience", v: "Resilience4j · WebClient" },
    { k: "Inference", v: "FastAPI · Uvicorn" },
    { k: "Model",    v: "Llama-3-Open-Ko + QLoRA" },
    { k: "RAG",      v: "FAISS · ko-sroberta" },
    { k: "Obs",      v: "Micrometer · MDC" },
  ];
  techRows.forEach((r, i) => {
    const y = archY + 0.6 + i * 0.32;
    s.addText(r.k, { x: techX, y, w: 1.4, h: 0.28, fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, margin: 0 });
    s.addText(r.v, { x: techX + 1.35, y, w: 2.7, h: 0.28, fontFace: FONT_B, fontSize: 13, color: INK_SOFT, margin: 0 });
  });

  footer(s, 1);
}

// ════════════════════════════════════════════════════════════════════
// Slide 2 — Performance · In Practice
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  frame(s);
  title(s, "성능과 검증", "학습 외 평가셋 200건 · CI에서 PR마다 자동 실행");

  // Three big stats
  const stY = 2.7;
  const stats = [
    { v: "−96.7%", label: "Training Loss",       sub: "3.1973 → 0.1055" },
    { v: "94.8%",  label: "Inference Accuracy",  sub: "평가셋 200건 · exact match" },
    { v: "< 1%",   label: "Hallucination",       sub: "화이트리스트 차단" },
  ];
  const cw = (W - PAD * 2) / 3;
  stats.forEach((st, i) => {
    const x = PAD + i * cw;
    if (i > 0) vRule(s, x, stY, 1.8);
    s.addText(st.label.toUpperCase(), {
      x: x + 0.35, y: stY + 0.05, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: MUTED, charSpacing: 4, bold: true, margin: 0,
    });
    s.addText(st.v, {
      x: x + 0.35, y: stY + 0.5, w: cw - 0.55, h: 1.1,
      fontFace: FONT_H, fontSize: 54, color: INK, bold: true, margin: 0,
    });
    s.addText(st.sub, {
      x: x + 0.35, y: stY + 1.65, w: cw - 0.55, h: 0.4,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0,
    });
  });

  hRule(s, PAD, 4.85, W - PAD * 2);

  // Three test cases (compact)
  const tcY = 5.0;
  eyebrow(s, PAD, tcY, 9, "In Practice  ·  학습 외 사실관계 검증");
  const cases = [
    { tag: "제11조",    legal: "부당한 대금 감액",  fact: "경영난 이유로 대금 10% 일방 삭감.",   reason: "자금 사정은 정당 사유 아님" },
    { tag: "제3조",     legal: "서면 발급 의무",    fact: "작업 시작 전까지 계약서 미발급.",     reason: "착수 전 서면 교부는 필수" },
    { tag: "제12조의3", legal: "기술유용 금지",     fact: "기술 자료를 협의 없이 제3자 유출.", reason: "징벌적 손해배상 대상" },
  ];
  cases.forEach((c, i) => {
    const x = PAD + i * cw;
    const yy = tcY + 0.45;
    const hh = 1.8;
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.05, y: yy, w: cw - 0.25, h: hh,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.3, y: yy + 0.22, w: 1.35, h: 0.42,
      fill: { color: ACCENT_SOFT }, line: { type: "none" },
    });
    s.addText(c.tag, {
      x: x + 0.3, y: yy + 0.22, w: 1.35, h: 0.42,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, align: "center", valign: "middle", margin: 0,
    });
    s.addText(c.legal, {
      x: x + 1.75, y: yy + 0.22, w: cw - 2.0, h: 0.42,
      fontFace: FONT_B, fontSize: 13, color: INK_SOFT, bold: true, valign: "middle", margin: 0,
    });
    s.addText(c.fact, {
      x: x + 0.3, y: yy + 0.8, w: cw - 0.55, h: 0.45,
      fontFace: FONT_B, fontSize: 13.5, color: INK, italic: true, margin: 0,
    });
    s.addText("→  " + c.reason, {
      x: x + 0.3, y: yy + 1.3, w: cw - 0.55, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, margin: 0,
    });
  });

  footer(s, 2);
}

// ════════════════════════════════════════════════════════════════════
// Slide 3 — Operational Safeguards · Data
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  frame(s);
  title(s, "운영 안전장치", "데모를 넘어 실서비스로 가는 4가지 장치");

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
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: sgCardW, h: sgCardH,
      fill: { color: "FFFFFF" }, line: { color: RULE, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: sgCardH, fill: { color: ACCENT }, line: { type: "none" },
    });
    s.addText(it.n, {
      x: x + 0.3, y: y + 0.22, w: 0.85, h: 0.5,
      fontFace: FONT_H, fontSize: 24, color: ACCENT, bold: true, italic: true, margin: 0,
    });
    s.addText(it.t, {
      x: x + 1.2, y: y + 0.25, w: sgCardW - 1.35, h: 0.5,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0,
    });
    s.addText(it.d, {
      x: x + 0.3, y: y + 0.9, w: sgCardW - 0.5, h: sgCardH - 1.0,
      fontFace: FONT_B, fontSize: 13.5, color: SUB, margin: 0,
    });
  });

  // Right column
  const dpX = PAD + sgCardW * 2 + sgGap + 0.45;
  vRule(s, dpX - 0.3, sgY, sgCardH * 2 + sgGap);
  eyebrow(s, dpX, sgY, 4.5, "Data");
  s.addText("4개 조항 · 합성 500건", {
    x: dpX, y: sgY + 0.4, w: 4.5, h: 0.35,
    fontFace: FONT_B, fontSize: 14, color: INK_SOFT, bold: true, margin: 0,
  });

  const arts = [
    { code: "제3조",     name: "서면 발급" },
    { code: "제11조",    name: "대금 감액" },
    { code: "제13조",    name: "지급·지연이자" },
    { code: "제12조의3", name: "기술유용" },
  ];
  arts.forEach((a, i) => {
    const y = sgY + 0.85 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x: dpX, y, w: 4.0, h: 0.36, fill: { color: "FFFFFF" }, line: { color: RULE_SOFT, width: 0.4 },
    });
    s.addText(a.code, {
      x: dpX + 0.15, y, w: 1.4, h: 0.36,
      fontFace: FONT_B, fontSize: 13, color: ACCENT, bold: true, valign: "middle", margin: 0,
    });
    s.addText(a.name, {
      x: dpX + 1.5, y, w: 2.4, h: 0.36,
      fontFace: FONT_B, fontSize: 13, color: INK_SOFT, valign: "middle", margin: 0,
    });
  });

  // Eval
  const evY = sgY + 2.7;
  eyebrow(s, dpX, evY, 4.5, "Eval Set  ·  200");
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

  footer(s, 3);
}

// ════════════════════════════════════════════════════════════════════
// Slide 4 — Result · Limits · Insight
// ════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  frame(s);
  title(s, "Result · Limits · Insight",
    "성과와 보류 항목을 분리해서 명시");

  const colW = (W - PAD * 2 - 0.55) / 2;

  // Result (left)
  const rY = 2.7;
  eyebrow(s, PAD, rY, colW, "Result");
  const results = [
    { h: "2-Tier 분리 아키텍처",  d: "ML과 비즈니스 로직 책임 분리." },
    { h: "Fallback 가용성",       d: "Retry + CircuitBreaker로 일관된 응답." },
    { h: "이력 영속화 + 통계",    d: "JPA + 조항별 카운트 페이지." },
    { h: "회귀 평가 자동화",      d: "200건 평가셋 + GitHub Actions." },
  ];
  results.forEach((r, i) => {
    const y = rY + 0.55 + i * 0.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x: PAD, y, w: 0.08, h: 0.8, fill: { color: ACCENT }, line: { type: "none" },
    });
    s.addText(r.h, {
      x: PAD + 0.28, y, w: colW - 0.3, h: 0.4,
      fontFace: FONT_H, fontSize: 17, color: INK, bold: true, margin: 0,
    });
    s.addText(r.d, {
      x: PAD + 0.28, y: y + 0.4, w: colW - 0.3, h: 0.45,
      fontFace: FONT_B, fontSize: 13, color: SUB, margin: 0,
    });
  });

  const midX = PAD + colW + 0.3;
  vRule(s, midX, rY, 4.2);

  // Limits (right)
  const lX = midX + 0.25;
  eyebrow(s, lX, rY, colW, "Limits  ·  Next");
  const limits = [
    { area: "학습 데이터", now: "합성 500건",     next: "실판례 보강" },
    { area: "PII",        now: "정규식",          next: "NER 기반 (Presidio)" },
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

  // Insight
  const iY = 6.4;
  hRule(s, PAD, iY - 0.05, W - PAD * 2);
  eyebrow(s, PAD, iY + 0.05, 3, "Insight");
  const ins = [
    "분리는 폭발 반경을 줄이지만 네트워크 홉을 늘림 — 트레이드오프",
    "LLM 응답은 화이트리스트·스키마 후처리로 보강해야 운영 가능",
    "합성 데이터의 일반화 한계는 RAG로 일부 보완",
  ];
  ins.forEach((t, i) => {
    s.addText(`·  ${t}`, {
      x: PAD + 1.2, y: iY + 0.0 + i * 0.22, w: W - PAD * 2 - 1.2, h: 0.28,
      fontFace: FONT_B, fontSize: 12.5, color: SUB, italic: true, margin: 0,
    });
  });

  footer(s, 4);
}

const out = path.join(__dirname, "Law-Lens-AI-Portfolio-v4.pptx");
pres.writeFile({ fileName: out }).then((f) => console.log("written:", f));
