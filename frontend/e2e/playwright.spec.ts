import { test, expect } from '@playwright/test'

test.describe('Carbon Tracker', () => {
  test('full user journey: sign up → log action → view dashboard', async ({ page }) => {
    // Sign up
    await page.goto('/signup')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*\/dashboard/)

    // Log a transport action
    await page.goto('/actions')
    await page.click('button:has-text("Transport")')
    await page.fill('input[name="distance_km"]', '100')
    await page.selectOption('select[name="subcategory"]', 'car')
    await page.click('button:has-text("Log Action")')
    await expect(page.getByText('Action logged')).toBeVisible()

    // View dashboard
    await page.goto('/dashboard')
    await expect(page.locator('text=kg CO₂').first()).toBeVisible()
  })

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/login')
    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'email')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'password')
  })

  test('demo page accessible without login', async ({ page }) => {
    // Navigating directly to demo should work, no redirect to sign-in
    await page.goto('/demo');
    await expect(page).toHaveURL(/\/demo/);
    await expect(page.locator('text=Preview Mode — No Login Required').first()).toBeVisible();
    await expect(page.locator('text=Monthly Footprint').first()).toBeVisible();
  });

  test('landing page to demo navigation', async ({ page }) => {
    await page.goto('/');
    // Click on demo button
    await page.click('button:has-text("View Demo Dashboard")');
    await expect(page).toHaveURL(/\/demo/);
  });
})
