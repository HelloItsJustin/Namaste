"""
NAMASTE — Loan Explainer & Negotiation AI (Feature 1)
Conversational AI that explains TrustScores to workers and generates
loan recommendations for lenders.
"""

from typing import Dict, Any, List
from dataclasses import dataclass, asdict


# ---------------------------------------------------------------------------
# Worker-facing: score explanation + improvement Q&A
# ---------------------------------------------------------------------------

WORKER_RESPONSES = {
    "why is my score low": lambda s: (
        f"Your score of {s['score']} is affected mainly by "
        + _weakest_signal(s)
        + ". Improving that one factor can add 15–30 points within 60 days."
    ),
    "how do i improve": lambda s: (
        "Three fastest ways to improve: "
        "① Join a second platform for income diversification (+28 pts), "
        "② Link your PAN to e-Shram (+15 pts), "
        "③ Maintain 96% job completion for 60 days (+13 pts)."
    ),
    "what is trust score": lambda _: (
        "Your TrustScore (300–900) is a creditworthiness signal built from "
        "your work history, identity verification, platform tenure, peer vouches, "
        "and payment behaviour. Lenders use it to decide loan eligibility — "
        "no raw personal data is ever shared."
    ),
    "how is score calculated": lambda s: (
        f"Your score of {s['score']} comes from 6 signals: "
        "Job Completion (25%), Income Consistency (20%), Platform Tenure (15%), "
        "Payment Punctuality (15%), Peer Vouches (15%), e-Shram Status (10%). "
        f"Your strongest signal is {_strongest_signal(s)} and weakest is {_weakest_signal(s)}."
    ),
    "loan": lambda s: _loan_suggestion(s),
    "borrow": lambda s: _loan_suggestion(s),
    "credit": lambda s: _loan_suggestion(s),
    "schemes": lambda _: (
        "Based on your profile you qualify for: "
        "① PM SVANidhi — ₹10,000–₹50,000 at 7% p.a. (apply at pmsvanidhi.mohua.gov.in), "
        "② e-Shram Accidental Insurance — ₹2 lakh cover (auto-enrolled). "
        "Complete your bank linking to also access PMEGP subsidies."
    ),
    "dividend": lambda s: (
        f"You have earned ₹{s.get('total_dividends', 3847):.2f} in data dividends so far. "
        "Every time a lender or platform accesses your anonymised data with your consent, "
        "a share of that value is deposited to your wallet automatically via smart contract."
    ),
    "default": lambda s: (
        f"Your TrustScore is {s['score']} ({_band(s['score'])} band). "
        "I can help you understand your score, find ways to improve it, "
        "check loan eligibility, or discover government schemes. What would you like to know?"
    ),
}


def _band(score: int) -> str:
    if score >= 800: return "Excellent"
    if score >= 720: return "Good"
    if score >= 650: return "Fair"
    if score >= 550: return "Developing"
    return "Starting"


def _weakest_signal(signals: Dict) -> str:
    checks = {
        "low job completion rate": signals.get("job_completion_rate", 1) < 0.90,
        "inconsistent income": signals.get("income_consistency", 1) < 0.75,
        "short platform tenure": signals.get("platform_tenure_months", 36) < 12,
        "few peer vouches": signals.get("vouch_count", 10) < 5,
        "missing e-Shram registration": not signals.get("eshram_status", True),
    }
    for label, fired in checks.items():
        if fired:
            return label
    return "platform tenure (keep going!)"


def _strongest_signal(signals: Dict) -> str:
    scores = {
        "Job Completion": signals.get("job_completion_rate", 0.5),
        "Income Consistency": signals.get("income_consistency", 0.5),
        "Payment Punctuality": signals.get("payment_punctuality", 0.5),
    }
    return max(scores, key=scores.get)


def _loan_suggestion(signals: Dict) -> str:
    score = signals.get("score", 500)
    if score >= 750:
        return (
            f"With a score of {score} you are pre-qualified for up to ₹50,000 "
            "at 12% p.a. from partner NBFCs (Ujjivan SFB, IIFL Finance). "
            "Generate a ZK-Proof from the ZK Proof tab to share with your lender."
        )
    elif score >= 650:
        return (
            f"With a score of {score} you qualify for ₹15,000–₹25,000 "
            "at 14–16% p.a. Improving your score by 50 points unlocks better terms."
        )
    else:
        return (
            f"Your score of {score} currently qualifies for microloans up to ₹10,000. "
            "Follow your Uplift Plan to reach the ₹25,000 bracket in 90 days."
        )


