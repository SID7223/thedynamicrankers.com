import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Test with a smaller laptop height (768px)
        context = await browser.new_context(viewport={'width': 1280, 'height': 768})
        page = await context.new_page()

        await page.goto("http://localhost:5173/internal")
        await page.evaluate("""() => {
            sessionStorage.setItem('dr_internal_session', JSON.stringify({
                id: 'agent-123',
                username: 'VerificationAgent',
                email: 'agent@test.com',
                role: 'SuperAdmin'
            }));
        }""")
        await page.reload()

        sidebar = page.locator("div.bg-zinc-50.dark\\:bg-\\[\\#0B101A\\]").first
        await sidebar.wait_for(state="visible")

        # Check if the logout button is visible without scrolling
        logout_btn = page.locator("button[title='Initialize Logout']")
        is_visible = await logout_btn.is_visible()

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/sidebar_compact_768.png")

        print(f"Logout Button Visible on 768px height: {is_visible}")

        # Check collapsed too
        toggle_btn = page.locator("button[title='Collapse Sidebar']")
        await toggle_btn.click()
        await page.wait_for_timeout(500)
        await page.screenshot(path="/home/jules/verification/sidebar_collapsed_compact_768.png")
        is_visible_collapsed = await logout_btn.is_visible()
        print(f"Logout Button Visible (Collapsed) on 768px height: {is_visible_collapsed}")

        await browser.close()

asyncio.run(verify())
