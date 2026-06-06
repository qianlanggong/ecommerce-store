import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page and display main content', async ({ page }) => {
    await page.goto('/en');
    
    await expect(page).toHaveTitle(/Maison Artisan/);
    
    await expect(page.getByText(/Shop Now/).or(page.getByText(/shopNow/))).toBeVisible();
    
    await expect(page.getByText(/Best Sellers/).or(page.getByText(/bestSellers/))).toBeVisible();
  });

  test('should navigate to products page from home', async ({ page }) => {
    await page.goto('/en');
    
    await page.getByRole('link', { name: /Shop Now/ }).or(page.getByRole('link', { name: /shopNow/ })).click();
    
    await expect(page).toHaveURL(/\/products/);
  });

  test('should display language switcher', async ({ page }) => {
    await page.goto('/en');
    
    await expect(page.getByRole('button', { name: /English/ }).or(page.getByRole('button', { name: /中文/ }))).toBeVisible();
  });
});