def answer_worker_question(question: str, signals: Dict[str, Any]) -> str:
    """Match question to a canned response handler and return a reply string."""
    q = question.lower().strip()
    for keyword, handler in WORKER_RESPONSES.items():
        if keyword in q:
            return handler(signals)
    return WORKER_RESPONSES["default"](signals)


# ---------------------------------------------------------------------------
# Lender-facing: AI loan recommendation card
# ---------------------------------------------------------------------------

@dataclass
class LoanRecommendation:
    worker_id: str
    score: int
    score_band: str
    max_loan_amount: int
    suggested_amount: int
    interest_rate_pct: float
    tenure_months: int
    monthly_emi: float
    risk_label: str          # Low / Moderate / High
    risk_color: str
    recommended_lenders: List[str]
    ai_summary: str
    key_strengths: List[str]
    watch_flags: List[str]


def generate_loan_recommendation(worker_signals: Dict[str, Any]) -> LoanRecommendation:
    """
    Given a worker's trust signals, generate an AI loan recommendation
    for the lender's verify page.
    """
    score = worker_signals.get("score", 500)
    name  = worker_signals.get("name", "Worker")

    # Loan parameters by band
    if score >= 750:
        max_amt, suggested, rate, tenure = 50000, 35000, 12.0, 18
        risk_label, risk_color = "Low Risk", "#00FF9C"
        lenders = ["Ujjivan SFB", "IIFL Finance", "CreditAccess Grameen"]
    elif score >= 650:
        max_amt, suggested, rate, tenure = 25000, 15000, 14.5, 12
        risk_label, risk_color = "Moderate Risk", "#F5C518"
        lenders = ["Arohan Finance", "Muthoot Microfin", "Grameen Koota"]
    elif score >= 550:
        max_amt, suggested, rate, tenure = 10000, 7000, 18.0, 12
        risk_label, risk_color = "High Risk", "#FF4D6A"
        lenders = ["Fusion Microfinance", "Spandana Sphoorty"]
    else:
        max_amt, suggested, rate, tenure = 5000, 3000, 22.0, 6
        risk_label, risk_color = "Very High Risk", "#FF4D6A"
        lenders = ["Grameen Koota"]

    # Monthly EMI (flat rate approximation)
    monthly_emi = round((suggested * (1 + (rate / 100) * (tenure / 12))) / tenure, 2)

    # Strengths and watch flags
    strengths, flags = [], []

    if worker_signals.get("job_completion_rate", 0) >= 0.90:
        strengths.append("94%+ job completion — top-tier reliability")
    if worker_signals.get("income_consistency", 0) >= 0.80:
        strengths.append("18 months of consistent platform income")
    if worker_signals.get("eshram_status"):
        strengths.append("Government-registered via e-Shram")
    if worker_signals.get("vouch_count", 0) >= 5:
        strengths.append(f"{worker_signals['vouch_count']} verified peer vouches")

    if worker_signals.get("platform_count", 1) == 1:
        flags.append("Single platform dependency — income concentration risk")
    if not worker_signals.get("bank_linked", False):
        flags.append("No verified savings account on file")
    if worker_signals.get("vouch_count", 10) < 3:
        flags.append("Low peer vouch count")

    summary = (
        f"{name} presents a {risk_label.lower()} profile with a TrustScore of {score} "
        f"({_band(score)} band). "
        f"Recommended disbursement of ₹{suggested:,} at {rate}% p.a. over {tenure} months "
        f"(EMI ₹{monthly_emi:,.0f}/mo). "
        + (f"Key strength: {strengths[0]}." if strengths else "")
        + (f" Watch: {flags[0]}." if flags else "")
    )

    return LoanRecommendation(
        worker_id=worker_signals.get("worker_id", ""),
        score=score,
        score_band=_band(score),
        max_loan_amount=max_amt,
        suggested_amount=suggested,
        interest_rate_pct=rate,
        tenure_months=tenure,
        monthly_emi=monthly_emi,
        risk_label=risk_label,
        risk_color=risk_color,
        recommended_lenders=lenders,
        ai_summary=summary,
        key_strengths=strengths,
        watch_flags=flags,
    )


# Singleton helper
chat_service_answer   = answer_worker_question
loan_recommendation   = generate_loan_recommendation
