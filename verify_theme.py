import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        await page.goto('http://localhost:5173/internal')

        # Inject session directly into sessionStorage
        await page.evaluate("""
            sessionStorage.setItem('dr_internal_session', JSON.stringify({
                id: 1,
                username: 'admin',
                email: 'admin@thedynamicrankers.com',
                role: 'SUPERUSER'
            }));
        """)

        # Reload to trigger login skip
        await page.reload()

        # Wait for dashboard to load
        await page.wait_for_selector('text=OPERATIONS')

        # Capture Task List Light
        await page.evaluate("document.documentElement.classList.remove('dark')")
        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/internal_tasks_light.png')

        # Capture Task List Dark
        await page.evaluate("document.documentElement.classList.add('dark')")
        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/internal_tasks_dark.png')

        # Capture Customers Light
        await page.click('button:has-text("Customers")')
        await page.evaluate("document.documentElement.classList.remove('dark')")
        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/internal_customers_light.png')

        print("Captured all screenshots")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify())
