import { test, expect } from '@playwright/test';
import { MainPage, AlertsPage } from '../src/pageObjects';

test.describe.configure({ timeout: 60000 });
test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });

    await test.step('Navigate to Alerts section', async () => {
        await mainPage.clickCategoryCard('Alerts, Frame & Windows');
        await mainPage.clickOnElementInCardList('Alerts');
    });
});

const handleDialog = async (page, expectedMessage, action = 'accept', promptInput = '') => {
    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe(expectedMessage);
        if (action === 'accept') {
            await dialog.accept(promptInput);
        } else {
            await dialog.dismiss();
        }
    });
};

test('alert/positive: Simple alert shows correct message', async ({ page }) => {
    const alertsPage = new AlertsPage(page);

    await test.step('Trigger simple alert and verify message', async () => {
        await handleDialog(page, 'You clicked a button');
        await alertsPage.selectors.alertButton.click();
    });
});

test('alert/positive: Timer alert appears after 5 seconds', async ({ page }) => {
    const alertsPage = new AlertsPage(page);

    await test.step('Trigger timer alert and wait for it', async () => {
        await handleDialog(page, 'This alert appeared after 5 seconds');
        await alertsPage.selectors.timerAlertButton.click();
        await page.waitForEvent('dialog', { timeout: 7000 });
    });
});

test('alert/positive: Confirm alert - accept', async ({ page }) => {
    const alertsPage = new AlertsPage(page);

    await test.step('Accept confirm alert and verify result', async () => {
        await handleDialog(page, 'Do you confirm action?', 'accept');
        await alertsPage.selectors.confirmButton.click();
        await expect(alertsPage.selectors.confirmResult).toHaveText('You selected Ok');
    });
});

test('alert/positive: Confirm alert - dismiss', async ({ page }) => {
    const alertsPage = new AlertsPage(page);

    await test.step('Dismiss confirm alert and verify result', async () => {
        await handleDialog(page, 'Do you confirm action?', 'dismiss');
        await alertsPage.selectors.confirmButton.click();
        await expect(alertsPage.selectors.confirmResult).toHaveText('You selected Cancel');
    });
});

test('alert/positive: Prompt alert - accept with input', async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    const inputText = 'Playwright';

    await test.step('Accept prompt with input and verify result', async () => {
        await handleDialog(page, 'Please enter your name', 'accept', inputText);
        await alertsPage.selectors.promptButton.click();
        await expect(alertsPage.selectors.promptResult).toHaveText(`You entered ${inputText}`);
    });
});

test('alert/positive: Prompt alert - dismiss', async ({ page }) => {
    const alertsPage = new AlertsPage(page);

    await test.step('Dismiss prompt and verify no result', async () => {
        await handleDialog(page, 'Please enter your name', 'dismiss');
        await alertsPage.selectors.promptButton.click();
        await expect(alertsPage.selectors.promptResult).toHaveCount(0);
    });
});
