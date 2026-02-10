from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:5173')
        # Wait for any animations to settle
        page.wait_for_timeout(2000)
        page.screenshot(path='hero_no_stats.png', full_page=True)
        browser.close()

if __name__ == '__main__':
    run()
