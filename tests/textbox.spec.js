import { test, expect } from '@playwright/test';
import { MainPage, TextBoxPage } from '../src/pageObjects';
import UserCreator from '../src/helpers/UserCreator';

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/', { waitUntil: 'domcontentloaded' });
});

test('positive: Fill Text Box form with valid data and verify output', async ({ page }) => {
    const mainPage = new MainPage(page);
    const textBoxPage = new TextBoxPage(page);
    const user = UserCreator.createUser();

    await mainPage.clickCategoryCard('Elements');
    await mainPage.clickOnElementInCardList('Text Box');
    await textBoxPage.removeFixedBanner();

    await expect(textBoxPage.header).toHaveText('Text Box');

    await textBoxPage.fillTextBoxForm(user);
    await textBoxPage.submitForm();

    await expect(textBoxPage.outputBlock).toBeVisible();

    await expect(await textBoxPage.getOutputFieldValue('Name')).toBe(user.userName);
    await expect(await textBoxPage.getOutputFieldValue('Email')).toBe(user.email);
    await expect(await textBoxPage.getOutputFieldValue('Current Address')).toBe(user.currentAddress);
    await expect(await textBoxPage.getOutputFieldValue('Permanent Address')).toBe(user.permanentAddress);
});

test('negative: Do not submit form with invalid email', async ({ page }) => {
    const mainPage = new MainPage(page);
    const textBoxPage = new TextBoxPage(page);
    const user = UserCreator.createUser();
    user.email = 'invalidEmail.com';

    await mainPage.clickCategoryCard('Elements');
    await mainPage.clickOnElementInCardList('Text Box');
    await textBoxPage.removeFixedBanner();

    await expect(textBoxPage.header).toHaveText('Text Box');

    await textBoxPage.fillTextBoxForm(user);
    await textBoxPage.submitForm();

    await expect(textBoxPage.outputBlock).not.toBeVisible();

    const isEmailValid = await textBoxPage.emailInput.evaluate(el => el.checkValidity());
    expect(isEmailValid).toBe(false);
});

