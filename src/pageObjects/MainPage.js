import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class MainPage extends BasePage {
    constructor(page) {
        super(page);
        this.headerLocator = page.locator('header');
        this.cardLocator = cardName => page.locator(`//div[contains(@class, "card")]//*[contains(text(), "${cardName}")]`);
        this.expandedGroupLocator = groupName => page.locator(`//div[contains(@class, 'element-list collapse show')]
        //preceding-sibling::span[contains(@class, "group-header")]//*[contains(text(), "${groupName}")]`);
        this.listElement = element => page.locator(`//span[contains(text(), "${element}")]`);
        this.sectionHeaderLocator = header => page.locator(`//h1[contains(text(), "${header}")]`);
    }

    async clickCategoryCard(category){
        const card = this.cardLocator(category);
        await card.waitFor({state: 'visible'});
        await card.click();
    }

    async checkCategoryCards(cardNames) {
        for (const cardName of cardNames) {
            const card = this.cardLocator(cardName);
            await expect(card).toBeVisible();
            console.log(`Card "${cardName}" is visible.`);
        }
    }

    async clickOnElementInCardList(element) {
        const elementInList = this.listElement(element);
        await elementInList.waitFor({ state: 'visible' });
        await elementInList.scrollIntoViewIfNeeded();

        try {
            await elementInList.click();
        } catch (e) {
            await elementInList.evaluate(el => el.click());
        }
    }
}