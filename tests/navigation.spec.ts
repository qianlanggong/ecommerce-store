import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate through main navigation links', async ({ page }) => {
    await page.goto('/en');
    
    await page.getByRole('link', { name: /Products/ }).or(page.getByRole('link', { name: /products/ })).click();
    await expect(page).toHaveURL(/\/products/);
    
    await page.goto('/en');
    
    await page.getByRole('link', { name: /Cart/ }).or(page.getByRole('link', { name: /cart/ })).click();
    await expect(page).toHaveURL(/\/cart/);
    
    await page.goto('/en');
    
    await page.getByRole('link', { name: /Account/ }).or(page.getByRole('link', { name: /account/ })).click();
    await expect(page).toHaveURL(/\/account/);
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/en');
    
    await page.getByRole('button', { name: /English/ }).or(page.getByRole('button', { name: /中文/ })).click();
    
    await page.getByRole('link', { name: /中文/ }).or(page.getByRole('link', { name: /English/ })).click();
    
    await expect(page).toHaveURL(/\/zh/);
  });
});
