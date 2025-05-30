import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';
import ToolTipsPage from '../src/pageObjects/ToolTipsPage.js';

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/', { waitUntil: 'domcontentloaded' });
});

test('Check all tooltips text', async ({ page }) => {
    const mainPage = new MainPage(page);
    const toolTipsPage = new ToolTipsPage(page);

    await mainPage.clickCategoryCard('Widgets');
    await mainPage.clickOnElementInCardList('Tool Tips');

    await toolTipsPage.removeFixedBanner();

    await test.step('Check tooltip on Button', async () => {
        const text = await toolTipsPage.hoverAndGetTooltipText('Button');
        expect(text.trim()).toBe('You hovered over the Button');
    });

    await test.step('Check tooltip on Text Field', async () => {
        const text = await toolTipsPage.hoverAndGetTooltipText('Text Field');
        expect(text.trim()).toBe('You hovered over the text field');
    });

    await test.step('Check tooltip on Contrary link', async () => {
        const text = await toolTipsPage.hoverAndGetTooltipText('Contrary');
        expect(text.trim()).toBe('You hovered over the Contrary');
    });

    await test.step('Check tooltip on Section link', async () => {
        const text = await toolTipsPage.hoverAndGetTooltipText('Section');
        expect(text.trim()).toBe('You hovered over the 1.10.32');
    });
});

