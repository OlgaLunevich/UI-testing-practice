import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';
import FormPage from '../src/pageObjects/FormPage';
import DataStorage from '../src/helpers/DataStorage';

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/', { waitUntil: 'domcontentloaded' });
});

test('form/positive: Fill form and verify submitted data', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new FormPage(page);

    await test.step('Navigate to Practice Form', async () => {
        await mainPage.clickCategoryCard('Forms');
        await mainPage.clickOnElementInCardList('Practice Form');
        await expect(mainPage.sectionHeaderLocator('Practice Form')).toBeVisible();
    });

    await test.step('Fill and submit the form', async () => {
        await formPage.removeFixedBanner();
        await formPage.fillMandatoryFormFields('USER', 1);

        const submitButton = page.getByRole('button', { name: 'Submit' });
        await submitButton.waitFor({ state: 'visible', timeout: 5000 });

        try {
            await submitButton.click({ force: true });
        } catch {
            await page.evaluate(() => document.querySelector('button#submit')?.click());
        }
    });

    await test.step('Verify modal window appears', async () => {
        await formPage.modalWindowForm.waitFor({ state: 'visible', timeout: 10000 });
        await expect(formPage.modalWindowForm).toBeVisible();
    });

    await test.step('Verify submitted form data', async () => {
        const userData = DataStorage.getNamespace('USER', 1);

        const studentName = await formPage.modalWindowFormField('Student Name').textContent();
        const gender = await formPage.modalWindowFormField('Gender').textContent();
        const mobile = await formPage.modalWindowFormField('Mobile').textContent();

        expect(studentName?.trim()).toBe(userData.userName);
        expect(gender?.trim()).toBe(userData.gender);
        expect(mobile?.trim()).toBe(userData.phoneNumber);
    });
});

test('form/negative: Submit form with empty required fields', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new FormPage(page);

    await test.step('Navigate to Practice Form and submit empty form', async () => {
        await mainPage.clickCategoryCard('Forms');
        await mainPage.clickOnElementInCardList('Practice Form');
        await formPage.removeFixedBanner();

        const submitButton = page.getByRole('button', { name: 'Submit' });
        await submitButton.waitFor({ state: 'visible' });
        await submitButton.click({ force: true });

        await expect(formPage.modalWindowForm).not.toBeVisible();
    });

    await test.step('Verify validation for required fields', async () => {
        const firstNameValid = await formPage.firstNameField.evaluate(el => el.checkValidity());
        const lastNameValid = await formPage.lastNameField.evaluate(el => el.checkValidity());
        const phoneValid = await formPage.mobileNumberField.evaluate(el => el.checkValidity());

        expect(firstNameValid).toBe(false);
        expect(lastNameValid).toBe(false);
        expect(phoneValid).toBe(false);
    });
});

