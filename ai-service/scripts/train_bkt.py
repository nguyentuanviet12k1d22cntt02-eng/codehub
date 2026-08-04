import os
import pandas as pd
import sys

# Ensure core directory is in the PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from core.bkt import BKTModel

DATA_PATH = os.path.join(BASE_DIR, "data", "mock_user_history.csv")
OUT_PATH = os.path.join(BASE_DIR, "data", "bkt_parameters.json")

def main():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Mock user history data not found at {DATA_PATH}. Run mock data generator first.")
        return

    print("Loading student interaction history...")
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} records. Training BKT baseline models...")

    model = BKTModel()
    model.fit(df)

    print(f"Saving baseline BKT parameters to {OUT_PATH}...")
    model.save(OUT_PATH)
    print("BKT Model training complete.")

if __name__ == "__main__":
    main()
