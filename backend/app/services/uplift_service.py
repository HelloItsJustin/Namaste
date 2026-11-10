"""
NAMASTE — Financial Uplift Recommendations Engine
Personalized 90-day growth plan for informal workers.

For each worker, this service:
  1. Analyses their current trust score signals
  2. Identifies the highest-leverage improvement actions
  3. Projects their TrustScore 90 days from now
  4. Matches them against government schemes they qualify for
  5. Recommends gig platforms that would boost their score fastest
"""

from typing import Dict, List, Any
from dataclasses import dataclass, asdict


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class UpliftRecommendation:
    id: str
    category: str           # 'platform' | 'identity' | 'behaviour' | 'finance'
    title: str
    description: str
    action_steps: List[str]
    impact_pts: int         # estimated TrustScore delta
    difficulty: str         # 'Easy' | 'Medium' | 'Hard'
    timeframe_days: int
    icon: str               # maps to lucide icon name on frontend
    color: str              # accent color for card


@dataclass
class SchemeMatch:
    name: str
    authority: str
    benefit: str
    eligible: bool
    reason: str             # why eligible or what's needed to become eligible
    apply_url: str


@dataclass
class PlatformRecommendation:
    name: str
    icon: str
    color: str
    score_boost: int        # estimated pts if worker joins
    reason: str


@dataclass
class UpliftPlan:
    current_score: int
    projected_score: int
    projected_in_days: int
    score_band: str
    projected_band: str
    recommendations: List[Dict]
    schemes: List[Dict]
    platform_recommendations: List[Dict]
    summary: str


# ---------------------------------------------------------------------------
# Score band helper
# ---------------------------------------------------------------------------

def _band(score: int) -> str:
    if score >= 800: return 'Excellent'
    if score >= 720: return 'Good'
    if score >= 650: return 'Fair'
    if score >= 550: return 'Developing'
    return 'Starting'


# ---------------------------------------------------------------------------
# Core recommendation logic
# ---------------------------------------------------------------------------

# Each rule receives the worker's normalised signals (all 0-1) and returns
# an UpliftRecommendation if the rule fires, else None.

def _rule_add_platform(signals: Dict[str, Any]) -> UpliftRecommendation | None:
    """Fire when worker is on only one platform (platform_count missing or 1)."""
    if signals.get('platform_count', 1) <= 1:
        return UpliftRecommendation(
            id='rec_add_platform',
            category='platform',
            title='Join a second gig platform',
            description=(
                'Workers active on 2+ platforms earn an average of +28 TrustScore '
                'points due to higher income diversification signals.'
            ),
            action_steps=[
                'Download Zomato or Rapido partner app',
                'Complete onboarding with your existing Aadhaar + DL credentials',
                'Complete at least 20 deliveries to trigger income signal',
            ],
            impact_pts=28,
            difficulty='Easy',
            timeframe_days=30,
            icon='PlusCircle',
            color='#F5C518',
        )
    return None


def _rule_link_pan_eshram(signals: Dict[str, Any]) -> UpliftRecommendation | None:
    """Fire when pan_linked is falsy."""
    if not signals.get('pan_linked', False):
        return UpliftRecommendation(
            id='rec_link_pan',
            category='identity',
            title='Link PAN to your e-Shram profile',
            description=(
                'Linking PAN confirms formal income history to lenders and adds '
                'an identity signal worth +15 TrustScore points instantly.'
            ),
            action_steps=[
                'Visit eshram.gov.in and log in with your UAN',
                'Go to Profile → Link PAN',
                'Verify via OTP sent to Aadhaar-registered mobile',
            ],
            impact_pts=15,
            difficulty='Easy',
            timeframe_days=7,
            icon='Link',
            color='#A78BFA',
        )
    return None


