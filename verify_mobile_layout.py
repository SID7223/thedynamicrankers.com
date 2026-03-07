import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # iPhone 12 Dimensions
        context = await browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        page = await context.new_page()

        await page.goto("http://localhost:5173/internal")
        await page.evaluate("""() => {
            sessionStorage.setItem('dr_internal_session', JSON.stringify({
                id: 'agent-123',
                username: 'VerificationAgent',
                email: 'agent@test.com',
                role: 'superuser'
            }));
        }""")
        await page.reload()

        # 1. Check Menu Button and Top Padding
        menu_btn = page.locator("button >> .lucide-menu")
        await menu_btn.wait_for(state="visible")
        print("Mobile Menu Button: Visible")

        # Check if content is shifted down (pt-24 is 96px)
        content = page.locator("div.flex-1.h-full.overflow-hidden.flex.flex-col").first
        padding_top = await content.evaluate("el => window.getComputedStyle(el).paddingTop")
        print(f"Content Top Padding: {padding_top}")

        await page.screenshot(path="/home/jules/verification/mobile_dashboard_top.png")

        # 2. Check Swipe Hint
        await page.click("button:has-text('Tasks')")
        hint = page.locator("text=Tip: Swipe left on details to close.")
        if await hint.is_visible():
            print("Mobile UX Hint: Visible")

        await browser.close()

asyncio.run(verify())
