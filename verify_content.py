from playwright.sync_api import sync_playwright
import subprocess
import time
import os

def run_test():
    # Build and serve
    subprocess.run(["npm", "run", "build"], check=True)
    serve_proc = subprocess.Popen(["npx", "serve", "-s", "dist", "-l", "5173"])
    time.sleep(5)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            errors = []
            page.on("pageerror", lambda exc: errors.append(exc))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

            print("Navigating to homepage...")
            page.goto("http://localhost:5173", wait_until="networkidle")

            print(f"Page title: {page.title()}")
            content = page.content()
            print(f"Content length: {len(content)}")

            # Check for common elements
            if "Elevate Your" in content:
                print("Found Hero content.")
            else:
                print("Hero content NOT found!")
                print("First 500 chars of content:")
                print(content[:500])

            if errors:
                print(f"Found {len(errors)} errors:")
                for err in errors:
                    print(f"  - {err}")
            else:
                print("No errors found.")

            browser.close()
    finally:
        serve_proc.terminate()

if __name__ == "__main__":
    run_test()
