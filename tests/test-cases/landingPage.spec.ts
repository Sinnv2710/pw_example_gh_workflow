import { test, expect } from '@playwright/test'

test.describe('ImageGalleryDemo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demos.telerik.com/aspnet-ajax/imagegallery/')
  })

  test('TC-POS-001 - Search for a destination @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('Paris')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.locator('.rgMasterTable')).toBeVisible()
  })

  test('TC-POS-002 - Select an image @critical', async ({ page }) => {
    await page.getByRole('button', { name: 'select' }).first().click()
    await expect(page.locator('.t-selected')).toBeVisible()
  })

  test('TC-POS-003 - Submit the form @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('New York')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await page.getByRole('button', { name: 'select' }).first().click()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('#successMessage')).toBeVisible()
  })

  test('TC-NEG-001 - Search with invalid input @medium', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('12345')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.getByText('Invalid input')).toBeVisible()
  })

  test('TC-NEG-002 - Select an image without searching @medium', async ({ page }) => {
    await page.getByRole('button', { name: 'select' }).first().click()
    await expect(page.getByText('No search results')).toBeVisible()
  })

  test('TC-EDGE-001 - Search with very long input @low', async ({ page }) => {
    const longInput = 'a'.repeat(500)
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill(longInput)
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.getByText('Input too long')).toBeVisible()
  })

  test('TC-EDGE-002 - Select an image with special characters @low', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('!@#$%^&*()')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.getByText('Invalid input')).toBeVisible()
  })
})