
NAMASTE

This is a forked repository. The original project was created as an open-source framework for informal worker trust infrastructure. This fork extends it with three AI features—an intelligent chat assistant, a behavioral anomaly detector, and a personalized financial uplift engine—built as part of an evaluation to identify and implement the most impactful AI additions to the platform.
NAMASTE is an open-source framework for building a consent-first digital trust passport and data dividend system for informal workers. The platform is designed to turn verified work history, identity signals, and consented platform data into a reusable trust asset for credit providers, while protecting worker privacy and enabling shared data value.

📋 Overview

The NAMASTE project brings together identity, data security, machine learning, and blockchain in a single architecture. It is intended for use cases where informal workers need a portable reputation score, evidence of trustworthiness, and a secure way to authorize data sharing without exposing private details.
The system is organized into three main components:
• Modern Frontend: Built with React, Vite, and TypeScript.
• Backend Service: Implemented in Python and Flask.
• Smart Contract Logic: Handles the trust score registry and data dividend management.

🚀 What Was Added in This Fork

The original platform scored workers but stopped there. A worker could see their TrustScore but had no way to understand it, act on it, or know if the system was treating them fairly. Lenders had no AI layer to accelerate decisions. This fork adds three AI features that close that loop.

Feature 1: AI Chat Assistant + Loan Explainer

• Why it was added: A TrustScore without explanation is a black box. Informal workers in India—the target users—are often unfamiliar with formal financial systems. If their score is low, they need to know why and what to do. If a lender reviews their profile, they need a fast, structured recommendation rather than raw numbers.
• What it does:
	• Worker-facing conversational AI that answers plain-English questions about their score, improvement steps, loan eligibility, and government scheme matches.
	• Lender-facing AI Loan Recommendation Card that auto-generates a suggested loan amount, interest rate, monthly EMI, risk label, key strengths, and watch flags for every verified worker.
• Files added:
	• backend/app/services/chat_service.py — Q&A engine and loan recommendation logic
	• frontend/src/pages/ChatPage.tsx — Chat UI with quick action chips
	• frontend/src/components/ui/LoanRecommendationCard.tsx — Lender-side recommendation card
• Files changed:
	• backend/app/api/workers.py — Added /chat and /loan-recommendation endpoints
	• frontend/src/pages/lender/LenderVerifyPage.tsx — Loan card injected after ZK verification
	• frontend/src/components/layout/Sidebar.tsx — Added "AI Assistant" nav item
	• frontend/src/App.tsx — Added /chat route

Feature 2: Behavioral Anomaly Detector

• Why it was added: The TrustScore becomes worthless if it can be gamed. Without fraud detection, bad actors can create fake vouching rings, duplicate identities, or artificially spike their scores. Lenders would stop trusting the platform entirely. This feature also protects genuine workers—if someone misuses their credentials, the system flags it before it causes damage.
• What it does:
	• Runs four continuous detection rules: Synthetic identity checks, coordinated vouching spikes, abnormal score jumps, and new device + location logins.
	• Assigns a risk profile containing a risk score (0–100) and risk label (Clean, Low, Suspicious, High, Critical) to each worker.
	• Provides an Admin Panel page showing all active flags with severity badges, expandable detail views, and "Mark Resolved" actions.
	• Displays a live anomaly signal density heatmap tracking metrics for the last 24 hours.
• Files added:
	• backend/app/services/anomaly_service.py — Detection rules, risk scoring, and bulk analysis
	• frontend/src/pages/admin/AdminAnomalyPage.tsx — Admin dashboard for security flags
• Files changed:
	• backend/app/api/workers.py — Added /anomaly-check endpoint
	• frontend/src/components/layout/Sidebar.tsx — Added "Anomaly Detector" with a live red notification badge
	• frontend/src/App.tsx — Added /admin/anomaly route

Feature 3: Personalized Financial Uplift Engine

• Why it was added: This is the most mission-aligned feature. NAMASTE's core goal is financial inclusion—not just measuring workers but helping them move up. The uplift engine converts a static score into an active coaching tool. It tells workers exactly what to do next, matches them against government schemes they already qualify for but may not know about, and gives lenders a projected score so decisions are forward-looking.
• What it does:
	• Analyzes a worker's current trust signals and executes five targeted improvement rules.
	• Generates a ranked top-3 action plan with difficulty metrics, clear timeframes, and estimated score impacts.
	• Projects the TrustScore 60–90 days out assuming the worker successfully executes the recommended steps.
	• Matches workers against four government schemes (PM SVANidhi, e-Shram Insurance, PMEGP, PMJJBY) with live eligibility status and direct application links.
	• Recommends new gig platforms that the worker is not yet registered on, ranked by expected score boost.
	• Exposes a projected score badge directly on the lender verification page.
• Files added:
	• backend/app/services/uplift_service.py — Recommendation engine, scheme matcher, and platform ranker
	• frontend/src/pages/UpliftPage.tsx — Full financial uplift planning portal
	• backend/app/models/models.py — Added UpliftRecommendation database table
• Files changed:
	• backend/app/api/workers.py — Added /uplift and /uplift/schemes endpoints
	• frontend/src/store/useStore.ts — Added UpliftData types and global state
	• frontend/src/lib/mockData.ts — Injected rich mock data for all three new features
	• frontend/src/components/layout/Sidebar.tsx — Added "Uplift Plan" nav item
	• frontend/src/pages/lender/LenderVerifyPage.tsx — Integrated projected score badge
	• frontend/src/App.tsx — Added /uplift route
