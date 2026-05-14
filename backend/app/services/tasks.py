from app import celery, db
from app.models.models import Worker, Dividend
from app.services.jlyn_service import jlyn_cipher
import secrets
import time

@celery.task(name='tasks.distribute_dividends')
def distribute_dividends():
    """
    Async task to distribute micro-dividends to workers based on platform data usage.
    Simulates checking platform logs and issuing on-chain dividends.
    """
    workers = Worker.query.all()
    if not workers:
        return "No workers found"

    for worker in workers:
        # Simulate data usage calculation
        # In a real scenario, this would query ONDC/Swiggy/Zomato logs
        dividend_amount = round(secrets.randbelow(150) / 10.0, 2) # ₹0 to ₹15
        
        if dividend_amount > 0:
            new_div = Dividend(
                worker_id=worker.id,
                amount=dividend_amount,
                source="Platform Data Sync (ONDC)",
                type="credit",
                tx_hash=f"0x{secrets.token_hex(32)}",
                status="confirmed"
            )
            db.session.add(new_div)
    
    db.session.commit()
    return f"Distributed dividends to {len(workers)} workers"

@celery.task(name='tasks.issue_credential_onchain')
def issue_credential_onchain(worker_id, credential_type, ipfs_hash):
    """
    Async task to anchor a VC on the Polygon blockchain.
    """
    # Simulate blockchain interaction delay
    time.sleep(2)
    # In reality, use web3.py to call CredentialRegistry.sol
    return f"Anchored {credential_type} for {worker_id} on-chain"
