"""
이재환_포트폴리오_v2.pptx 의 글자색만 그라데이션 burgundy로 변경.
프로젝트 번호(01~05) + 각 프로젝트 헤더 마크의 색을 일괄 교체.
"""
import sys
sys.stdout.reconfigure(encoding="utf-8")

from copy import deepcopy
from pptx import Presentation
from pptx.dml.color import RGBColor

SRC = "C:/Users/dolch/OneDrive/Desktop/2026/취준/프로젝트/law-lens-poc/docs/_tmp_kakao.pptx"
DST = "C:/Users/dolch/OneDrive/Desktop/2026/취준/포트폴리오/수정/이재환_포트폴리오_v4.pptx"

# 01 연함 → 05 진함 (점점 진해지게)
PALETTE = {
    "01": RGBColor(0xC8, 0x83, 0x8E),  # Dusty rose (가장 연함)
    "02": RGBColor(0x9C, 0x48, 0x56),  # Rose burgundy
    "03": RGBColor(0x6E, 0x23, 0x2F),  # Classic burgundy (기본)
    "04": RGBColor(0x5A, 0x1B, 0x27),  # Deep burgundy
    "05": RGBColor(0x3E, 0x0F, 0x19),  # Deepest wine (가장 진함)
}

# 프로젝트 마크 문자열 → 색
MARK_PREFIX_TO_COLOR = {
    "01  ·": PALETTE["01"],
    "02  ·": PALETTE["02"],
    "03  ·": PALETTE["03"],
    "04  ·": PALETTE["04"],
    "05  ·": PALETTE["05"],
}


def set_run_color(run, color: RGBColor) -> None:
    """단일 run의 글자색 변경 (테마 색 무시하고 RGB 강제)."""
    run.font.color.rgb = color


def recolor_text_in_shape(shape, target_text: str, color: RGBColor) -> int:
    """shape 안에서 target_text가 들어있는 run들의 색을 변경. 변경 개수 반환."""
    n = 0
    if not shape.has_text_frame:
        return 0
    for para in shape.text_frame.paragraphs:
        # 단순한 케이스: 전체 텍스트가 target과 같음
        full = "".join(r.text for r in para.runs)
        if full.strip() == target_text:
            for r in para.runs:
                if r.text.strip():
                    set_run_color(r, color)
                    n += 1
        elif target_text in full:
            # 부분 일치: 해당 run만
            for r in para.runs:
                if target_text in r.text:
                    set_run_color(r, color)
                    n += 1
    return n


def recolor_prefix_marks(shape) -> int:
    """프로젝트 헤더 마크 (예: '01  ·  LAW-LENS AI') 가 있으면 해당 색으로."""
    n = 0
    if not shape.has_text_frame:
        return 0
    text = shape.text_frame.text.strip()
    for prefix, color in MARK_PREFIX_TO_COLOR.items():
        if text.startswith(prefix):
            # 모든 run의 색을 변경
            for para in shape.text_frame.paragraphs:
                for r in para.runs:
                    if r.text.strip():
                        set_run_color(r, color)
                        n += 1
            return n
    return 0


def main():
    print(f"Loading: {SRC}")
    pres = Presentation(SRC)

    total_changes = 0

    for slide_idx, slide in enumerate(pres.slides, 1):
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            text = shape.text_frame.text.strip()

            # 1) 슬라이드 2 (TOC) — "01" "02" 등 단독 숫자
            if text in PALETTE:
                color = PALETTE[text]
                for para in shape.text_frame.paragraphs:
                    for r in para.runs:
                        if r.text.strip():
                            set_run_color(r, color)
                            total_changes += 1
                print(f"  [Slide {slide_idx}] '{text}' → {hex_str(color)}")
                continue

            # 2) "p. 03" "p. 08" 등 페이지 번호
            page_map = {
                "p. 03": PALETTE["01"], "p. 08": PALETTE["02"],
                "p. 13": PALETTE["03"], "p. 16": PALETTE["04"],
                "p. 19": PALETTE["05"], "p. 20": PALETTE["05"], "p. 21": PALETTE["05"],
            }
            if text in page_map:
                color = page_map[text]
                for para in shape.text_frame.paragraphs:
                    for r in para.runs:
                        if r.text.strip():
                            set_run_color(r, color)
                            total_changes += 1
                continue

            # 3) 프로젝트 헤더 마크 ("01  ·  LAW-LENS AI" 등)
            n = recolor_prefix_marks(shape)
            if n:
                total_changes += n
                print(f"  [Slide {slide_idx}] mark '{text[:30]}...' recolored")

    pres.save(DST)
    print(f"\n총 변경: {total_changes}건")
    print(f"저장됨: {DST}")


def hex_str(c: RGBColor) -> str:
    return f"#{int(c[0]):02X}{int(c[1]):02X}{int(c[2]):02X}"


if __name__ == "__main__":
    main()
