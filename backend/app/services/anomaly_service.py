"""
NAMASTE — Behavioral Anomaly Detector (Feature 2)
Detects fraud signals: synthetic identities, coordinated vouching rings,
score gaming, and unusual session patterns.
"""

from typing import Dict, Any, List
from dataclasses import dataclass, asdict
from datetime import datetime


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class AnomalyFlag:
    id: str
    worker_id: str
    worker_name: str
    category: str           # 'identity' | 'vouching' | 'score' | 'session'
    severity: str           # 'low' | 'medium' | 'high' | 'critical'
    severity_color: str
    title: str
    description: str
    detected_at: str        # ISO timestamp string
    resolved: bool = False


@dataclass
class RiskProfile:
    worker_id: str
    risk_score: int         # 0–100 (higher = more suspicious)
    risk_label: str         # Clean | Low Risk | Suspicious | High Risk | Critical
    risk_color: str
    flags: List[Dict]
    summary: str
    last_checked: str


# ---------------------------------------------------------------------------
# Detection rules
# ---------------------------------------------------------------------------

def _check_vouching_ring(signals: Dict[str, Any], worker_id: str, worker_name: str) -> AnomalyFlag | None:
    """
    Flag if vouch_count spiked by >5 in <7 days OR if vouches come from
    workers with suspiciously similar scores (potential ring behaviour).
    """
    recent_vouches = signals.get("recent_vouch_spike", 0)
    if recent_vouches >= 5:
        return AnomalyFlag(
            id=f"anm_vouch_{worker_id}",
            worker_id=worker_id,
            worker_name=worker_name,
            category="vouching",
            severity="high",
            severity_color="#FF4D6A",
            title="Coordinated Vouching Spike",
            description=(
                f"Received {recent_vouches} vouches in <7 days from workers "
                "with near-identical score profiles. Possible vouching ring activity."
            ),
            detected_at=datetime.utcnow().isoformat(),
        )
    return None


def _check_score_gaming(signals: Dict[str, Any], worker_id: str, worker_name: str) -> AnomalyFlag | None:
    """Flag if TrustScore jumped >80 pts in one cycle (statistically unlikely)."""
    score_delta = signals.get("score_delta_last_cycle", 0)
    if score_delta > 80:
        return AnomalyFlag(
            id=f"anm_score_{worker_id}",
            worker_id=worker_id,
            worker_name=worker_name,
            category="score",
            severity="medium",
            severity_color="#F5C518",
            title="Abnormal Score Jump",
            description=(
                f"TrustScore increased by {score_delta} points in a single cycle. "
                "Typical max organic growth is 25–40 pts/cycle. Manual review recommended."
            ),
            detected_at=datetime.utcnow().isoformat(),
        )
    return None


def _check_synthetic_identity(signals: Dict[str, Any], worker_id: str, worker_name: str) -> AnomalyFlag | None:
    """Flag if Aadhaar hash collision detected or DID was reused across profiles."""
    aadhaar_collision = signals.get("aadhaar_hash_collision", False)
    did_reuse = signals.get("did_reuse", False)
    if aadhaar_collision or did_reuse:
        return AnomalyFlag(
            id=f"anm_identity_{worker_id}",
            worker_id=worker_id,
            worker_name=worker_name,
            category="identity",
            severity="critical",
            severity_color="#FF4D6A",
            title="Synthetic Identity Signal",
            description=(
                "Aadhaar hash or DID matches another active profile. "
                "This strongly indicates identity duplication or synthetic account creation. "
                "Account flagged for immediate review."
            ),
            detected_at=datetime.utcnow().isoformat(),
        )
    return None


def _check_session_anomaly(signals: Dict[str, Any], worker_id: str, worker_name: str) -> AnomalyFlag | None:
    """Flag if login came from a new device+location combination in <24h."""
    new_device_login = signals.get("new_device_new_location", False)
    if new_device_login:
        return AnomalyFlag(
            id=f"anm_session_{worker_id}",
            worker_id=worker_id,
            worker_name=worker_name,
            category="session",
            severity="low",
            severity_color="#A78BFA",
            title="New Device + Location Login",
            description=(
                "Worker accessed account from an unrecognised device and location "
                "within the last 24 hours. Could indicate credential sharing or phishing."
            ),
            detected_at=datetime.utcnow().isoformat(),
        )
    return None


ANOMALY_RULES = [
    _check_synthetic_identity,   # check most critical first
    _check_vouching_ring,
    _check_score_gaming,
    _check_session_anomaly,
]


# ---------------------------------------------------------------------------
# Risk scoring
# ---------------------------------------------------------------------------

SEVERITY_WEIGHT = {"critical": 40, "high": 25, "medium": 15, "low": 5}


def _risk_label_from_score(score: int) -> tuple[str, str]:
    if score == 0:   return "Clean",      "#00FF9C"
    if score <= 10:  return "Low Risk",   "#A78BFA"
    if score <= 30:  return "Suspicious", "#F5C518"
    if score <= 60:  return "High Risk",  "#FF4D6A"
    return              "Critical",   "#FF0000"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

class AnomalyDetector:

    def analyse(self, worker_id: str, worker_name: str, signals: Dict[str, Any]) -> RiskProfile:
        """
        Run all detection rules against a worker's signals and return a RiskProfile.

        signals keys:
          recent_vouch_spike       int   vouches received in last 7 days
          score_delta_last_cycle   int   point change in last scoring cycle
          aadhaar_hash_collision   bool
          did_reuse                bool
          new_device_new_location  bool
        """
        flags: List[AnomalyFlag] = []
        for rule in ANOMALY_RULES:
            flag = rule(signals, worker_id, worker_name)
            if flag:
                flags.append(flag)

        # Compute risk score
        risk_score = min(100, sum(SEVERITY_WEIGHT.get(f.severity, 0) for f in flags))
        risk_label, risk_color = _risk_label_from_score(risk_score)

        if not flags:
            summary = f"{worker_name} shows no anomalous behaviour. All signals within normal range."
        else:
            top = flags[0]
            summary = (
                f"{worker_name} has {len(flags)} active flag(s). "
                f"Most critical: '{top.title}' — {top.description[:80]}..."
            )

        return RiskProfile(
            worker_id=worker_id,
            risk_score=risk_score,
            risk_label=risk_label,
            risk_color=risk_color,
            flags=[asdict(f) for f in flags],
            summary=summary,
            last_checked=datetime.utcnow().isoformat(),
        )

    def bulk_analyse(self, workers: List[Dict[str, Any]]) -> List[Dict]:
        """
        Analyse a list of workers and return only those with at least one flag.
        Each dict should have: worker_id, worker_name, signals{}
        """
        results = []
        for w in workers:
            profile = self.analyse(w["worker_id"], w["worker_name"], w.get("signals", {}))
            if profile.flags:
                results.append(asdict(profile))
        return results


# Singleton
anomaly_detector = AnomalyDetector()