def _rule_boost_completion(signals: Dict[str, Any]) -> UpliftRecommendation | None:
    """Fire when job_completion_rate < 0.96."""
    rate = signals.get('job_completion_rate', 0.5)
    if rate < 0.96:
        gap = round((0.96 - rate) * 100, 1)
        return UpliftRecommendation(
            id='rec_completion',
            category='behaviour',
            title=f'Raise completion rate by {gap}%',
            description=(
                'Job completion rate is your highest-weight signal (25%). '
                'Reaching 96% unlocks the top-tier bracket and adds +13 points.'
            ),
            action_steps=[
                'Avoid accepting orders outside your confirmed delivery zone',
                'Enable "Do Not Disturb" during peak hours to reduce cancellations',
                'Complete 60 consecutive days above 95% to trigger the bracket upgrade',
            ],
            impact_pts=13,
            difficulty='Medium',
            timeframe_days=60,
            icon='TrendingUp',
            color='#00FF9C',
        )
    return None


def _rule_add_vouch(signals: Dict[str, Any]) -> UpliftRecommendation | None:
    """Fire when vouch_count < 10."""
    count = signals.get('vouch_count', 0)
    if count < 10:
        needed = 10 - count
        return UpliftRecommendation(
            id='rec_vouch',
            category='behaviour',
            title=f'Get {needed} more peer vouches',
            description=(
                'Peer vouches from verified workers build community trust. '
                'Each vouch from a worker with score >700 is worth ~10 points.'
            ),
            action_steps=[
                'Open the Vouching tab and share your Worker ID with colleagues',
                'Prioritise asking co-workers with high TrustScores (>700)',
                f'Reach {10} total vouches to unlock the max peer signal',
            ],
            impact_pts=10,
            difficulty='Medium',
            timeframe_days=45,
            icon='Users',
            color='#6C63FF',
        )
    return None


def _rule_savings_habit(signals: Dict[str, Any]) -> UpliftRecommendation | None:
    """Fire when no bank link or low balance signal."""
    if not signals.get('bank_linked', False):
        return UpliftRecommendation(
            id='rec_savings',
            category='finance',
            title='Link a bank account & build savings',
            description=(
                'A verified bank account with consistent balance signals financial '
                'stability to lenders and adds +12 TrustScore points.'
            ),
            action_steps=[
                'Open a zero-balance Jan Dhan or Airtel Payments Bank account',
                'Set up weekly auto-transfer of ₹500 from your UPI earnings',
                'Maintain for 90 days — NAMASTE will verify via account aggregator',
            ],
            impact_pts=12,
            difficulty='Hard',
            timeframe_days=90,
            icon='Landmark',
            color='#00b8ff',
        )
    return None


RULES = [
    _rule_add_platform,
    _rule_link_pan_eshram,
    _rule_boost_completion,
    _rule_add_vouch,
    _rule_savings_habit,
]


# ---------------------------------------------------------------------------
# Government scheme matching
# ---------------------------------------------------------------------------

def _match_schemes(signals: Dict[str, Any]) -> List[SchemeMatch]:
    schemes = []

    eshram = signals.get('eshram_status', False)
    score = signals.get('trust_score', 500)
    has_bank = signals.get('bank_linked', False)

    # PM SVANidhi — micro credit for street vendors / informal workers
    schemes.append(SchemeMatch(
        name='PM SVANidhi',
        authority='Ministry of Housing & Urban Affairs',
        benefit='₹10,000 – ₹50,000 working capital loan at 7% p.a.',
        eligible=eshram,
        reason='Eligible via e-Shram registration' if eshram else 'Register on e-Shram first',
        apply_url='https://pmsvanidhi.mohua.gov.in',
    ))

    # e-Shram Accidental Insurance
    schemes.append(SchemeMatch(
        name='e-Shram Accidental Insurance',
        authority='Ministry of Labour & Employment',
        benefit='₹2 lakh accidental death / ₹1 lakh partial disability cover',
        eligible=eshram,
        reason='Auto-enrolled with e-Shram card' if eshram else 'Register on e-Shram to get auto-enrolled',
        apply_url='https://eshram.gov.in',
    ))

    # PMEGP — entrepreneurship support
    schemes.append(SchemeMatch(
        name='PMEGP',
        authority='Ministry of MSME',
        benefit='Up to ₹25 lakh subsidy for micro-enterprise setup',
        eligible=has_bank and score >= 650,
        reason=(
            'Eligible with verified bank account and TrustScore ≥ 650'
            if has_bank and score >= 650
            else 'Requires verified bank account and TrustScore ≥ 650'
        ),
        apply_url='https://www.kviconline.gov.in/pmegpeportal',
    ))

    # Pradhan Mantri Jeevan Jyoti Bima Yojana
    schemes.append(SchemeMatch(
        name='PM Jeevan Jyoti Bima Yojana',
        authority='Ministry of Finance',
        benefit='₹2 lakh life insurance at ₹436/year',
        eligible=has_bank,
        reason='Available with any savings bank account' if has_bank else 'Open a savings account to access',
        apply_url='https://jansuraksha.gov.in',
    ))

    return schemes


