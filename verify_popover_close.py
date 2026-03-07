import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

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

        # 1. Verify NewTaskModal Close
        await page.click("button:has-text('Tasks')")
        # Find Initialize New Directive button
        await page.click("button:has-text('Initialize New Directive')")
        modal = page.locator("text=Issue Command >> nth=1")
        await modal.wait_for(state="visible")
        print("NewTaskModal: Visible")

        # Click backdrop
        await page.click("div.fixed.inset-0.z-\[100\]", position={"x": 5, "y": 5})
        await page.wait_for_timeout(500)
        if not await modal.is_visible():
            print("NewTaskModal: Closed on backdrop click")

        # 2. Verify TaskDetailView Dropdown Close
        await page.locator("div.grid.grid-cols-\[1fr_180px_140px_160px_140px\]").nth(1).click()

        status_btn = page.locator("button:has-text('Backlog'), button:has-text('To Do'), button:has-text('In Progress'), button:has-text('Review'), button:has-text('Completed')").first
        await status_btn.click()

        dropdown = page.locator("text=Backlog >> nth=1, text=To Do >> nth=1, text=In Progress >> nth=1")
        await dropdown.first.wait_for(state="visible")
        print("Task Status Dropdown: Visible")

        # Click elsewhere (backdrop)
        await page.click("div.fixed.inset-0.z-40")
        await page.wait_for_timeout(500)
        if not await dropdown.first.is_visible():
            print("Task Status Dropdown: Closed on outside click")

        await browser.close()

asyncio.run(verify())
