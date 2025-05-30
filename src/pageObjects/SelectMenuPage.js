import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class SelectMenuPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.selectValueDropdown = page.locator('#withOptGroup');
        this.selectOneDropdown = page.locator('#selectOne');
        this.oldStyleDropdown = page.locator('#oldSelectMenu');

        this.optionByText = text => page.locator(`div[id*="option"] >> text="${text}"`);
        this.oldStyleOption = text => page.locator(`#oldSelectMenu >> option[value="${text.toLowerCase()}"]`);
        this.multiSelectWrapper = page.locator('#selectMenuContainer div[class*="multi-value__value-container"]');
        this.multiSelectOption = text => page.locator(`div[id^="react-select"] >> text="${text}"`);

        this.multiSelectDropdownArrow = this.page.locator(`
          //div[contains(@class, "col-md-6") and .//p/b[text()="Multiselect drop down"]]
          /div[contains(@class, "css-2b097c-container")]
          /div[contains(@class, "css-yk16xz-control")]
          /div[contains(@class, "css-1wy0on6")]
          /div[contains(@class, "css-tlfecz-indicatorContainer")]
        `);
    }

    async selectValue(optionText) {
        await this.selectValueDropdown.click();
        await this.optionByText(optionText).click();
    }

    async selectOne(optionText) {
        await this.selectOneDropdown.click();
        await this.optionByText(optionText).click();
    }

    async selectOldStyle(optionText) {
        await this.oldStyleDropdown.selectOption({ label: optionText });

        const selectedValue = await this.oldStyleDropdown.inputValue();
        const selectedOption = this.oldStyleOption(selectedValue);
        await expect(selectedOption).toHaveText(optionText);
    }


    async toggleMultiSelectDropdown() {
        await this.multiSelectDropdownArrow.scrollIntoViewIfNeeded();
        await this.multiSelectDropdownArrow.click();
    }

    async closeMultiSelectDropdown() {
        await this.page.click('html');
    }

    async selectMultipleOptions(optionTexts) {
        await this.toggleMultiSelectDropdown();

        for (const optionText of optionTexts) {
            const option = this.multiSelectOption(optionText);
            await option.waitFor({ state: 'visible' });
            await option.click();
            await expect(option).toBeHidden(); // подтверждение выбора
        }

        await this.closeMultiSelectDropdown();

        for (const value of optionTexts) {
            await expect(this.multiSelectWrapper).toContainText(value, { timeout: 10000 });
        }
    }
}