# ---------------------------------------------------------------------------
# Platform recommendations
# ---------------------------------------------------------------------------

PLATFORM_BOOSTS = [
    PlatformRecommendation(
        name='Zomato',
        icon='ShoppingBag',
        color='#E23744',
        score_boost=28,
        reason='High order volume in metro areas; strong income consistency signal',
    ),
    PlatformRecommendation(
        name='Rapido',
        icon='Bike',
        color='#F5C518',
        score_boost=22,
        reason='Bike taxi model builds platform tenure fast; supplements delivery income',
    ),
    PlatformRecommendation(
        name='Urban Company',
        icon='Home',
        color='#1B5EAB',
        score_boost=18,
        reason='Skill-based rating adds a quality signal beyond delivery metrics',
    ),
    PlatformRecommendation(
        name='Porter',
        icon='Truck',
        color='#FF6B35',
        score_boost=15,
        reason='Logistics gigs provide high per-trip income; boosts income consistency',
    ),
]

def _recommend_platforms(signals: Dict[str, Any]) -> List[PlatformRecommendation]:
    """Return platforms the worker is NOT already on, ranked by boost."""
    current_platforms = [p.lower() for p in signals.get('platforms', [])]
    return [
        p for p in PLATFORM_BOOSTS
        if p.name.lower() not in current_platforms
    ][:3]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

class UpliftEngine:
    """
    Generates a personalised 90-day financial uplift plan for a worker.
    """

    def generate_plan(self, signals: Dict[str, Any]) -> UpliftPlan:
        """
        signals keys (all optional, fall back to conservative defaults):
          trust_score           int    current score
          job_completion_rate   float  0-1
          income_consistency    float  0-1
          platform_tenure_months int
          payment_punctuality   float  0-1
          vouch_count           int
          eshram_status         bool
          pan_linked            bool
          bank_linked           bool
          platform_count        int
          platforms             list[str]
        """
        current_score = signals.get('trust_score', 500)

        # Run rules — take top 3 by impact
        all_recs: List[UpliftRecommendation] = []
        for rule in RULES:
            rec = rule(signals)
            if rec:
                all_recs.append(rec)

        # Sort by impact descending, pick top 3
        top_recs = sorted(all_recs, key=lambda r: r.impact_pts, reverse=True)[:3]

        # Project score: sum of top-3 impacts, capped at 900
        total_impact = sum(r.impact_pts for r in top_recs)
        projected_score = min(900, current_score + total_impact)
        projected_in_days = max(r.timeframe_days for r in top_recs) if top_recs else 90

        schemes = _match_schemes(signals)
        platforms = _recommend_platforms(signals)

        summary = (
            f"Following your 3 personalised steps could raise your TrustScore "
            f"from {current_score} to {projected_score} in {projected_in_days} days, "
            f"moving you from '{_band(current_score)}' to '{_band(projected_score)}' band "
            f"and unlocking better loan terms."
        )

        return UpliftPlan(
            current_score=current_score,
            projected_score=projected_score,
            projected_in_days=projected_in_days,
            score_band=_band(current_score),
            projected_band=_band(projected_score),
            recommendations=[asdict(r) for r in top_recs],
            schemes=[asdict(s) for s in schemes],
            platform_recommendations=[asdict(p) for p in platforms],
            summary=summary,
        )

    def get_projected_score(self, signals: Dict[str, Any]) -> int:
        """Lightweight helper used by the lender verify page."""
        plan = self.generate_plan(signals)
        return plan.projected_score


# Singleton
uplift_engine = UpliftEngine()
