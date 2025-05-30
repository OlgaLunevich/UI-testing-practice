import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';
import SelectMenuPage from '../src/pageObjects/SelectMenuPage.js';

test.describe.configure({ timeout: 60000 });

test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);

    await page.goto('https://demoqa.com/', { waitUntil: 'domcontentloaded' });

    await test.step('Navigate to Select Menu page', async () => {
        await mainPage.clickCategoryCard('Widgets');
        await mainPage.clickOnElementInCardList('Select Menu');
        await expect(mainPage.sectionHeaderLocator('Select Menu')).toBeVisible();
    });
});

test('select-menu/positive: Select Value - Group 2, option 1', async ({ page }) => {
    const selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.removeFixedBanner();

    await test.step('Select Group 2, option 1', async () => {
        await selectMenuPage.selectValue('Group 2, option 1');
    });
});

test('select-menu/positive: Select One - Other', async ({ page }) => {
    const selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.removeFixedBanner();

    await test.step('Select "Other" from single select', async () => {
        await selectMenuPage.selectOne('Other');
    });
});

test('select-menu/positive: Old Style Select Menu - Green', async ({ page }) => {
    const selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.removeFixedBanner();

    await test.step('Select Green from old style dropdown', async () => {
        await selectMenuPage.selectOldStyle('Green');
    });
});

test('select-menu/positive: Multiselect dropdown - Black, Blue', async ({ page }) => {
    const selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.removeFixedBanner();

    await test.step('Select multiple options in multi-select', async () => {
        await selectMenuPage.selectMultipleOptions(['Black', 'Blue']);
    });
});


