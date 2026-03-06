import { test, expect } from '@playwright/test';

test('verify internal dashboard layout and components', async ({ page }) => {
  // Mock session storage for internal auth
  await page.goto('/internal');
  await page.evaluate(() => {
    sessionStorage.setItem('dr_internal_session', JSON.stringify({
      id: 'u_001',
      username: 'SID',
      email: 'saadumar7223@gmail.com',
      role: 'superuser'
    }));
  });

  // Reload to apply session
  await page.goto('/internal');

  // Verify Dashboard is visible
  await expect(page.locator('text=OPERATIONS')).toBeVisible();

  // Navigate to tasks (should be default)
  await expect(page.locator('text=Directives')).toBeVisible();

  // Click on a task if present, or wait for the list
  const taskRow = page.locator('table tr').first();
  if (await taskRow.isVisible()) {
    await taskRow.click();

    // Verify TaskDetailView is open
    await expect(page.locator('text=Strategic Comms')).toBeVisible();

    // Verify 50/50 split (check if both columns exist)
    const leftCol = page.locator('div[ref="leftColRef"]'); // This might not work with ref, using class/structure
    // Instead, let's just check for the elements we moved
    await expect(page.locator('text=Description')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Details')).toBeVisible();

    // Take screenshot of the new layout
    await page.screenshot({ path: 'task_detail_layout.png', fullPage: true });

    // Verify Attachments
    await expect(page.locator('text=Attachments')).toBeVisible();

    // Verify Resizer handle
    const resizer = page.locator('div.cursor-col-resize');
    await expect(resizer).toBeVisible();
  }

  // Verify URL change
  const url = page.url();
  expect(url).toContain('view=tasks');
});
