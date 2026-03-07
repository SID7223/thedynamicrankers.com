import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Mock session
        await page.goto("http://localhost:5173/internal")
        await page.evaluate("""() => {
            sessionStorage.setItem('dr_internal_session', JSON.stringify({
                id: 'sid-uuid',
                username: 'SID',
                email: 'saadumar7223@gmail.com',
                role: 'SuperAdmin'
            }));
        }""")
        await page.reload()

        # 1. Expand sidebar if collapsed
        toggle = page.locator("button[title*='Sidebar']")
        title = await toggle.get_attribute("title")
        if "Expand" in title:
            await toggle.click()
            await page.wait_for_timeout(500)

        # 2. Check Expanded Width
        sidebar = page.locator(".lg\:relative")
        box = await sidebar.bounding_box()
        print(f"Expanded Width: {box['width']}")

        # 3. Collapse
        await toggle.click()
        await page.wait_for_timeout(1000) # Wait for transition

        box = await sidebar.bounding_box()
        print(f"Collapsed Width: {box['width']}")

        # 4. Check for tooltip
        dashboard_btn = page.locator("button[aria-label='Dashboard']")
        title = await dashboard_btn.get_attribute("title")
        print(f"Collapsed Tooltip: {title}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
