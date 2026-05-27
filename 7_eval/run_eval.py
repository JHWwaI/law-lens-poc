"""
회귀 평가 러너.
FastAPI /infer 엔드포인트에 eval_set.jsonl을 흘려 보내고 다음을 계산한다:
  - article 매칭 정확도 (null 케이스 포함, exact match)
  - 응답 시간 P50 / P95
임계치 미달 시 exit code 1.
"""
import argparse
import json
import statistics
import sys
import time
from pathlib import Path
from typing import Optional

import requests

DEFAULT_THRESHOLD = 0.85
DEFAULT_P95_MS = 8000


def load_cases(path: Path):
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def article_matches(predicted: Optional[str], expected: Optional[str]) -> bool:
    if expected is None:
        return predicted is None
    if predicted is None:
        return False
    return predicted.replace(" ", "") == expected.replace(" ", "")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:8000")
    ap.add_argument("--cases", default=str(Path(__file__).parent / "eval_set.jsonl"))
    ap.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)
    ap.add_argument("--p95-ms", type=int, default=DEFAULT_P95_MS)
    ap.add_argument("--report", default="eval_report.json")
    args = ap.parse_args()

    cases = list(load_cases(Path(args.cases)))
    if not cases:
        print("no cases loaded", file=sys.stderr)
        return 2

    correct = 0
    latencies = []
    failures = []

    for case in cases:
        started = time.time()
        try:
            r = requests.post(
                f"{args.base_url}/infer",
                json={"fact": case["fact"], "top_k": 1},
                timeout=30,
            )
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            failures.append({"id": case["id"], "error": str(e)})
            continue

        elapsed_ms = int((time.time() - started) * 1000)
        latencies.append(elapsed_ms)

        predicted = data.get("article")
        ok = article_matches(predicted, case.get("expected_article"))
        if ok:
            correct += 1
        else:
            failures.append({
                "id": case["id"],
                "fact": case["fact"],
                "expected": case.get("expected_article"),
                "predicted": predicted,
            })

    total = len(cases)
    accuracy = correct / total
    p50 = statistics.median(latencies) if latencies else 0
    p95 = sorted(latencies)[int(len(latencies) * 0.95) - 1] if latencies else 0

    report = {
        "total": total,
        "correct": correct,
        "accuracy": accuracy,
        "p50_ms": p50,
        "p95_ms": p95,
        "failures": failures,
        "threshold": args.threshold,
        "p95_budget_ms": args.p95_ms,
    }

    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print("=" * 60)
    print(f"Accuracy: {accuracy:.3%}  ({correct}/{total})")
    print(f"Latency:  p50={p50}ms  p95={p95}ms")
    print(f"Failures: {len(failures)}")
    print("=" * 60)

    if accuracy < args.threshold:
        print(f"FAIL: accuracy {accuracy:.3%} < threshold {args.threshold:.3%}", file=sys.stderr)
        return 1
    if p95 > args.p95_ms:
        print(f"FAIL: p95 {p95}ms > budget {args.p95_ms}ms", file=sys.stderr)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
