import BasePage from './BasePage.js';

export default class TextBoxPage extends BasePage {

    constructor(page) {
        super(page);
        this.page = page;

        this.header = page.locator('h1'); // Заголовок страницы
        this.fullNameInput = page.locator('#userName');
        this.emailInput = page.locator('#userEmail');
        this.currentAddressInput = page.locator('textarea#currentAddress');
        this.permanentAddressInput = page.locator('textarea#permanentAddress');

        this.submitButton = page.locator('#submit');

        this.outputBlock = page.locator('#output');

        this.nameOutput = page.locator('#output #name');
        this.emailOutput = page.locator('#output #email');
        this.currentAddressOutput = page.locator('#output #currentAddress');
        this.permanentAddressOutput = page.locator('#output #permanentAddress');
    }
    async fillTextBoxForm(user) {
        await this.fullNameInput.fill(user.userName);
        await this.emailInput.fill(user.email);
        await this.currentAddressInput.fill(user.currentAddress);
        await this.permanentAddressInput.fill(user.permanentAddress);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async getOutputFieldText(fieldName) {
        switch (fieldName) {
            case 'Name':
                return await this.nameOutput.textContent();
            case 'Email':
                return await this.emailOutput.textContent();
            case 'Current Address':
                return await this.currentAddressOutput.textContent();
            case 'Permanent Address':
                return await this.permanentAddressOutput.textContent();
            default:
                throw new Error(`Unknown field name: ${fieldName}`);
        }
    }

    async getOutputFieldValue(fieldName) {
        const text = await this.getOutputFieldText(fieldName);
        const parts = text.split(':');
        if (parts.length < 2) throw new Error(`Invalid output format for ${fieldName}`);
        return parts[1].trim();
    }
}

