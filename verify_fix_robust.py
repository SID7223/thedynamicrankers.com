import os
import subprocess
import time
from playwright.sync_api import sync_playwright

def run_test():
    # Start the dev server
    proc = subprocess.Popen(["npm", "run", "dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(5)  # Wait for server to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            errors = []
            page.on("pageerror", lambda exc: errors.append(exc))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

            # Check homepage
            print("Checking homepage...")
            try:
                page.goto("http://localhost:5173", wait_until="networkidle")
            except Exception as e:
                print(f"Navigation failed: {e}")

            if errors:
                print(f"Found {len(errors)} errors on homepage:")
                for err in errors:
                    print(f"  - {err}")
            else:
                print("No errors found on homepage.")

            browser.close()
    finally:
        proc.terminate()

if __name__ == "__main__":
    run_test()
