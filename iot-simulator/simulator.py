import time
import json
import random
import requests
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:3001"
INTERVAL_SECONDS = 5

def get_lotes():
    try:
        response = requests.get(f"{BACKEND_URL}/api/lotes")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching lotes: {e}")
        return []

def generate_sensor_data(lote_id):
    return {
        "loteId": lote_id,
        "temperatura": round(random.uniform(15, 30), 1),
        "humedad": round(random.uniform(50, 80), 1),
        "peso": round(random.uniform(500, 2000), 2),
    }

def send_reading(data):
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/iot/lecturas",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error sending reading: {e}")
        return False

def main():
    print("🌡️  CoffeeTrace IoT Simulator starting...")
    print(f"   Backend: {BACKEND_URL}")
    print(f"   Interval: {INTERVAL_SECONDS}s")
    print("-" * 40)

    while True:
        lotes = get_lotes()

        if not lotes:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] No lotes found, retrying...")
        else:
            for lote in lotes[:3]:  # Only simulate for first 3 lotes
                lote_id = lote["id"]
                codigo = lote.get("codigo", lote_id[:8])
                data = generate_sensor_data(lote_id)

                if send_reading(data):
                    print(
                        f"[{datetime.now().strftime('%H:%M:%S')}] "
                        f"Lote {codigo} | "
                        f"Temp: {data['temperatura']}°C | "
                        f"Hum: {data['humedad']}% | "
                        f"Peso: {data['peso']}kg"
                    )

        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Simulator stopped")
