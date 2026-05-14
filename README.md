# NAMASTE

NAMASTE is an open-source framework for building a consent-first digital trust passport and data dividend system for informal workers. The platform is designed to turn verified work history, identity signals, and consented platform data into a reusable trust asset for credit providers, while protecting worker privacy and enabling shared data value.

## Overview

The NAMASTE project brings together identity, data security, machine learning, and blockchain in a single architecture. It is intended for use cases where informal workers need a portable reputation score, evidence of trustworthiness, and a secure way to authorize data sharing without exposing private details.

The system is organized into three main components:

- A modern frontend built with React, Vite, and TypeScript.
- A backend service implemented in Python and Flask.
- Smart contract logic for trust score registry and data dividend management.

## Goals

- Provide a verified digital identity flow for informal workers.
- Protect sensitive data using device-side encryption and consent controls.
- Create a transparent trust score model with explainability.
- Enable privacy-preserving verification for lenders and service providers.
- Support data dividends so workers receive value from their information.

## Features

### Identity and Onboarding

- DID-native onboarding that supports decentralized identifiers.
- Integration points for Aadhaar and e-Shram identity signals.
- Consent-driven identity binding so user data is only shared with permission.

### Data Security and Privacy

- Device-side encryption using the Jlyn Cipher implementation.
- Encrypted storage and secure data transmission between frontend and backend.
- Privacy-preserving verification with zero-knowledge proof concepts.

### Trust and Scoring

- AI-derived TrustScore that aggregates worker data and platform activity.
- Score range designed to provide a stable creditworthiness signal.
- SHAP-based explainability to identify which features influenced the score.

### Data Dividends and Value Sharing

- Smart contract-based dividend distribution logic.
- Worker-first reward model that returns a share of value when data is reused.
- Transparent ledger of dividend allocations and payouts.

### Administrative and Lender Interfaces

- Admin pages for monitoring contracts, trust score results, and worker activity.
- Lender pages for reviewing reports and verifying borrower credentials.
- Workflow views for onboarding, vouching, and verification.

## Architecture and Repository Structure

The repository is organized to separate concerns clearly. The current layout is:

- `frontend/` — web application and user interface.
- `backend/` — Flask API, service logic, and asynchronous task handling.
- `contracts/` — Solidity smart contracts for on-chain trust and dividend features.
- `ai/` — model architecture, scoring logic, and explainability utilities.
- `shared/` — configuration data and shared assets.

### Frontend Structure

- `frontend/src/` — main application code.
- `frontend/src/components/` — reusable UI components and layouts.
- `frontend/src/pages/` — top-level page views for users, lenders, and admins.
- `frontend/src/store/` — state management using Zustand.
- `frontend/src/lib/` — helper modules and mock data.

### Backend Structure

- `backend/app/api/` — REST API route handlers.
- `backend/app/models/` — database model classes.
- `backend/app/services/` — business logic services and integration helpers.
- `backend/ai/` — machine learning scoring and trust model code.
- `backend/config.py` — application configuration and environment handling.
- `backend/run.py` — backend startup entry point.

### Contract Structure

- `contracts/` — smart contract source files for trust score and dividend management.

## Technology Stack

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand

### Backend

- Python 3.x
- Flask
- PostgreSQL-compatible data storage
- Redis for caching or queue management
- Celery for background tasks

### AI and Machine Learning

- Scikit-learn
- Fairlearn
- SHAP for model explainability

### Blockchain and Smart Contracts

- Solidity
- Polygon-compatible deployment targets
- Smart contract development for credential and tokenized dividend flows

## Local Setup

The project can be run locally using separate frontend and backend environments. The following steps assume a Windows environment, but the same structure applies to macOS and Linux with minor command differences.

### 1. Frontend Setup

1. Open a terminal and change to the frontend folder:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

4. Open the local development URL shown in the terminal.

### 2. Backend Setup

1. Open a second terminal and change to the backend folder:

```powershell
cd backend
```

2. Create a Python virtual environment:

```powershell
python -m venv venv
```

3. Activate the virtual environment:

```powershell
venv\Scripts\activate
```

4. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

5. Start the backend service:

```powershell
python run.py
```

6. Confirm the backend API is available at the configured local port.

### 3. Smart Contract Workflow

Compile and deploy the Solidity files under the `contracts/` folder using your preferred toolchain, such as Hardhat or Remix. The contracts are designed to run on a Polygon-compatible testnet.

Steps typically include:

1. Configure a deployment environment for Polygon Mumbai or a local Ethereum node.
2. Compile the contracts.
3. Deploy the contracts and record the deployed addresses.
4. Update the frontend and backend configuration if necessary.

## Development Notes

### Frontend

- The UI is built with a focus on modular components and page-based routing.
- User flows include onboarding, wallet integration, trust score review, and lender verification.
- Administrative pages are grouped under `frontend/src/pages/admin/`.

### Backend

- API routes are defined in `backend/app/api/`.
- Business logic is encapsulated in service modules under `backend/app/services/`.
- Background and asynchronous tasks can be implemented with Celery if required.

### AI and Trust Score

- The trust model is located in `ai/trust_model.py`.
- The model uses a combination of platform signals and scoring features.
- SHAP explainability can be used to generate the weight of each feature in the score.

### Contracts

- `contracts/` contains on-chain logic for trust and dividend distribution.
- The smart contracts are intended to be used for recording identity anchors, trust score attestations, and dividend tokens.

## How to Contribute

Contributions are welcome. The preferred workflow is:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make changes with clear commit messages.
4. Open a pull request describing the updates.

Areas where contributions are valuable:

- Improving onboarding and identity flows.
- Expanding test coverage for frontend and backend modules.
- Enhancing privacy and consent controls.
- Adding deployment scripts for contracts.
- Extending trust score explainability and fairness checks.

## Troubleshooting

- If the frontend fails to start, verify Node.js and npm versions and reinstall dependencies.
- If the backend fails to start, confirm the Python virtual environment is active and all requirements are installed.
- If contract deployment fails, check the Solidity compiler version and network configuration.

## Future Improvements

Potential future work includes:

- Full integration with production-grade DID infrastructure.
- A mobile-friendly worker onboarding journey.
- Real zero-knowledge proof implementations for private verifications.
- Data dividend accounting on-chain with token rewards.
- Better explainability and fairness auditing for the scoring engine.

## License

This repository does not currently specify a license file. Add a license to define terms for reuse and contribution.
