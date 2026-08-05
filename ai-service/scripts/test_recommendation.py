import os
import sys
import requests
import json

BACKEND_URL = "http://localhost:3000/api/auth"

def run_tests():
    print("==================================================")
    print("  PAL-Net Recommendation System Integration Test  ")
    print("==================================================")
    
    # 1. Attempt Login
    login_url = f"{BACKEND_URL}/login"
    login_data = {
        "email": "mock_student_001@learnpython.edu",
        "password": "123456"
    }
    
    print(f"\n[Test 1] Logging in mock student: {login_data['email']}...")
    try:
        response = requests.post(login_url, json=login_data, timeout=5)
        if response.status_code != 200:
            print(f"❌ Login failed with status {response.status_code}: {response.text}")
            return
            
        auth_data = response.json()
        token = auth_data.get("token")
        if not token:
            print("❌ Token not found in login response.")
            return
            
        print("✅ Login successful! JWT Token acquired.")
    except Exception as e:
        print(f"❌ Network error during login: {e}")
        return
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    
    # 2. Test PAL-Net Recommendations
    print(f"\n[Test 2] Requesting PAL-Net Recommendations...")
    try:
        rec_url = f"{BACKEND_URL}/recommendations?algo=PAL-Net&limit=3"
        response = requests.get(rec_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Engine used: {data.get('engine')}")
            print(json.dumps(data.get("data"), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Recommendations failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error requesting recommendations: {e}")

    # 3. Test BKT Recommendations
    print(f"\n[Test 3] Requesting BKT Recommendations...")
    try:
        rec_url = f"{BACKEND_URL}/recommendations?algo=BKT&limit=3"
        response = requests.get(rec_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Engine used: {data.get('engine')}")
            print(json.dumps(data.get("data"), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Recommendations failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error requesting recommendations: {e}")

    # 4. Test DKT Recommendations
    print(f"\n[Test 4] Requesting DKT Recommendations...")
    try:
        rec_url = f"{BACKEND_URL}/recommendations?algo=DKT&limit=3"
        response = requests.get(rec_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Engine used: {data.get('engine')}")
            print(json.dumps(data.get("data"), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Recommendations failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error requesting recommendations: {e}")

    # 5. Test Fallback Mechanism (AI Service Timeout / Offline Simulation)
    # We can query with a fake algo or fake server url, but we can also simulate it
    print(f"\n[Test 5] Simulating AI Service Offline fallback check:")
    print("Testing local rule-based recommendations on backend...")
    # To test fallback directly without stopping server, we can query backend with a fake algorithm name
    # which will cause the AI service to return an error, trigger the backend fallback
    try:
        # FastAPI /recommend checks algo regex="^(BKT|DKT|PAL-Net)$", if other is passed it returns 422 error
        # which triggers the catch-block in recommendController and falls back to rule-based!
        rec_url = f"{BACKEND_URL}/recommendations?algo=INVALID_ALGO&limit=3"
        response = requests.get(rec_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Fallback Triggered successfully! Engine used: {data.get('engine')} (expected: FALLBACK_RULE_BASED)")
            print(json.dumps(data.get("data"), indent=2, ensure_ascii=False))
        else:
            print(f"❌ Fallback test failed: status {response.status_code}")
    except Exception as e:
        print(f"❌ Error during fallback simulation: {e}")
        
    print("\n==================================================")
    print("                Tests Completed                   ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
