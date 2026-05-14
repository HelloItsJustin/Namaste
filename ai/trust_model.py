import numpy as np
import pandas as pd
import pickle
import os

import importlib

def _get_ml_libs():
    try:
        sklearn_ensemble = importlib.import_module('sklearn.ensemble')
        fairlearn_reductions = importlib.import_module('fairlearn.reductions')
        shap = importlib.import_module('shap')
        return {
            'RandomForestRegressor': sklearn_ensemble.RandomForestRegressor,
            'ExponentiatedGradient': fairlearn_reductions.ExponentiatedGradient,
            'DemographicParity': fairlearn_reductions.DemographicParity,
            'shap': shap,
            'HAS_AI_LIBS': True
        }
    except ImportError:
        return {'HAS_AI_LIBS': False}

ML_LIBS = _get_ml_libs()
HAS_AI_LIBS = ML_LIBS['HAS_AI_LIBS']

class NamasteModel:
    """
    Core AI Model for NAMASTE TrustScore.
    Includes training with fairness constraints and SHAP explainability.
    """
    def __init__(self, model_path='ai/model.pkl'):
        self.model_path = model_path
        self.model = None
        self.explainer = None
        
    def train(self, X, y, sensitive_features):
        if not HAS_AI_LIBS:
            print("AI libraries not found. Training skipped.")
            return
            
        base_regressor = ML_LIBS['RandomForestRegressor'](n_estimators=100, max_depth=10)
        
        # Apply Fairlearn reduction to enforce demographic parity
        self.model = ML_LIBS['ExponentiatedGradient'](
            base_regressor,
            constraints=ML_LIBS['DemographicParity']()
        )
        
        self.model.fit(X, y, sensitive_features=sensitive_features)
        
        # Save model
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
            
        # Initialize SHAP explainer
        self.explainer = ML_LIBS['shap'].TreeExplainer(self.model.predictors_[0])
        
    def predict(self, X):
        if not HAS_AI_LIBS:
            return np.array([600] * len(X)) # Fallback score
        if not self.model:
            self.load()
        return self.model.predict(X)
        
    def explain(self, X):
        if not HAS_AI_LIBS or not self.explainer:
            return None
        return self.explainer.shap_values(X)
        
    def load(self):
        if not HAS_AI_LIBS: return
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            self.explainer = ML_LIBS['shap'].TreeExplainer(self.model.predictors_[0])
        else:
            raise FileNotFoundError("Model not found. Please train first.")

if __name__ == "__main__":
    # Example training script
    print("Initializing synthetic training data...")
    n_samples = 1000
    # Features: completion_rate, income, tenure, punctuality, vouch_count
    X = pd.DataFrame(np.random.rand(n_samples, 5), columns=['completion', 'income', 'tenure', 'punctuality', 'vouches'])
    # Sensitive feature: region (0 or 1)
    sensitive = pd.Series(np.random.randint(0, 2, n_samples), name='region')
    
    # Target: TrustScore (300-900)
    y = 300 + (X['completion'] * 200 + X['income'] * 150 + X['tenure'] * 100 + X['punctuality'] * 100 + X['vouches'] * 50)
    
    print("Training Fairness-Audited TrustScore model...")
    namaste_ai = NamasteModel()
    namaste_ai.train(X, y, sensitive_features=sensitive)
    print("Training complete. Model saved to ai/model.pkl")
